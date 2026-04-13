#!/usr/bin/env python3
"""
check_sanity_content.py

Dotáže Sanity přes GROQ a vypíše, které blogové posty mají prázdný nebo chybějící
portable text `content`. Pomáhá identifikovat posty, kde fallback na snapshot
zůstane aktivní i po přepnutí na Sanity rendering.

Použití:
  python3 scripts/check_sanity_content.py

Env vars (načítá z .env.local automaticky):
  NEXT_PUBLIC_SANITY_PROJECT_ID
  NEXT_PUBLIC_SANITY_DATASET
  SANITY_API_READ_TOKEN
"""

import os
import json
import urllib.request
import urllib.parse
from pathlib import Path


def load_env_local():
    env_file = Path(__file__).parent.parent / ".env.local"
    if not env_file.exists():
        return
    for line in env_file.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        os.environ.setdefault(key.strip(), value.strip())


def sanity_query(project_id: str, dataset: str, token: str, query: str) -> list:
    encoded_query = urllib.parse.quote(query)
    url = f"https://{project_id}.api.sanity.io/v2024-01-01/data/query/{dataset}?query={encoded_query}"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read())
    return data.get("result", [])


def main():
    load_env_local()

    project_id = os.environ.get("NEXT_PUBLIC_SANITY_PROJECT_ID", "")
    dataset = os.environ.get("NEXT_PUBLIC_SANITY_DATASET", "production")
    token = os.environ.get("SANITY_API_READ_TOKEN", "")

    if not project_id or not token:
        print("CHYBA: NEXT_PUBLIC_SANITY_PROJECT_ID nebo SANITY_API_READ_TOKEN není nastavený.")
        return

    print(f"Připojuji se na Sanity projekt {project_id} / dataset {dataset}...\n")

    # Posty s prázdným nebo chybějícím contentem
    empty_query = """*[_type == 'blogPost' && (!defined(content) || count(content) == 0)] | order(title asc) {
  _id,
  title,
  "slug": slug.current
}"""

    # Posty s contentem
    filled_query = """*[_type == 'blogPost' && defined(content) && count(content) > 0] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  "contentBlocks": count(content)
}"""

    empty_posts = sanity_query(project_id, dataset, token, empty_query)
    filled_posts = sanity_query(project_id, dataset, token, filled_query)

    total = len(empty_posts) + len(filled_posts)
    print(f"Celkem blog postů: {total}")
    print(f"  S contentem (Sanity renderer): {len(filled_posts)}")
    print(f"  Bez contentu (snapshot fallback): {len(empty_posts)}")
    print()

    if filled_posts:
        print("=== POSTY SE SANITY CONTENTEM ===")
        for post in filled_posts:
            slug = post.get("slug", "—")
            blocks = post.get("contentBlocks", 0)
            print(f"  [{blocks} bloků] /clanky/{slug} — {post.get('title', '—')}")
        print()

    if empty_posts:
        print("=== POSTY BEZ CONTENTU (zůstane snapshot fallback) ===")
        for post in empty_posts:
            slug = post.get("slug", "—")
            print(f"  /clanky/{slug} — {post.get('title', '—')}")
        print()
        print("Tip: Tyto posty doplň ručně v Sanity Studiu, nebo je přeimportuj ze snapshotu.")
    else:
        print("Všechny posty mají vyplněný content.")


if __name__ == "__main__":
    main()
