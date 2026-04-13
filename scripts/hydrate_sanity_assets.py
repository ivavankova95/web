#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_INPUT = ROOT / "snapshot" / "manifests" / "sanity-import-documents.ndjson"
DEFAULT_MAP = ROOT / "snapshot" / "manifests" / "sanity-asset-map.json"
DEFAULT_OUTPUT = ROOT / "snapshot" / "manifests" / "sanity-import-documents.hydrated.ndjson"
DEFAULT_SUMMARY = ROOT / "snapshot" / "manifests" / "sanity-import-documents.hydrated.summary.json"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Replace migrationImage placeholders with real Sanity asset refs.")
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT)
    parser.add_argument("--asset-map", type=Path, default=DEFAULT_MAP)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--summary", type=Path, default=DEFAULT_SUMMARY)
    return parser.parse_args()


def read_ndjson(path: Path) -> list[dict[str, Any]]:
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]


def read_asset_map(path: Path) -> dict[str, dict[str, Any]]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if "assets" in payload:
        return payload["assets"]
    return payload


def convert_placeholder(node: dict[str, Any], asset_map: dict[str, dict[str, Any]], unresolved: list[str]) -> dict[str, Any]:
    local_path = node.get("localPath", "")
    mapping = asset_map.get(local_path)
    if not mapping or not mapping.get("asset_ref"):
        unresolved.append(local_path)
        return node

    image: dict[str, Any] = {
        "_type": "image",
        "_key": node.get("_key"),
        "asset": {
            "_type": "reference",
            "_ref": mapping["asset_ref"],
        },
    }

    alt = node.get("alt")
    caption = node.get("caption")
    if alt:
        image["alt"] = alt
    if caption:
        image["caption"] = caption

    return image


def hydrate_node(node: Any, asset_map: dict[str, dict[str, Any]], unresolved: list[str]) -> Any:
    if isinstance(node, list):
        return [hydrate_node(item, asset_map, unresolved) for item in node]

    if isinstance(node, dict):
        if node.get("_type") == "migrationImage":
            return convert_placeholder(node, asset_map, unresolved)
        return {key: hydrate_node(value, asset_map, unresolved) for key, value in node.items()}

    return node


def first_image_from_portable_text(content: list[dict[str, Any]]) -> dict[str, Any] | None:
    for item in content:
        if isinstance(item, dict) and item.get("_type") == "image" and item.get("asset", {}).get("_ref"):
            image = {
                "_type": "image",
                "asset": item["asset"],
            }
            if item.get("alt"):
                image["alt"] = item["alt"]
            return image
    return None


def main() -> None:
    args = parse_args()
    documents = read_ndjson(args.input)
    asset_map = read_asset_map(args.asset_map)
    unresolved: list[str] = []
    hydrated_documents: list[dict[str, Any]] = []

    for document in documents:
        hydrated = hydrate_node(document, asset_map, unresolved)

        if hydrated.get("_type") == "blogPost" and not hydrated.get("mainImage"):
            first_image = first_image_from_portable_text(hydrated.get("content", []))
            if first_image:
                hydrated["mainImage"] = first_image

        hydrated_documents.append(hydrated)

    unresolved = sorted(set(path for path in unresolved if path))
    if unresolved:
        raise SystemExit(
            "Missing asset_ref mapping for local paths:\n- " + "\n- ".join(unresolved)
        )

    args.output.write_text(
        "\n".join(json.dumps(document, ensure_ascii=False) for document in hydrated_documents) + "\n",
        encoding="utf-8",
    )

    summary = {
        "input": str(args.input.relative_to(ROOT)),
        "asset_map": str(args.asset_map.relative_to(ROOT)),
        "output": str(args.output.relative_to(ROOT)),
        "document_count": len(hydrated_documents),
        "hydrated_asset_count": len(asset_map),
    }
    args.summary.write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"Hydrated {len(hydrated_documents)} documents.")
    print(f"- Output: {args.output}")
    print(f"- Summary: {args.summary}")


if __name__ == "__main__":
    main()
