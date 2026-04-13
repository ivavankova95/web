from __future__ import annotations

import csv
import json
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parent.parent
WEB_EXPORT_DIR = ROOT / "zdravimebavi.cz-Performance-on-Search-2026-04-12"
IMAGE_EXPORT_DIR = ROOT / "zdravimebavi.cz-Performance-on-Search-2026-04-12_obrazek"
OUTPUT_JSON = ROOT / "analysis" / "search-console-summary.json"
OUTPUT_MD = ROOT / "docs" / "migration" / "search-console-seo-priorities.md"


@dataclass
class PageRow:
    path: str
    clicks: int
    impressions: int
    ctr: float
    position: float


@dataclass
class QueryRow:
    query: str
    clicks: int
    impressions: int
    ctr: float
    position: float


def parse_int(value: str) -> int:
    return int(value.replace(" ", "").strip())


def parse_percent(value: str) -> float:
    return float(value.replace("%", "").replace(",", ".").strip())


def parse_float(value: str) -> float:
    return float(value.replace(",", ".").strip())


def normalize_path(url: str) -> str:
    path = urlparse(url).path or "/"
    return path.rstrip("/") or "/"


def read_pages(export_dir: Path) -> list[PageRow]:
    rows: list[PageRow] = []
    with (export_dir / "Stránky.csv").open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            rows.append(
                PageRow(
                    path=normalize_path(row["Nejvýznamnější stránky"]),
                    clicks=parse_int(row["Prokliky"]),
                    impressions=parse_int(row["Zobrazení"]),
                    ctr=parse_percent(row["CTR"]),
                    position=parse_float(row["Pozice"]),
                )
            )
    return rows


def read_queries(export_dir: Path) -> list[QueryRow]:
    rows: list[QueryRow] = []
    with (export_dir / "Dotazy.csv").open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            rows.append(
                QueryRow(
                    query=row["Nejčastější dotazy"].strip(),
                    clicks=parse_int(row["Prokliky"]),
                    impressions=parse_int(row["Zobrazení"]),
                    ctr=parse_percent(row["CTR"]),
                    position=parse_float(row["Pozice"]),
                )
            )
    return rows


def build_known_routes() -> set[str]:
    routes: set[str] = {"/"}
    for path in (ROOT / "snapshot" / "pages-json").glob("*.json"):
        name = path.name
        if name == "home.json":
            routes.add("/")
        elif name.startswith("clanky__"):
            routes.add(f"/clanky/{name[len('clanky__'):-5]}")
        elif name.startswith("kategorie__"):
            routes.add(f"/kategorie/{name[len('kategorie__'):-5]}")
        else:
            routes.add(f"/{name[:-5]}")
    routes.update(
        {
            "/robots.txt",
            "/sitemap.xml",
            "/search",
        }
    )
    return routes


def to_dicts(rows: Iterable[PageRow | QueryRow]) -> list[dict[str, object]]:
    return [row.__dict__ for row in rows]


def top_recipe_pages(rows: list[PageRow]) -> list[PageRow]:
    keywords = ("dort", "pudink", "omacka", "babovka", "tiramisu", "datle", "kase")
    return [row for row in rows if any(keyword in row.path for keyword in keywords)][:10]


def top_recipe_queries(rows: list[QueryRow]) -> list[QueryRow]:
    keywords = ("dort", "pudink", "omáčka", "omacka", "bábovka", "babovka", "tiramisu", "kaše", "kase")
    return [row for row in rows if any(keyword in row.query.lower() for keyword in keywords)][:20]


def format_page_table(lines: list[str], rows: list[PageRow]) -> None:
    lines.append("| URL | Prokliky | Zobrazení | CTR | Pozice |")
    lines.append("| --- | ---: | ---: | ---: | ---: |")
    for row in rows:
        lines.append(f"| `{row.path}` | {row.clicks} | {row.impressions} | {row.ctr:.2f}% | {row.position:.2f} |")


def format_query_table(lines: list[str], rows: list[QueryRow]) -> None:
    lines.append("| Dotaz | Prokliky | Zobrazení | CTR | Pozice |")
    lines.append("| --- | ---: | ---: | ---: | ---: |")
    for row in rows:
        lines.append(f"| `{row.query}` | {row.clicks} | {row.impressions} | {row.ctr:.2f}% | {row.position:.2f} |")


def main() -> None:
    web_pages = read_pages(WEB_EXPORT_DIR)
    web_queries = read_queries(WEB_EXPORT_DIR)
    image_pages = read_pages(IMAGE_EXPORT_DIR) if IMAGE_EXPORT_DIR.exists() else []
    image_queries = read_queries(IMAGE_EXPORT_DIR) if IMAGE_EXPORT_DIR.exists() else []
    known_routes = build_known_routes()

    web_missing_routes = [row for row in web_pages if row.path not in known_routes]
    image_missing_routes = [row for row in image_pages if row.path not in known_routes]

    summary = {
        "web_export_dir": str(WEB_EXPORT_DIR.relative_to(ROOT)),
        "image_export_dir": str(IMAGE_EXPORT_DIR.relative_to(ROOT)) if IMAGE_EXPORT_DIR.exists() else None,
        "web": {
            "page_count": len(web_pages),
            "query_count": len(web_queries),
            "top_pages": to_dicts(web_pages[:15]),
            "top_queries": to_dicts(web_queries[:25]),
            "missing_routes": to_dicts(web_missing_routes),
        },
        "image": {
            "page_count": len(image_pages),
            "query_count": len(image_queries),
            "top_pages": to_dicts(image_pages[:15]),
            "top_queries": to_dicts(image_queries[:25]),
            "missing_routes": to_dicts(image_missing_routes),
        },
        "protected_recipe_pages": {
            "web": to_dicts(top_recipe_pages(web_pages)),
            "image": to_dicts(top_recipe_pages(image_pages)),
        },
        "protected_recipe_queries": {
            "web": [row.query for row in top_recipe_queries(web_queries)],
            "image": [row.query for row in top_recipe_queries(image_queries)],
        },
    }

    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_JSON.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Search Console SEO priorities",
        "",
        "Zdroj:",
        f"- Web export: `{WEB_EXPORT_DIR.name}`",
        f"- Image export: `{IMAGE_EXPORT_DIR.name}`" if IMAGE_EXPORT_DIR.exists() else "- Image export: nenalezen",
        "",
        "## Nejkritičtější stránky z webového vyhledávání",
        "",
    ]

    format_page_table(lines, web_pages[:15])

    lines.extend(
        [
            "",
            "## Nejkritičtější stránky z Google obrázků",
            "",
        ]
    )
    format_page_table(lines, image_pages[:15])

    lines.extend(
        [
            "",
            "## Nejkritičtější dotazy z webového vyhledávání",
            "",
        ]
    )
    format_query_table(lines, web_queries[:20])

    lines.extend(
        [
            "",
            "## Nejkritičtější dotazy z Google obrázků",
            "",
        ]
    )
    format_query_table(lines, image_queries[:20])

    lines.extend(
        [
            "",
            "## Chybějící URL v nové struktuře",
            "",
            "### Web",
            "",
        ]
    )

    if web_missing_routes:
        format_page_table(lines, web_missing_routes)
    else:
        lines.append("Žádné chybějící URL v top web exportu.")

    lines.extend(["", "### Obrázky", ""])

    if image_missing_routes:
        format_page_table(lines, image_missing_routes)
    else:
        lines.append("Žádné chybějící URL v top image exportu.")

    lines.extend(
        [
            "",
            "## Migrační doporučení",
            "",
            "- Neměnit slug `/clanky/dort-k-prvnim-narozeninam`, title ani hlavní záměr stránky.",
            "- U receptových článků zachovat silné obrázky, alt texty, image sitemap a `Recipe` structured data.",
            "- Před cutoverem zkontrolovat, že všechny historické URL s impressemi mají 301 redirect nebo přímou route.",
            "- Po spuštění webu nahrát novou sitemap do Search Console a sledovat zvlášť Web a Obrázky.",
            "- `dort-k-prvnim-narozeninam` je kritická URL pro oba search typy a nesmí se jí změnit cesta ani oslabit hlavní obrázky.",
            "",
        ]
    )

    OUTPUT_MD.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"Wrote {OUTPUT_JSON}")
    print(f"Wrote {OUTPUT_MD}")


if __name__ == "__main__":
    main()
