#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
from datetime import date
from pathlib import Path
from typing import Any

from generate_sanity_global_seed import build_seed


ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT_DIR = ROOT / "snapshot" / "pages-json"
IMPORT_PLAN_PATH = ROOT / "snapshot" / "manifests" / "sanity-import-plan.json"
OUTPUT_PATH = ROOT / "snapshot" / "manifests" / "sanity-import-documents.ndjson"
SUMMARY_PATH = ROOT / "snapshot" / "manifests" / "sanity-import-documents.summary.json"
GENERATED_AT = f"{date.today().isoformat()}T00:00:00Z"


def deterministic_key(*parts: str) -> str:
    value = "::".join(part for part in parts if part)
    return hashlib.md5(value.encode("utf-8")).hexdigest()[:12]


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def normalize_text(value: str | None) -> str:
    return " ".join((value or "").replace("\u200d", " ").split()).strip()


def build_slug(current: str) -> dict[str, str]:
    return {"_type": "slug", "current": current}


def build_span_block(
    text: str,
    *,
    style: str = "normal",
    list_item: str | None = None,
    level: int | None = None,
    href: str | None = None,
) -> dict[str, Any] | None:
    clean_text = normalize_text(text)
    if href:
        clean_text = f"{clean_text} ({href})" if clean_text else href
    if not clean_text:
        return None

    key = deterministic_key(style, clean_text[:32])
    children = [
        {
            "_type": "span",
            "_key": f"{key}-span",
            "text": clean_text,
            "marks": [],
        }
    ]

    block: dict[str, Any] = {
        "_type": "block",
        "_key": key,
        "style": style,
        "markDefs": [],
        "children": children,
    }

    if list_item:
        block["listItem"] = list_item
        block["level"] = level or 1

    return block


def build_migration_image(block: dict[str, Any], snapshot: dict[str, Any], index: int) -> dict[str, Any]:
    src = block.get("src", "")
    local_path = ""
    for image in snapshot.get("images", []):
        if image.get("source_url") == src:
            local_path = image.get("local_path", "")
            break

    return {
        "_type": "migrationImage",
        "_key": deterministic_key(snapshot.get("slug", ""), "image", str(index), src),
        "alt": normalize_text(block.get("alt")),
        "caption": "",
        "sourceUrl": src,
        "localPath": local_path,
    }


def snapshot_blocks_to_portable_text(snapshot: dict[str, Any]) -> list[dict[str, Any]]:
    content: list[dict[str, Any]] = []

    for index, block in enumerate(snapshot.get("blocks", [])):
        block_type = block.get("type")
        if block_type == "heading":
            level = block.get("level", "2")
            style = f"h{level}" if level in {"1", "2", "3", "4"} else "normal"
            portable = build_span_block(block.get("text", ""), style=style)
        elif block_type == "paragraph":
            portable = build_span_block(block.get("text", ""))
        elif block_type == "list_item":
            portable = build_span_block(block.get("text", ""), list_item="bullet", level=1)
        elif block_type == "blockquote":
            portable = build_span_block(block.get("text", ""), style="blockquote")
        elif block_type == "caption":
            portable = build_span_block(block.get("text", ""))
        elif block_type == "cta":
            label = normalize_text(block.get("text"))
            href = block.get("href", "")
            portable = build_span_block(label or href, href=href or None)
        elif block_type == "image":
            portable = build_migration_image(block, snapshot, index)
        else:
            portable = None

        if portable:
            content.append(portable)

    return content


def group_page_builder_sections(snapshot: dict[str, Any]) -> list[dict[str, Any]]:
    sections: list[dict[str, Any]] = []
    current_title: str | None = None
    current_content: list[dict[str, Any]] = []

    for item in snapshot_blocks_to_portable_text(snapshot):
        if item.get("_type") == "block" and item.get("style") in {"h1", "h2", "h3", "h4"}:
            if current_title or current_content:
                sections.append(
                    {
                        "_type": "richTextBlock",
                        "_key": deterministic_key(snapshot.get("slug", ""), current_title or "intro", str(len(sections))),
                        "title": current_title,
                        "content": current_content,
                    }
                )
            current_title = normalize_text(item["children"][0]["text"])
            current_content = []
            continue

        current_content.append(item)

    if current_title or current_content:
        sections.append(
            {
                "_type": "richTextBlock",
                "_key": deterministic_key(snapshot.get("slug", ""), current_title or "intro", str(len(sections))),
                "title": current_title,
                "content": current_content,
            }
        )

    return [section for section in sections if section.get("content")]


def derive_title(entry: dict[str, Any], snapshot: dict[str, Any]) -> str:
    if entry["target_type"] == "page" and entry["path"] == "/":
        return "Domovská stránka"

    heading = next((normalize_text(value) for value in snapshot.get("headings", []) if normalize_text(value)), "")
    if heading:
        return heading

    title = normalize_text(snapshot.get("title"))
    if " - " in title:
        return title.split(" - ", 1)[1]

    return title or entry["target_slug"].replace("-", " ").title()


def derive_excerpt(snapshot: dict[str, Any]) -> str:
    meta_description = normalize_text(snapshot.get("meta_description"))
    if meta_description:
        return meta_description

    for block in snapshot.get("blocks", []):
        if block.get("type") == "paragraph":
            paragraph = normalize_text(block.get("text"))
            if paragraph:
                return paragraph[:260]

    return ""


def build_seo(snapshot: dict[str, Any], title: str, excerpt: str) -> dict[str, Any]:
    meta_title = normalize_text(snapshot.get("title")) or title
    meta_description = normalize_text(snapshot.get("meta_description")) or excerpt
    canonical = snapshot.get("canonical") or snapshot.get("url")

    return {
        "metaTitle": meta_title,
        "metaDescription": meta_description,
        "canonicalUrl": canonical,
        "noIndex": False,
    }


def build_migration_source(entry: dict[str, Any], snapshot: dict[str, Any]) -> dict[str, Any]:
    return {
        "_type": "migrationSource",
        "sourceFile": entry["source_file"],
        "sourceUrl": snapshot.get("url"),
        "sourceSlug": snapshot.get("slug"),
        "pageType": snapshot.get("page_type"),
        "layoutFamily": entry["layout_family"],
        "generatedAt": GENERATED_AT,
        "productKey": entry.get("product_key"),
        "formKeys": entry.get("form_keys", []),
        "notes": entry.get("notes", []),
        "pendingAssetCount": len(snapshot.get("images", [])),
    }


def build_cta_block(entry: dict[str, Any], snapshot: dict[str, Any], title: str) -> dict[str, Any] | None:
    eligible_ctas = []
    for cta in snapshot.get("ctas", []):
        href = cta.get("href", "")
        text = normalize_text(cta.get("text"))
        if not href or not text:
            continue
        if href.startswith("/kategorie/") or href.startswith("?"):
            continue
        eligible_ctas.append({"text": text, "href": href})

    if not eligible_ctas:
        return None

    primary = eligible_ctas[0]
    secondary = eligible_ctas[1] if len(eligible_ctas) > 1 else None
    return {
        "_type": "ctaBlock",
        "_key": deterministic_key(entry["target_slug"], "cta"),
        "heading": f"Další krok: {title}",
        "body": derive_excerpt(snapshot),
        "primaryLabel": primary["text"],
        "primaryHref": primary["href"],
        "secondaryLabel": secondary["text"] if secondary else None,
        "secondaryHref": secondary["href"] if secondary else None,
        "backgroundVariant": "surface",
    }


def build_form_block(entry: dict[str, Any]) -> dict[str, Any] | None:
    form_keys = entry.get("form_keys", [])
    if not form_keys:
        return None

    form_key = form_keys[0]
    return {
        "_type": "formBlock",
        "_key": deterministic_key(entry["target_slug"], "form", form_key),
        "title": "Lead formulář",
        "description": "Migrační placeholder formuláře ze snapshotu.",
        "formKey": form_key,
        "submitLabel": "Odeslat",
        "successMode": "inline",
    }


def build_page_builder(entry: dict[str, Any], snapshot: dict[str, Any], title: str) -> list[dict[str, Any]]:
    blocks = group_page_builder_sections(snapshot)
    cta_block = build_cta_block(entry, snapshot, title)
    form_block = build_form_block(entry)

    if cta_block:
        blocks.append(cta_block)
    if form_block:
        blocks.append(form_block)

    return blocks


def build_category_membership(entries: list[dict[str, Any]]) -> dict[str, list[str]]:
    article_by_title: dict[str, str] = {}
    category_membership: dict[str, list[str]] = {}

    for entry in entries:
        if entry["target_type"] != "blogPost":
            continue
        snapshot = load_json(SNAPSHOT_DIR / entry["source_file"])
        article_title = derive_title(entry, snapshot)
        article_by_title[article_title] = entry["target_slug"]

    for entry in entries:
        if entry["target_type"] != "category":
            continue
        snapshot = load_json(SNAPSHOT_DIR / entry["source_file"])
        category_slug = entry["target_slug"]
        for heading in snapshot.get("headings", [])[1:]:
            article_slug = article_by_title.get(normalize_text(heading))
            if article_slug:
                category_membership.setdefault(article_slug, []).append(category_slug)

    return category_membership


def build_document(entry: dict[str, Any], category_membership: dict[str, list[str]]) -> dict[str, Any] | None:
    if entry["target_type"] in {"blogIndexVirtual", "searchVirtual"}:
        return None

    snapshot = load_json(SNAPSHOT_DIR / entry["source_file"])
    title = derive_title(entry, snapshot)
    excerpt = derive_excerpt(snapshot)
    seo = build_seo(snapshot, title, excerpt)
    migration_source = build_migration_source(entry, snapshot)
    slug = build_slug(entry["target_slug"])
    target_type = entry["target_type"]
    document_id = f"{target_type}.{entry['target_slug']}"

    if target_type == "page":
        document = {
            "_id": document_id,
            "_type": "page",
            "title": title,
            "slug": slug,
            "excerpt": excerpt,
            "pageBuilder": build_page_builder(entry, snapshot, title),
            "seo": seo,
            "migrationSource": migration_source,
        }
        if entry["path"] == "/":
            document["pageKey"] = "home"
        elif entry["path"] == "/404":
            document["pageKey"] = "notFound"
        return document

    if target_type == "servicePage":
        return {
            "_id": document_id,
            "_type": "servicePage",
            "title": title,
            "slug": slug,
            "serviceKey": entry["target_slug"],
            "excerpt": excerpt,
            "leadFormKey": entry["form_keys"][0] if entry.get("form_keys") else None,
            "pageBuilder": build_page_builder(entry, snapshot, title),
            "seo": seo,
            "migrationSource": migration_source,
        }

    if target_type == "offerPage":
        return {
            "_id": document_id,
            "_type": "offerPage",
            "title": title,
            "slug": slug,
            "productKey": entry.get("product_key"),
            "excerpt": excerpt,
            "checkoutMode": "leadOnly" if entry.get("form_keys") and not entry.get("product_key") else "stripeRedirect",
            "stripePriceId": "",
            "pageBuilder": build_page_builder(entry, snapshot, title),
            "seo": seo,
            "migrationSource": migration_source,
        }

    if target_type == "legalPage":
        return {
            "_id": document_id,
            "_type": "legalPage",
            "title": title,
            "slug": slug,
            "summary": excerpt,
            "content": snapshot_blocks_to_portable_text(snapshot),
            "seo": seo,
            "migrationSource": migration_source,
        }

    if target_type == "category":
        return {
            "_id": document_id,
            "_type": "category",
            "title": title,
            "slug": slug,
            "excerpt": excerpt,
            "seo": seo,
            "migrationSource": migration_source,
        }

    if target_type == "blogPost":
        categories = [
            {
                "_type": "reference",
                "_key": deterministic_key(document_id, category_slug),
                "_ref": f"category.{category_slug}",
            }
            for category_slug in sorted(set(category_membership.get(entry["target_slug"], [])))
        ]
        return {
            "_id": document_id,
            "_type": "blogPost",
            "title": title,
            "slug": slug,
            "excerpt": excerpt,
            "publishedAt": None,
            "categories": categories,
            "content": snapshot_blocks_to_portable_text(snapshot),
            "seo": seo,
            "migrationSource": migration_source,
        }

    return None


def enrich_global_seed() -> list[dict[str, Any]]:
    seed = build_seed()
    documents = seed["documents"]
    notes = seed.get("notes", [])
    for document in documents:
        document["migrationSource"] = {
            "_type": "migrationSource",
            "sourceFile": "global-seed",
            "sourceUrl": "https://www.zdravimebavi.cz/",
            "sourceSlug": "global-seed",
            "pageType": "global",
            "layoutFamily": "Global",
            "generatedAt": GENERATED_AT,
            "productKey": None,
            "formKeys": [],
            "notes": notes,
            "pendingAssetCount": 0,
        }
    return documents


def main() -> None:
    import_plan = load_json(IMPORT_PLAN_PATH)
    entries = import_plan["entries"]
    category_membership = build_category_membership(entries)

    documents = enrich_global_seed()
    for entry in entries:
        document = build_document(entry, category_membership)
        if document:
            documents.append(document)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(
        "\n".join(json.dumps(document, ensure_ascii=False) for document in documents) + "\n",
        encoding="utf-8",
    )

    summary = {
        "generated_at": GENERATED_AT,
        "output": str(OUTPUT_PATH.relative_to(ROOT)),
        "document_count": len(documents),
        "counts_by_type": {},
    }

    for document in documents:
        summary["counts_by_type"][document["_type"]] = summary["counts_by_type"].get(document["_type"], 0) + 1

    SUMMARY_PATH.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Generated {len(documents)} Sanity documents.")
    print(f"- NDJSON: {OUTPUT_PATH}")
    print(f"- Summary: {SUMMARY_PATH}")


if __name__ == "__main__":
    main()
