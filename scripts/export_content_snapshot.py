#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import mimetypes
import os
import re
import ssl
import subprocess
import urllib.request
from collections import defaultdict
from pathlib import Path
from typing import Dict, Iterable, List, Optional
from urllib.parse import urljoin, urlparse

from map_webflow_site import (
    ANALYSIS_DIR,
    BASE_URL,
    DomTreeParser,
    Node,
    RAW_HTML_DIR,
    collapse_ws,
    extract_meta,
    extract_text_between,
    find_first,
    iter_nodes,
    normalize_url,
    slugify_url,
)


ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT_DIR = ROOT / "snapshot"
PAGES_MD_DIR = SNAPSHOT_DIR / "pages-md"
PAGES_JSON_DIR = SNAPSHOT_DIR / "pages-json"
ASSETS_DIR = SNAPSHOT_DIR / "assets"
IMAGES_DIR = ASSETS_DIR / "images"
MANIFESTS_DIR = SNAPSHOT_DIR / "manifests"
CSS_DIR = SNAPSHOT_DIR / "css"

IMAGE_EXTENSIONS = (".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".avif", ".ico")
SKIP_SUBTREE_TAGS = {"script", "style", "noscript", "svg", "iframe"}
SKIP_SUBTREE_CLASSES = {
    "navbar",
    "w-nav",
    "nav-menu",
    "menu-button-2",
    "footer-subscribe",
    "footer-wrapper-three",
    "footer-bottom",
    "footer-legal-block",
    "footer-social-block-three",
    "dd_shadow",
    "w-embed",
    "w-script",
    "status-message",
    "w-form-done",
    "w-form-fail",
}
SEMANTIC_TAGS = {"h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "blockquote", "figcaption", "img", "a"}
BUTTON_CLASS_HINTS = {"button", "w-button", "cc-jumbo-button", "button-copy", "button-2", "button-sluzby"}

HTML_HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; CodexContentSnapshot/1.0; +https://openai.com)",
    "Accept": "*/*",
}


def ensure_dirs() -> None:
    for path in [SNAPSHOT_DIR, PAGES_MD_DIR, PAGES_JSON_DIR, ASSETS_DIR, IMAGES_DIR, MANIFESTS_DIR, CSS_DIR]:
        path.mkdir(parents=True, exist_ok=True)


def run_refresh() -> None:
    subprocess.run(["python3", str(ROOT / "scripts" / "map_webflow_site.py")], cwd=ROOT, check=True)


def load_crawl() -> Dict[str, object]:
    crawl_path = ANALYSIS_DIR / "site-crawl.json"
    if not crawl_path.exists():
        run_refresh()
    return json.loads(crawl_path.read_text(encoding="utf-8"))


def fetch_binary(url: str) -> bytes:
    req = urllib.request.Request(url, headers=HTML_HEADERS)
    ctx = ssl.create_default_context()
    with urllib.request.urlopen(req, timeout=60, context=ctx) as resp:
        return resp.read()


def extract_meta_flexible(html: str, key: str, attr: str = "name") -> str:
    patterns = [
        re.compile(
            fr'<meta\b[^>]*{attr}=["\']{re.escape(key)}["\'][^>]*content=["\'](.*?)["\']',
            re.IGNORECASE | re.DOTALL,
        ),
        re.compile(
            fr'<meta\b[^>]*content=["\'](.*?)["\'][^>]*{attr}=["\']{re.escape(key)}["\']',
            re.IGNORECASE | re.DOTALL,
        ),
    ]
    for pattern in patterns:
        match = pattern.search(html)
        if match:
            return collapse_ws(match.group(1))
    return ""


def safe_filename_from_url(url: str) -> str:
    parsed = urlparse(url)
    name = Path(parsed.path).name or "asset"
    name = re.sub(r"[^a-zA-Z0-9._-]+", "-", name)
    if "." not in name:
        guessed = mimetypes.guess_extension(mimetypes.guess_type(url)[0] or "") or ".bin"
        name += guessed
    return name


def deep_text(node: Node) -> str:
    parts: List[str] = []
    if node.text_chunks:
        parts.extend(node.text_chunks)
    for child in node.children:
        if child.tag in SKIP_SUBTREE_TAGS:
            continue
        child_text = deep_text(child)
        if child_text:
            parts.append(child_text)
    return collapse_ws(" ".join(parts))


def node_classes(node: Node) -> set[str]:
    return {cls for cls in node.attrs.get("class", "").split() if cls}


def has_skip_ancestor(node: Node) -> bool:
    current = node
    while current is not None:
        if current.tag in {"nav", "footer"}:
            return True
        classes = node_classes(current)
        if classes & SKIP_SUBTREE_CLASSES:
            return True
        current = current.parent
    return False


def should_skip_subtree(node: Node) -> bool:
    if node.tag in SKIP_SUBTREE_TAGS:
        return True
    classes = node_classes(node)
    return bool(classes & SKIP_SUBTREE_CLASSES)


def is_button_like_anchor(node: Node) -> bool:
    if node.tag != "a":
        return False
    classes = node_classes(node)
    href = node.attrs.get("href", "").strip()
    return bool(classes & BUTTON_CLASS_HINTS) or href == "https://app.zdravimebavi.cz/"


def highest_src_from_srcset(srcset: str) -> Optional[str]:
    best_url = None
    best_width = -1
    for item in srcset.split(","):
        chunk = item.strip()
        if not chunk:
            continue
        parts = chunk.split()
        url = parts[0]
        width = -1
        if len(parts) > 1 and parts[1].endswith("w"):
            try:
                width = int(parts[1][:-1])
            except ValueError:
                width = -1
        if width > best_width:
            best_width = width
            best_url = url
    return best_url


def is_image_url(url: str) -> bool:
    lowered = url.lower()
    return any(ext in lowered for ext in IMAGE_EXTENSIONS)


def extract_url_candidates_from_style(style_value: str) -> List[str]:
    urls = []
    for raw in re.findall(r"url\((.*?)\)", style_value, re.IGNORECASE):
        cleaned = raw.strip().strip("'\"")
        if cleaned:
            urls.append(cleaned)
    return urls


def extract_images_from_html(url: str, html: str, tree: Node) -> List[Dict[str, str]]:
    results: List[Dict[str, str]] = []
    seen = set()

    def add_image(source_url: str, alt: str = "", context: str = "") -> None:
        normalized = normalize_url(source_url) if source_url.startswith("/") else source_url
        if not normalized or not is_image_url(normalized):
            return
        key = (normalized, alt, context)
        if key in seen:
            return
        seen.add(key)
        results.append({"source_url": normalized, "alt": collapse_ws(alt), "context": context})

    og_image = extract_meta(html, "og:image", "property")
    twitter_image = extract_meta(html, "twitter:image", "property")
    for meta_url in [og_image, twitter_image]:
        if meta_url:
            add_image(meta_url, context="meta")

    for node in iter_nodes(tree):
        if node.tag == "img":
            src = node.attrs.get("src", "").strip()
            srcset = node.attrs.get("srcset", "").strip()
            chosen = highest_src_from_srcset(srcset) or src
            if chosen:
                add_image(urljoin(url, chosen), alt=node.attrs.get("alt", ""), context="img")
        style_value = node.attrs.get("style", "")
        if style_value:
            for style_url in extract_url_candidates_from_style(style_value):
                add_image(urljoin(url, style_url), context="inline-style")

    return results


def collect_css_urls(crawl_data: Dict[str, object]) -> List[str]:
    urls = set()
    for page in crawl_data["pages"]:
        for stylesheet in page.get("stylesheets", []):
            if stylesheet:
                urls.add(stylesheet)
    return sorted(urls)


def ensure_css_local(css_url: str) -> Path:
    parsed = urlparse(css_url)
    name = safe_filename_from_url(parsed.path)
    target = CSS_DIR / name
    if not target.exists():
        target.write_bytes(fetch_binary(css_url))
    return target


def extract_images_from_css_files(crawl_data: Dict[str, object]) -> List[str]:
    image_urls = set()
    for css_url in collect_css_urls(crawl_data):
        local_css = ensure_css_local(css_url)
        css_text = local_css.read_text(encoding="utf-8", errors="ignore")
        for match in re.findall(r"url\((.*?)\)", css_text, re.IGNORECASE):
            raw = match.strip().strip("'\"")
            if not raw or raw.startswith("data:"):
                continue
            absolute = urljoin(css_url, raw)
            if is_image_url(absolute):
                image_urls.add(absolute)
    return sorted(image_urls)


def download_asset(source_url: str) -> Dict[str, str]:
    digest = hashlib.md5(source_url.encode("utf-8")).hexdigest()[:12]
    filename = safe_filename_from_url(source_url)
    target = IMAGES_DIR / f"{digest}__{filename}"
    if not target.exists():
        try:
            target.write_bytes(fetch_binary(source_url))
        except Exception:
            return {"source_url": source_url, "status": "failed", "local_path": ""}
    return {
        "source_url": source_url,
        "status": "ok",
        "local_path": str(target.relative_to(ROOT)),
    }


def extract_content_blocks(body: Optional[Node]) -> List[Dict[str, str]]:
    blocks: List[Dict[str, str]] = []
    seen_signatures = set()

    def push(block: Dict[str, str]) -> None:
        signature = (block["type"], block.get("text", ""), block.get("href", ""), block.get("src", ""))
        if block.get("text") or block.get("src"):
            if signature in seen_signatures:
                return
            seen_signatures.add(signature)
            blocks.append(block)

    def walk(node: Node) -> None:
        if should_skip_subtree(node) or has_skip_ancestor(node):
            return

        if node.tag in {"h1", "h2", "h3", "h4", "h5", "h6"}:
            text = deep_text(node)
            if text:
                push({"type": "heading", "level": node.tag[1:], "text": text})
            return

        if node.tag == "p":
            text = deep_text(node)
            if text:
                push({"type": "paragraph", "text": text})
            return

        if node.tag == "li":
            text = deep_text(node)
            if text:
                push({"type": "list_item", "text": text})
            return

        if node.tag == "blockquote":
            text = deep_text(node)
            if text:
                push({"type": "blockquote", "text": text})
            return

        if node.tag == "figcaption":
            text = deep_text(node)
            if text:
                push({"type": "caption", "text": text})
            return

        if node.tag == "img":
            src = node.attrs.get("src", "").strip()
            srcset = node.attrs.get("srcset", "").strip()
            chosen = highest_src_from_srcset(srcset) or src
            if chosen:
                push({
                    "type": "image",
                    "src": chosen,
                    "alt": collapse_ws(node.attrs.get("alt", "")),
                })
            return

        if node.tag == "a" and is_button_like_anchor(node):
            text = deep_text(node)
            href = node.attrs.get("href", "").strip()
            if text and href and href != "#":
                push({"type": "cta", "text": text, "href": href})
            return

        for child in node.children:
            walk(child)

    if body is not None:
        for child in body.children:
            walk(child)
    return blocks


def summarize_forms(tree: Node) -> List[Dict[str, object]]:
    forms = []
    for node in iter_nodes(tree):
        if node.tag != "form" or has_skip_ancestor(node):
            continue
        fields = []
        for child in iter_nodes(node):
            if child.tag in {"input", "textarea", "select"}:
                fields.append(
                    {
                        "tag": child.tag,
                        "type": child.attrs.get("type", ""),
                        "name": child.attrs.get("name", ""),
                        "required": "required" in child.attrs or child.attrs.get("aria-required") == "true",
                    }
                )
        forms.append(
            {
                "name": node.attrs.get("name", ""),
                "id": node.attrs.get("id", ""),
                "method": node.attrs.get("method", "get").lower(),
                "action": node.attrs.get("action", ""),
                "fields": fields,
            }
        )
    return forms


def relative_asset_markdown_path(asset_local_path: str) -> str:
    return Path(os.path.relpath(ROOT / asset_local_path, PAGES_MD_DIR)).as_posix()


def blocks_to_markdown(blocks: List[Dict[str, str]], image_map: Dict[str, str]) -> str:
    lines: List[str] = []
    for block in blocks:
        block_type = block["type"]
        if block_type == "heading":
            lines.append(f'{"#" * int(block["level"])} {block["text"]}')
        elif block_type == "paragraph":
            lines.append(block["text"])
        elif block_type == "list_item":
            lines.append(f'- {block["text"]}')
        elif block_type == "blockquote":
            lines.append(f'> {block["text"]}')
        elif block_type == "caption":
            lines.append(f'*{block["text"]}*')
        elif block_type == "cta":
            lines.append(f'[CTA: {block["text"]}]({block["href"]})')
        elif block_type == "image":
            src = block.get("src", "")
            resolved = normalize_url(src) if src.startswith("/") else src
            local = image_map.get(resolved, "")
            alt = block.get("alt", "") or "Image"
            if local:
                lines.append(f'![{alt}]({relative_asset_markdown_path(local)})')
            else:
                lines.append(f'![{alt}]({resolved})')
        lines.append("")
    return "\n".join(line for line in lines).strip() + "\n"


def generate_page_export(page: Dict[str, object], asset_map: Dict[str, str]) -> Dict[str, object]:
    html_path = ROOT / page["raw_html_file"]
    html = html_path.read_text(encoding="utf-8", errors="ignore")
    parser = DomTreeParser()
    parser.feed(html)
    tree = parser.root
    body = find_first(tree, "body")
    meta_description = page["meta_description"] or extract_meta_flexible(html, "description")
    canonical = page["canonical"] or extract_meta_flexible(html, "canonical", "property") or page["url"]

    images = extract_images_from_html(page["url"], html, tree)
    blocks = extract_content_blocks(body)
    forms = summarize_forms(tree)
    headings = [block["text"] for block in blocks if block["type"] == "heading"]
    ctas = [block for block in blocks if block["type"] == "cta"]
    page_image_refs = []
    for image in images:
        local_path = asset_map.get(image["source_url"], "")
        page_image_refs.append({**image, "local_path": local_path})

    payload = {
        "url": page["url"],
        "slug": page["slug"],
        "page_type": page["page_type"],
        "title": page["title"],
        "meta_description": meta_description,
        "canonical": canonical,
        "headings": headings,
        "ctas": ctas,
        "forms": forms,
        "images": page_image_refs,
        "blocks": blocks,
    }

    safe_title = str(page["title"]).replace('"', '\\"')
    md_lines = [
        "---",
        f'title: "{safe_title}"',
        f'url: "{page["url"]}"',
        f'page_type: "{page["page_type"]}"',
        "---",
        "",
        f'*Meta description:* {meta_description}',
        "",
        f'*Canonical:* {canonical}',
        "",
    ]
    if ctas:
        md_lines.append("## CTA")
        md_lines.append("")
        for cta in ctas:
            md_lines.append(f'- [{cta["text"]}]({cta["href"]})')
        md_lines.append("")
    if forms:
        md_lines.append("## Forms")
        md_lines.append("")
        for form in forms:
            label = form["name"] or form["id"] or "unnamed-form"
            fields = ", ".join(field["name"] or field["type"] or field["tag"] for field in form["fields"])
            md_lines.append(f'- `{label}` ({form["method"]}) -> {fields}')
        md_lines.append("")

    md_lines.append("## Content")
    md_lines.append("")
    md_lines.append(blocks_to_markdown(blocks, asset_map))
    markdown = "\n".join(md_lines).replace("\n\n\n", "\n\n")

    json_path = PAGES_JSON_DIR / f'{page["slug"]}.json'
    md_path = PAGES_MD_DIR / f'{page["slug"]}.md'
    json_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    md_path.write_text(markdown, encoding="utf-8")
    return {
        "url": page["url"],
        "slug": page["slug"],
        "page_type": page["page_type"],
        "json_path": str(json_path.relative_to(ROOT)),
        "markdown_path": str(md_path.relative_to(ROOT)),
        "image_count": len(page_image_refs),
        "block_count": len(blocks),
    }


def write_snapshot_readme(summary: Dict[str, object]) -> None:
    lines = [
        "# Local content snapshot",
        "",
        "Tento adresář obsahuje lokální snapshot textů a obrázků z aktuálního veřejného webu.",
        "",
        "## Obsah",
        "",
        "- `pages-md/` -> čitelné Markdown exporty jednotlivých URL",
        "- `pages-json/` -> strojově čitelné exporty se structured bloky",
        "- `assets/images/` -> lokálně stažené obrázky",
        "- `css/` -> lokální kopie CSS souborů použité pro detekci background assetů",
        "- `manifests/` -> manifesty assetů, stránek a coverage",
        "",
        "## Poznámky",
        "",
        "- snapshot pokrývá veřejné HTML, texty a obrázky dostupné z live webu",
        "- chráněná členská sekce není součástí exportu",
        "- Wistia, YouTube, FAPI a Stripe jsou zachycené jako reference, ne jako stažený interní obsah providerů",
        "",
        "## Statistika",
        "",
        f'- exported pages: {summary["page_count"]}',
        f'- downloaded images: {summary["downloaded_images"]}',
        f'- failed images: {summary["failed_images"]}',
        f'- css-discovered image urls: {summary["css_image_count"]}',
        "",
    ]
    (SNAPSHOT_DIR / "README.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Create local content + image snapshot from the current public web.")
    parser.add_argument("--refresh", action="store_true", help="Refresh the crawl before exporting.")
    args = parser.parse_args()

    ensure_dirs()
    if args.refresh:
        run_refresh()
    crawl_data = load_crawl()

    css_image_urls = extract_images_from_css_files(crawl_data)
    html_image_urls = []
    page_image_index: Dict[str, List[Dict[str, str]]] = defaultdict(list)
    for page in crawl_data["pages"]:
        html_path = ROOT / page["raw_html_file"]
        if not html_path.exists():
            continue
        html = html_path.read_text(encoding="utf-8", errors="ignore")
        dom_parser = DomTreeParser()
        dom_parser.feed(html)
        images = extract_images_from_html(page["url"], html, dom_parser.root)
        page_image_index[page["url"]] = images
        html_image_urls.extend(img["source_url"] for img in images)

    asset_sources = sorted(set(css_image_urls) | set(html_image_urls))
    asset_manifest = []
    asset_map: Dict[str, str] = {}
    for source_url in asset_sources:
        result = download_asset(source_url)
        asset_manifest.append(result)
        if result["status"] == "ok":
            asset_map[source_url] = result["local_path"]

    page_exports = []
    for page in crawl_data["pages"]:
        if page.get("status") != "ok":
            continue
        page_exports.append(generate_page_export(page, asset_map))

    manifests = {
        "pages": page_exports,
        "assets": asset_manifest,
        "css_image_urls": css_image_urls,
    }
    (MANIFESTS_DIR / "snapshot-manifest.json").write_text(
        json.dumps(manifests, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    failed_images = sum(1 for item in asset_manifest if item["status"] != "ok")
    summary = {
        "page_count": len(page_exports),
        "downloaded_images": len(asset_map),
        "failed_images": failed_images,
        "css_image_count": len(css_image_urls),
        "manifest": str((MANIFESTS_DIR / "snapshot-manifest.json").relative_to(ROOT)),
    }
    write_snapshot_readme(summary)
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
