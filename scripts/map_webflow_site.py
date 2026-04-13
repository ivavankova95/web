#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import re
import ssl
import sys
import time
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from typing import Dict, Iterable, List, Optional
from urllib.parse import urljoin, urlparse


BASE_URL = "https://www.zdravimebavi.cz"
ROOT = Path(__file__).resolve().parents[1]
ANALYSIS_DIR = ROOT / "analysis"
RAW_HTML_DIR = ANALYSIS_DIR / "raw-html"
DOM_DIR = ANALYSIS_DIR / "dom-trees"

HTML_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; CodexSiteMapper/1.0; "
        "+https://openai.com)"
    ),
    "Accept": (
        "text/html,application/xhtml+xml,application/xml;q=0.9,"
        "image/avif,image/webp,*/*;q=0.8"
    ),
    "Accept-Language": "cs,en;q=0.8",
}
XML_HEADERS = {
    "User-Agent": HTML_HEADERS["User-Agent"],
    "Accept": "application/xml,text/xml;q=0.9,*/*;q=0.8",
}
VOID_TAGS = {
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
}
SKIP_TREE_TAGS = {"script", "style", "noscript", "svg", "path"}
SECTION_TAGS = {"section", "header", "footer", "main", "nav", "article", "aside", "form"}
INTERACTIVE_TAGS = {"a", "button", "input", "textarea", "select", "label", "form"}

EXTRA_URLS = [
    f"{BASE_URL}/404",
]


def ensure_dirs() -> None:
    RAW_HTML_DIR.mkdir(parents=True, exist_ok=True)
    DOM_DIR.mkdir(parents=True, exist_ok=True)


def normalize_url(url: str) -> str:
    parsed = urlparse(urljoin(BASE_URL, url))
    path = re.sub(r"/{2,}", "/", parsed.path or "/")
    if not path:
        path = "/"
    if path != "/":
        path = path.rstrip("/")
    query = f"?{parsed.query}" if parsed.query else ""
    return f"{parsed.scheme}://{parsed.netloc}{path}{query}"


def slugify_url(url: str) -> str:
    parsed = urlparse(normalize_url(url))
    path = parsed.path.strip("/")
    if not path:
        slug = "home"
    else:
        slug = path.replace("/", "__")
    if parsed.query:
        query_hash = hashlib.md5(parsed.query.encode("utf-8")).hexdigest()[:8]
        slug = f"{slug}__q_{query_hash}"
    return re.sub(r"[^a-zA-Z0-9_.-]+", "-", slug)[:160]


def fetch_text(url: str, headers: Dict[str, str], timeout: int = 30) -> str:
    req = urllib.request.Request(url, headers=headers)
    ctx = ssl.create_default_context()
    with urllib.request.urlopen(req, timeout=timeout, context=ctx) as resp:
        charset = resp.headers.get_content_charset() or "utf-8"
        return resp.read().decode(charset, "ignore")


def fetch_sitemap_urls() -> List[str]:
    xml = fetch_text(f"{BASE_URL}/sitemap.xml", XML_HEADERS)
    root = ET.fromstring(xml)
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [normalize_url(loc.text.strip()) for loc in root.findall("sm:url/sm:loc", ns) if loc.text]
    for url in EXTRA_URLS:
        normalized = normalize_url(url)
        if normalized not in urls:
            urls.append(normalized)
    return urls


def collapse_ws(text: str) -> str:
    return re.sub(r"\s+", " ", unescape(text or "")).strip()


@dataclass
class Node:
    tag: str
    attrs: Dict[str, str]
    parent: Optional["Node"] = None
    children: List["Node"] = field(default_factory=list)
    text_chunks: List[str] = field(default_factory=list)

    def add_child(self, child: "Node") -> None:
        self.children.append(child)

    @property
    def text(self) -> str:
        return collapse_ws(" ".join(self.text_chunks))


class DomTreeParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.root = Node("document", {})
        self.stack = [self.root]

    def handle_starttag(self, tag: str, attrs: List[tuple[str, Optional[str]]]) -> None:
        node = Node(
            tag=tag.lower(),
            attrs={k: (v or "") for k, v in attrs},
            parent=self.stack[-1],
        )
        self.stack[-1].add_child(node)
        if tag.lower() not in VOID_TAGS:
            self.stack.append(node)

    def handle_startendtag(self, tag: str, attrs: List[tuple[str, Optional[str]]]) -> None:
        node = Node(
            tag=tag.lower(),
            attrs={k: (v or "") for k, v in attrs},
            parent=self.stack[-1],
        )
        self.stack[-1].add_child(node)

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        for idx in range(len(self.stack) - 1, 0, -1):
            if self.stack[idx].tag == tag:
                del self.stack[idx:]
                break

    def handle_data(self, data: str) -> None:
        text = collapse_ws(data)
        if text:
            self.stack[-1].text_chunks.append(text)


def iter_nodes(node: Node) -> Iterable[Node]:
    yield node
    for child in node.children:
        yield from iter_nodes(child)


def find_first(node: Node, tag: str) -> Optional[Node]:
    for current in iter_nodes(node):
        if current.tag == tag:
            return current
    return None


def find_all(node: Node, predicate) -> List[Node]:
    return [current for current in iter_nodes(node) if predicate(current)]


def descriptor(node: Node) -> str:
    label = node.tag
    node_id = node.attrs.get("id")
    if node_id:
        label += f"#{node_id}"
    classes = [c for c in node.attrs.get("class", "").split() if c]
    if classes:
        label += "." + ".".join(classes[:3])
        if len(classes) > 3:
            label += ".+"
    extra = []
    if node.tag == "a":
        href = node.attrs.get("href", "")
        if href:
            extra.append(f'href="{href}"')
    elif node.tag == "img":
        alt = collapse_ws(node.attrs.get("alt", ""))[:40]
        if alt:
            extra.append(f'alt="{alt}"')
    elif node.tag in {"input", "button"}:
        input_type = node.attrs.get("type", "")
        if input_type:
            extra.append(f'type="{input_type}"')
        name = node.attrs.get("name", "")
        if name:
            extra.append(f'name="{name}"')
    elif node.tag == "form":
        if node.attrs.get("name"):
            extra.append(f'name="{node.attrs["name"]}"')
        if node.attrs.get("action"):
            extra.append(f'action="{node.attrs["action"]}"')
    if node.tag in INTERACTIVE_TAGS:
        text = node.text[:60]
        if text:
            extra.append(f'text="{text}"')
    if extra:
        label += " [" + ", ".join(extra[:3]) + "]"
    return label


def serialize_tree(node: Node, depth: int = 0, max_depth: int = 6, child_limit: int = 10) -> List[str]:
    if node.tag in SKIP_TREE_TAGS:
        return []
    line = f'{"  " * depth}- {descriptor(node)}'
    lines = [line]
    if depth >= max_depth:
        children = [c for c in node.children if c.tag not in SKIP_TREE_TAGS]
        if children:
            lines.append(f'{"  " * (depth + 1)}- ... ({len(children)} hidden child nodes)')
        return lines

    visible_children = [c for c in node.children if c.tag not in SKIP_TREE_TAGS]
    for child in visible_children[:child_limit]:
        lines.extend(serialize_tree(child, depth + 1, max_depth, child_limit))
    hidden_count = len(visible_children) - child_limit
    if hidden_count > 0:
        lines.append(f'{"  " * (depth + 1)}- ... ({hidden_count} more siblings)')
    return lines


def structure_signature(node: Optional[Node], max_depth: int = 4, child_limit: int = 8) -> str:
    if node is None:
        return ""

    def build(current: Node, depth: int) -> str:
        if current.tag in SKIP_TREE_TAGS:
            return ""
        classes = [c for c in current.attrs.get("class", "").split() if c][:2]
        label = current.tag + (":" + ",".join(classes) if classes else "")
        if depth >= max_depth:
            return label
        children = [build(child, depth + 1) for child in current.children if child.tag not in SKIP_TREE_TAGS]
        children = [c for c in children if c]
        if not children:
            return label
        trimmed = children[:child_limit]
        if len(children) > child_limit:
            trimmed.append(f"...{len(children) - child_limit}")
        return f"{label}({';'.join(trimmed)})"

    raw = build(node, 0)
    return hashlib.md5(raw.encode("utf-8")).hexdigest()[:12]


def infer_page_type(url: str) -> str:
    parsed = urlparse(url)
    path = parsed.path.rstrip("/")
    if path in {"", "/"}:
        return "homepage"
    if path == "/blog":
        return "blog-index"
    if path.startswith("/clanky/"):
        return "article-detail"
    if path.startswith("/kategorie/"):
        return "category-detail"
    if path in {"/gdpr", "/cookies", "/obchodni-podminky", "/odpovednost"}:
        return "legal"
    if path == "/search":
        return "search"
    if path == "/404":
        return "error-404"
    if "formular" in path or "objednavka" in path:
        return "conversion-form"
    if "kalendar" in path:
        return "calendar"
    if "konzultace" in path or "lekce" in path or "treninky" in path or "cviceni" in path:
        return "service-landing"
    return "content-page"


def extract_text_between(html: str, tag: str) -> str:
    match = re.search(fr"<{tag}\b[^>]*>(.*?)</{tag}>", html, re.IGNORECASE | re.DOTALL)
    return collapse_ws(match.group(1)) if match else ""


def extract_meta(html: str, name: str, attr: str = "name") -> str:
    pattern = re.compile(
        fr'<meta\b[^>]*{attr}=["\']{re.escape(name)}["\'][^>]*content=["\'](.*?)["\']',
        re.IGNORECASE | re.DOTALL,
    )
    match = pattern.search(html)
    return collapse_ws(match.group(1)) if match else ""


def html_attrs(html: str) -> Dict[str, str]:
    match = re.search(r"<html\b([^>]*)>", html, re.IGNORECASE | re.DOTALL)
    if not match:
        return {}
    attrs = {}
    for key, quote, value in re.findall(r'([\w:-]+)\s*=\s*(["\'])(.*?)\2', match.group(1), re.DOTALL):
        attrs[key] = value
    return attrs


def body_attrs(tree: Node) -> Dict[str, str]:
    body = find_first(tree, "body")
    return body.attrs if body else {}


def top_level_sections(body: Optional[Node]) -> List[str]:
    if body is None:
        return []
    sections = []
    for child in body.children:
        if child.tag in SKIP_TREE_TAGS:
            continue
        sections.append(descriptor(child))
    return sections


def summarize_form(form: Node) -> Dict[str, object]:
    fields = []
    for child in iter_nodes(form):
        if child.tag in {"input", "textarea", "select"}:
            fields.append(
                {
                    "tag": child.tag,
                    "type": child.attrs.get("type", ""),
                    "name": child.attrs.get("name", ""),
                    "placeholder": collapse_ws(child.attrs.get("placeholder", "")),
                    "required": "required" in child.attrs or child.attrs.get("aria-required") == "true",
                }
            )
    return {
        "name": form.attrs.get("name", ""),
        "action": form.attrs.get("action", ""),
        "method": form.attrs.get("method", "get").lower(),
        "classes": form.attrs.get("class", "").split(),
        "fields": fields,
    }


def summarize_page(url: str, html: str) -> Dict[str, object]:
    parser = DomTreeParser()
    parser.feed(html)
    tree = parser.root
    html_node = find_first(tree, "html")
    body_node = find_first(tree, "body")

    stylesheets = []
    script_srcs = []
    canonical = ""
    for node in iter_nodes(tree):
        if node.tag == "link":
            rel = node.attrs.get("rel", "").lower()
            href = node.attrs.get("href", "")
            if rel == "stylesheet" and href:
                stylesheets.append(href)
            elif rel == "canonical" and href:
                canonical = href
        elif node.tag == "script":
            src = node.attrs.get("src", "")
            if src:
                script_srcs.append(src)

    links = []
    internal_links = set()
    mailto_links = []
    tel_links = []
    for node in iter_nodes(tree):
        if node.tag == "a":
            href = node.attrs.get("href", "").strip()
            text = node.text[:120]
            if not href:
                continue
            links.append({"href": href, "text": text})
            if href.startswith("mailto:"):
                mailto_links.append(href)
            elif href.startswith("tel:"):
                tel_links.append(href)
            elif href.startswith("/") or href.startswith(BASE_URL):
                internal_links.add(normalize_url(href))

    forms = [summarize_form(node) for node in iter_nodes(tree) if node.tag == "form"]
    iframe_urls = [
        node.attrs.get("src", "")
        for node in iter_nodes(tree)
        if node.tag == "iframe" and node.attrs.get("src")
    ]
    embed_domains = sorted(
        {
            urlparse(src).netloc
            for src in stylesheets + script_srcs + iframe_urls
            if urlparse(src).netloc and urlparse(src).netloc != urlparse(BASE_URL).netloc
        }
    )
    image_count = sum(1 for node in iter_nodes(tree) if node.tag == "img")
    lazy_image_count = sum(
        1
        for node in iter_nodes(tree)
        if node.tag == "img" and (node.attrs.get("loading") == "lazy" or "lazy" in node.attrs.get("class", ""))
    )
    text_nodes = sum(1 for node in iter_nodes(tree) if node.text)
    class_counter = Counter()
    for node in iter_nodes(tree):
        for class_name in node.attrs.get("class", "").split():
            class_counter[class_name] += 1

    wf_attrs = html_node.attrs if html_node else html_attrs(html)
    signature = structure_signature(body_node)
    dom_lines = serialize_tree(body_node or tree)
    page_slug = slugify_url(url)
    dom_path = DOM_DIR / f"{page_slug}.txt"
    dom_path.write_text("\n".join(dom_lines) + "\n", encoding="utf-8")
    raw_path = RAW_HTML_DIR / f"{page_slug}.html"
    raw_path.write_text(html, encoding="utf-8")

    return {
        "url": url,
        "slug": page_slug,
        "page_type": infer_page_type(url),
        "title": extract_text_between(html, "title"),
        "meta_description": extract_meta(html, "description"),
        "canonical": canonical,
        "wf_site_id": wf_attrs.get("data-wf-site", ""),
        "wf_page_id": wf_attrs.get("data-wf-page", ""),
        "body_classes": body_attrs(tree).get("class", "").split(),
        "top_level_sections": top_level_sections(body_node),
        "stylesheets": stylesheets,
        "script_srcs": script_srcs,
        "embed_domains": embed_domains,
        "iframe_urls": iframe_urls,
        "forms": forms,
        "image_count": image_count,
        "lazy_image_count": lazy_image_count,
        "text_node_count": text_nodes,
        "internal_link_count": len(internal_links),
        "internal_links": sorted(internal_links),
        "mailto_links": sorted(set(mailto_links)),
        "tel_links": sorted(set(tel_links)),
        "top_classes": class_counter.most_common(25),
        "structure_signature": signature,
        "dom_tree_file": str(dom_path.relative_to(ROOT)),
        "raw_html_file": str(raw_path.relative_to(ROOT)),
    }


def build_groups(pages: List[Dict[str, object]], key: str) -> List[Dict[str, object]]:
    grouped: Dict[str, List[Dict[str, object]]] = defaultdict(list)
    for page in pages:
        grouped[str(page.get(key) or "unknown")].append(page)

    groups = []
    for group_key, members in sorted(grouped.items(), key=lambda item: (-len(item[1]), item[0])):
        page_types = Counter(member["page_type"] for member in members)
        embeds = Counter(domain for member in members for domain in member["embed_domains"])
        groups.append(
            {
                key: group_key,
                "count": len(members),
                "page_types": dict(page_types),
                "representative_urls": [member["url"] for member in members[:6]],
                "wf_page_ids": sorted({member["wf_page_id"] for member in members if member["wf_page_id"]}),
                "top_level_section_patterns": Counter(
                    " | ".join(member["top_level_sections"][:5]) for member in members
                ).most_common(3),
                "embed_domains": dict(embeds),
            }
        )
    return groups


def discover_hidden_urls(pages: List[Dict[str, object]]) -> List[str]:
    sitemap_urls = {page["url"] for page in pages}
    linked_urls = set()
    for page in pages:
        linked_urls.update(page["internal_links"])
    hidden = [
        url
        for url in sorted(linked_urls)
        if url.startswith(BASE_URL) and url not in sitemap_urls and "#" not in url and "?" not in url
    ]
    return hidden


def fetch_page(url: str) -> Dict[str, object]:
    url = normalize_url(url)
    try:
        html = fetch_text(url, HTML_HEADERS)
        summary = summarize_page(url, html)
        summary["status"] = "ok"
        return summary
    except urllib.error.HTTPError as exc:
        return {
            "url": url,
            "slug": slugify_url(url),
            "page_type": infer_page_type(url),
            "status": f"http-error:{exc.code}",
            "error": str(exc),
        }
    except Exception as exc:  # pragma: no cover - diagnostics path
        return {
            "url": url,
            "slug": slugify_url(url),
            "page_type": infer_page_type(url),
            "status": "error",
            "error": repr(exc),
        }


def main() -> int:
    ensure_dirs()
    started_at = time.time()
    initial_urls = fetch_sitemap_urls()
    pending = list(initial_urls)
    seen = set()
    pages = []
    while pending:
        url = normalize_url(pending.pop(0))
        if url in seen:
            continue
        seen.add(url)
        page = fetch_page(url)
        pages.append(page)
        if page.get("status") == "ok":
            for linked in page.get("internal_links", []):
                normalized = normalize_url(linked)
                if normalized.startswith(BASE_URL) and normalized not in seen and normalized not in pending:
                    pending.append(normalized)
    ok_pages = [page for page in pages if page.get("status") == "ok"]
    hidden_urls = discover_hidden_urls(ok_pages)

    output = {
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "site": BASE_URL,
        "crawl_count": len(pages),
        "ok_count": len(ok_pages),
        "failed": [page for page in pages if page.get("status") != "ok"],
        "hidden_internal_urls": hidden_urls,
        "page_type_counts": dict(Counter(page["page_type"] for page in ok_pages)),
        "wf_page_groups": build_groups(ok_pages, "wf_page_id"),
        "structure_groups": build_groups(ok_pages, "structure_signature"),
        "pages": ok_pages,
        "duration_seconds": round(time.time() - started_at, 2),
    }
    (ANALYSIS_DIR / "site-crawl.json").write_text(
        json.dumps(output, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(json.dumps({
        "crawl_count": output["crawl_count"],
        "ok_count": output["ok_count"],
        "failed_count": len(output["failed"]),
        "page_type_counts": output["page_type_counts"],
        "hidden_internal_urls": hidden_urls[:10],
        "duration_seconds": output["duration_seconds"],
    }, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
