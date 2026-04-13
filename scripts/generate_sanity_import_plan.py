#!/usr/bin/env python3
from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT_DIR = ROOT / "snapshot" / "pages-json"
OUTPUT_JSON = ROOT / "snapshot" / "manifests" / "sanity-import-plan.json"
OUTPUT_MD = ROOT / "docs" / "migration" / "import-strategy.md"


@dataclass
class ImportEntry:
    source_file: str
    url: str
    path: str
    source_slug: str
    title: str
    page_type: str
    target_type: str
    target_slug: str
    layout_family: str
    form_keys: list[str]
    product_key: str | None
    notes: list[str]


LEGAL_URLS = {
    "/cookies",
    "/gdpr",
    "/obchodni-podminky",
    "/odpovednost",
}

PAGE_URLS = {
    "/",
    "/o-mne",
    "/napis-mi",
    "/styleguide",
}

SERVICE_URLS = {
    "/cviceni-v-benatkach-nad-jizerou",
    "/individualni-treninky-benatky-nad-jizerou-a-okoli",
    "/konzultace-zdarma",
    "/lekce-cviceni",
    "/osobni-konzultace",
    "/skupinove-lekce-benatky-nad-jizerou",
}

OFFER_URLS = {
    "/cviceni-v-benatkach-nad-jizerou-formular",
    "/e-book-jak-sestavit-jidelnicek",
    "/formular---pruvodce-vyzivou-a-pohybem",
    "/kalendar",
    "/letni-prazdninova-vyzva",
    "/osobni-konzultace-objednavka",
    "/pruvodce",
    "/zhubni-bez-pocitani-kalorii",
}

PRODUCT_KEY_BY_URL = {
    "/e-book-jak-sestavit-jidelnicek": "ebook_jak_sestavit_jidelnicek",
    "/osobni-konzultace-objednavka": "osobni_konzultace",
    "/formular---pruvodce-vyzivou-a-pohybem": "pruvodce_vyzivou_a_pohybem",
}

FORM_KEY_BY_FORM_NAME = {
    "wf-form-Skupinove_lekce-2": "skupinove_lekce",
    "wf-form-Get-In-Touch-Form": "kontakt",
    "wf-form-Individualni_treninky": "individualni_treninky",
    "wf-form-Osobni_konzultace": "osobni_konzultace",
    "wf-form-Konzultace_zdarma": "konzultace_zdarma",
}


def infer_target_type(url: str, page_type: str) -> str:
    if url == "/blog":
      return "blogIndexVirtual"
    if url == "/search":
      return "searchVirtual"
    if url.startswith("/clanky/"):
      return "blogPost"
    if url.startswith("/kategorie/"):
      return "category"
    if url in LEGAL_URLS or page_type == "legal":
      return "legalPage"
    if url in SERVICE_URLS or page_type == "service-landing":
      return "servicePage"
    if url in OFFER_URLS or page_type in {"conversion-form", "calendar"}:
      return "offerPage"
    if url in PAGE_URLS or page_type in {"homepage", "content-page", "error-404"}:
      return "page"
    return "page"


def normalize_path(url: str) -> str:
    parsed = urlparse(url)
    path = parsed.path or "/"
    return path.rstrip("/") or "/"


def infer_layout_family(target_type: str, url: str) -> str:
    if target_type in {"legalPage", "page"} and url != "/styleguide":
      return "MarketingLayout"
    if target_type == "offerPage":
      if url in {"/osobni-konzultace-objednavka", "/formular---pruvodce-vyzivou-a-pohybem", "/cviceni-v-benatkach-nad-jizerou-formular"}:
        return "CheckoutLayout"
      return "StandaloneLayout"
    if target_type == "servicePage":
      if url == "/osobni-konzultace":
        return "StandaloneLayout"
      return "MarketingLayout"
    if target_type in {"blogPost", "category", "blogIndexVirtual", "searchVirtual"}:
      return "ContentLayout"
    if url == "/styleguide":
      return "StandaloneLayout"
    return "MarketingLayout"


def infer_target_slug(url: str, source_slug: str) -> str:
    if url == "/":
      return "home"
    if url.startswith("/clanky/"):
      return url.removeprefix("/clanky/")
    if url.startswith("/kategorie/"):
      return url.removeprefix("/kategorie/")
    return url.strip("/") or source_slug


def infer_form_keys(forms: list[dict[str, Any]]) -> list[str]:
    keys: list[str] = []
    for form in forms:
        name = form.get("name", "")
        if name in FORM_KEY_BY_FORM_NAME:
            keys.append(FORM_KEY_BY_FORM_NAME[name])
    return sorted(set(keys))


def infer_notes(data: dict[str, Any], target_type: str, url: str, form_keys: list[str]) -> list[str]:
    notes: list[str] = []
    if target_type == "blogIndexVirtual":
        notes.append("Blog index nebude importovany jako samostatny dokument; bude slozen z blogPost a category.")
    if target_type == "searchVirtual":
        notes.append("Search route nebude importovana jako obsahovy dokument; zustava aplikacni route.")
    if url == "/":
        notes.append("Homepage doporuceno ridit pres page s pageKey='home' a globální siteSettings.")
    if url == "/styleguide":
        notes.append("Styleguide muze zustat neveřejny nebo pomocny page dokument pro UI kontrolu.")
    if target_type == "offerPage" and url not in PRODUCT_KEY_BY_URL:
        notes.append("Product key neni definitivne potvrzeny; pred importem overit obchodni a checkout logiku.")
    if form_keys:
        notes.append(f"Na strance je detekovan formular: {', '.join(form_keys)}.")
    if data.get("images"):
        notes.append("Obrazky importovat do Sanity asset pipeline a zachovat alt texty, kde jsou dostupne.")
    if data.get("ctas"):
        notes.append("CTA odkazy zkontrolovat a nahradit legacy app/member odkazy za https://app.zdravimebavi.cz/, kde dava smysl.")
    if target_type == "legalPage":
        notes.append("Legal texty importovat jako rich text a pred publikaci zkontrolovat finalni pravni zneni.")
    return notes


def classify_page(path: Path) -> ImportEntry:
    data = json.loads(path.read_text())
    url = data["url"]
    path_only = normalize_path(url)
    target_type = infer_target_type(path_only, data.get("page_type", "unknown"))
    form_keys = infer_form_keys(data.get("forms", []))
    return ImportEntry(
        source_file=path.name,
        url=url,
        path=path_only,
        source_slug=data.get("slug", ""),
        title=data.get("title", ""),
        page_type=data.get("page_type", "unknown"),
        target_type=target_type,
        target_slug=infer_target_slug(path_only, data.get("slug", "")),
        layout_family=infer_layout_family(target_type, path_only),
        form_keys=form_keys,
        product_key=PRODUCT_KEY_BY_URL.get(path_only),
        notes=infer_notes(data, target_type, path_only, form_keys),
    )


def load_entries() -> list[ImportEntry]:
    entries = [classify_page(path) for path in sorted(SNAPSHOT_DIR.glob("*.json"))]
    return sorted(entries, key=lambda entry: entry.url)


def write_json(entries: list[ImportEntry]) -> None:
    payload = {
        "generated_at": "2026-04-11",
        "source_dir": str(SNAPSHOT_DIR.relative_to(ROOT)),
        "entries": [asdict(entry) for entry in entries],
    }
    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")


def write_markdown(entries: list[ImportEntry]) -> None:
    lines: list[str] = []
    lines.append("# Import strategie ze snapshotu do Sanity\n")
    lines.append("Datum: 2026-04-11\n")
    lines.append("Tento dokument je generovany ze `snapshot/pages-json/` a slouzi jako pracovní mapa importu veřejného obsahu do nových Sanity modelů.\n")
    lines.append("## 1. Souhrn\n")

    counts: dict[str, int] = {}
    for entry in entries:
        counts[entry.target_type] = counts.get(entry.target_type, 0) + 1

    for target_type, count in sorted(counts.items()):
        lines.append(f"- `{target_type}`: {count}")

    lines.append("\n## 2. Mapovací pravidla\n")
    lines.append("- `/clanky/[slug]` -> `blogPost`")
    lines.append("- `/kategorie/[slug]` -> `category`")
    lines.append("- legal URL -> `legalPage`")
    lines.append("- service landings -> `servicePage`")
    lines.append("- offer / conversion / calendar URL -> `offerPage`")
    lines.append("- homepage a obsahové stránky -> `page`")
    lines.append("- `/blog` a `/search` zůstávají aplikacní route, ne importované dokumenty")

    lines.append("\n## 3. Import tabulka\n")
    lines.append("| URL | Zdroj | Cílový typ | Cílový slug | Layout | Form key | Product key |")
    lines.append("| --- | --- | --- | --- | --- | --- | --- |")
    for entry in entries:
        form_value = ", ".join(entry.form_keys) if entry.form_keys else "—"
        product_value = entry.product_key or "—"
        lines.append(
            f"| `{entry.path}` | `{entry.source_file}` | `{entry.target_type}` | `{entry.target_slug}` | `{entry.layout_family}` | `{form_value}` | `{product_value}` |"
        )

    lines.append("\n## 4. Poznámky a otevřené body\n")
    lines.append("- `blogIndexVirtual` a `searchVirtual` se do Sanity neimportují jako samostatné dokumenty.")
    lines.append("- Homepage doporučeno řídit přes `page` s `pageKey='home'` a globální `siteSettings`.")
    lines.append("- U checkout stránek je potřeba před ostrým importem doplnit finální `product_key` a `price_id`.")
    lines.append("- Všechny detekované obrázky importovat do Sanity asset pipeline, nechat delivery na Sanity CDN + Netlify Image CDN.")
    lines.append("- CTA vedoucí do původní členské sekce přepsat na `https://app.zdravimebavi.cz/`.")

    OUTPUT_MD.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_MD.write_text("\n".join(lines) + "\n")


def main() -> None:
    entries = load_entries()
    write_json(entries)
    write_markdown(entries)
    print(f"Generated {len(entries)} import entries.")
    print(f"- JSON: {OUTPUT_JSON}")
    print(f"- Markdown: {OUTPUT_MD}")


if __name__ == "__main__":
    main()
