#!/usr/bin/env python3
from __future__ import annotations

import json
import mimetypes
from collections import defaultdict
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
INPUT_PATH = ROOT / "snapshot" / "manifests" / "sanity-import-documents.ndjson"
OUTPUT_PATH = ROOT / "snapshot" / "manifests" / "sanity-asset-manifest.json"
MAP_TEMPLATE_PATH = ROOT / "snapshot" / "manifests" / "sanity-asset-map.template.json"


def read_documents() -> list[dict[str, Any]]:
    return [
        json.loads(line)
        for line in INPUT_PATH.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]


def visit(node: Any, *, path: str, callback) -> None:
    callback(node, path)

    if isinstance(node, list):
        for index, item in enumerate(node):
            visit(item, path=f"{path}[{index}]", callback=callback)
        return

    if isinstance(node, dict):
        for key, value in node.items():
            if key.startswith("_"):
                continue
            next_path = f"{path}.{key}" if path else key
            visit(value, path=next_path, callback=callback)


def collect_assets(documents: list[dict[str, Any]]) -> list[dict[str, Any]]:
    by_local_path: dict[str, dict[str, Any]] = {}
    usages_by_path: dict[str, list[dict[str, str]]] = defaultdict(list)

    for document in documents:
        document_id = document["_id"]

        def on_node(node: Any, path: str) -> None:
            if not isinstance(node, dict) or node.get("_type") != "migrationImage":
                return

            local_path = node.get("localPath")
            source_url = node.get("sourceUrl")
            alt = node.get("alt", "")
            caption = node.get("caption", "")
            if not local_path:
                return

            absolute_path = (ROOT / local_path).resolve()
            mime_type, _ = mimetypes.guess_type(str(absolute_path))
            file_size = absolute_path.stat().st_size if absolute_path.exists() else None

            if local_path not in by_local_path:
                by_local_path[local_path] = {
                    "local_path": local_path,
                    "absolute_path": str(absolute_path),
                    "source_url": source_url,
                    "suggested_alt": alt,
                    "suggested_caption": caption,
                    "mime_type": mime_type,
                    "file_size": file_size,
                    "exists": absolute_path.exists(),
                }

            usages_by_path[local_path].append(
                {
                    "document_id": document_id,
                    "document_type": document["_type"],
                    "field_path": path,
                    "alt": alt,
                    "caption": caption,
                }
            )

        visit(document, path="", callback=on_node)

    assets: list[dict[str, Any]] = []
    for local_path, asset in sorted(by_local_path.items()):
        asset["usage_count"] = len(usages_by_path[local_path])
        asset["usages"] = usages_by_path[local_path]
        assets.append(asset)

    return assets


def build_map_template(assets: list[dict[str, Any]]) -> dict[str, Any]:
    return {
        "notes": [
            "Vypln `asset_ref` po nahrani assetu do Sanity datasetu.",
            "Klíčem je `local_path` ze snapshotu, aby hydratační skript mohl nahradit migrationImage placeholdery.",
        ],
        "assets": {
            asset["local_path"]: {
                "asset_ref": "",
                "asset_type": "sanity.imageAsset",
                "original_filename": Path(asset["local_path"]).name,
            }
            for asset in assets
        },
    }


def main() -> None:
    documents = read_documents()
    assets = collect_assets(documents)

    manifest = {
        "generated_from": str(INPUT_PATH.relative_to(ROOT)),
        "asset_count": len(assets),
        "assets": assets,
    }

    OUTPUT_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    MAP_TEMPLATE_PATH.write_text(
        json.dumps(build_map_template(assets), ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"Generated asset manifest with {len(assets)} unique assets.")
    print(f"- Manifest: {OUTPUT_PATH}")
    print(f"- Map template: {MAP_TEMPLATE_PATH}")


if __name__ == "__main__":
    main()
