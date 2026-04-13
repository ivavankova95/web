#!/usr/bin/env python3

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
SNAPSHOT_DIR = ROOT / "snapshot" / "pages-json"
OUTPUT_PATH = ROOT / "snapshot" / "manifests" / "sanity-global-seed.json"


PRIMARY_NAV = [
    {"label": "O mně", "href": "/o-mne", "openInNewTab": False, "variant": "default"},
    {"label": "Osobní konzultace", "href": "/osobni-konzultace", "openInNewTab": False, "variant": "default"},
    {"label": "Průvodce", "href": "/pruvodce", "openInNewTab": False, "variant": "default"},
    {"label": "E-book", "href": "/e-book-jak-sestavit-jidelnicek", "openInNewTab": False, "variant": "default"},
    {"label": "Lekce cvičení", "href": "/lekce-cviceni", "openInNewTab": False, "variant": "default"},
    {"label": "Blog", "href": "/blog", "openInNewTab": False, "variant": "default"},
]

FOOTER_PRIMARY = [
    {"label": "Konzultace zdarma", "href": "/konzultace-zdarma", "openInNewTab": False, "variant": "default"},
    {"label": "Kontakt", "href": "/napis-mi", "openInNewTab": False, "variant": "default"},
    {"label": "Kalendář", "href": "/kalendar", "openInNewTab": False, "variant": "default"},
]

LEGAL_LINKS = [
    {"label": "Cookies", "href": "/cookies", "openInNewTab": False, "variant": "legal"},
    {"label": "GDPR", "href": "/gdpr", "openInNewTab": False, "variant": "legal"},
    {"label": "Obchodní podmínky", "href": "/obchodni-podminky", "openInNewTab": False, "variant": "legal"},
    {"label": "Odpovědnost", "href": "/odpovednost", "openInNewTab": False, "variant": "legal"},
]

SOCIAL_LINKS = [
    {"label": "Instagram", "href": "", "openInNewTab": True, "variant": "social"},
    {"label": "Facebook", "href": "", "openInNewTab": True, "variant": "social"},
]


def load_snapshot(file_name: str) -> dict:
    return json.loads((SNAPSHOT_DIR / file_name).read_text(encoding="utf-8"))


def doc_exists(href: str) -> bool:
    if href == "/":
        file_name = "home.json"
    else:
        file_name = f"{href.lstrip('/')}.json"
    return (SNAPSHOT_DIR / file_name).exists()


def build_seed() -> dict:
    home = load_snapshot("home.json")

    navigation_items = [item for item in PRIMARY_NAV if doc_exists(item["href"])]
    footer_primary = [item for item in FOOTER_PRIMARY if doc_exists(item["href"])]
    legal_items = [item for item in LEGAL_LINKS if doc_exists(item["href"])]

    docs = [
        {
            "_id": "siteSettings",
            "_type": "siteSettings",
            "title": "Zdraví mě baví",
            "siteDescription": home.get("meta_description", ""),
            "siteUrl": "https://www.zdravimebavi.cz",
            "appUrl": "https://app.zdravimebavi.cz/",
            "contactEmail": "",
            "contactPhone": "",
            "gtmId": "",
            "ga4MeasurementId": "",
            "metaPixelId": "",
            "hotjarId": "",
            "cookieScriptId": "",
            "socialLinks": SOCIAL_LINKS,
            "seo": {
                "metaTitle": home.get("title", "Zdraví mě baví"),
                "metaDescription": home.get("meta_description", ""),
                "canonicalUrl": home.get("canonical", "https://www.zdravimebavi.cz/"),
                "noIndex": False,
            },
        },
        {
            "_id": "navigation-main",
            "_type": "navigation",
            "title": "Main navigation",
            "items": navigation_items,
            "ctaLabel": "Otevřít app",
            "ctaHref": "https://app.zdravimebavi.cz/",
        },
        {
            "_id": "footer-main",
            "_type": "footer",
            "title": "Footer",
            "aboutText": home.get("meta_description", ""),
            "primaryLinks": footer_primary,
            "legalLinks": legal_items,
            "socialLinks": SOCIAL_LINKS,
        },
    ]

    return {
        "generated_at": "2026-04-11",
        "source": "snapshot/pages-json",
        "notes": [
            "Seed je pripraveny jako import-ready zaklad pro globalni Sanity dokumenty.",
            "Social link href jsou zatim prazdne a je potreba je doplnit z realnych uctu.",
            "Kontaktni email a telefon zatim nejsou potvrzene ze snapshotu a zustavaji prazdne.",
        ],
        "documents": docs,
    }


def main() -> None:
    seed = build_seed()
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(seed, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Generated {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
