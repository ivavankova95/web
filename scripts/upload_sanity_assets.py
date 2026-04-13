#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import mimetypes
import os
import sys
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MANIFEST = ROOT / "snapshot" / "manifests" / "sanity-asset-manifest.json"
DEFAULT_OUTPUT = ROOT / "snapshot" / "manifests" / "sanity-asset-map.json"
API_VERSION = os.environ.get("SANITY_API_VERSION", "2025-02-19")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Upload snapshot assets to Sanity and build asset map.")
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--overwrite", action="store_true")
    parser.add_argument("--limit", type=int, default=0, help="Upload only first N assets, 0 means all.")
    return parser.parse_args()


def read_required_env(name: str) -> str:
    value = os.environ.get(name, "").strip()
    if not value:
        raise SystemExit(f"Missing required environment variable: {name}")
    return value


def load_manifest(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def upload_asset(
    *,
    project_id: str,
    dataset: str,
    token: str,
    file_path: Path,
    file_name: str,
) -> dict[str, Any]:
    mime_type = mimetypes.guess_type(str(file_path))[0] or "application/octet-stream"
    url = (
        f"https://{project_id}.api.sanity.io/v{API_VERSION}/assets/images/"
        f"{dataset}?filename={urllib.parse.quote(file_name)}"
    )

    with file_path.open("rb") as handle:
        request = urllib.request.Request(
            url,
            data=handle.read(),
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": mime_type,
            },
            method="POST",
        )
    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        body = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Sanity asset upload failed for {file_name}: {error.code} {body}") from error

    document = payload.get("document") or payload
    return {
        "asset_ref": document["_id"],
        "asset_type": document.get("_type", "sanity.imageAsset"),
        "url": document.get("url", ""),
        "original_filename": file_name,
    }


def main() -> None:
    args = parse_args()
    project_id = read_required_env("NEXT_PUBLIC_SANITY_PROJECT_ID")
    dataset = read_required_env("NEXT_PUBLIC_SANITY_DATASET")
    token = read_required_env("SANITY_API_WRITE_TOKEN")

    manifest = load_manifest(args.manifest)
    assets: list[dict[str, Any]] = manifest.get("assets", [])
    if args.limit > 0:
        assets = assets[: args.limit]

    output_payload = {
        "project_id": project_id,
        "dataset": dataset,
        "api_version": API_VERSION,
        "assets": {},
    }

    uploaded = 0
    skipped = 0
    for asset in assets:
        local_path = asset["local_path"]
        absolute_path = Path(asset["absolute_path"])
        if not absolute_path.exists():
            raise SystemExit(f"Asset file does not exist: {absolute_path}")

        if local_path in output_payload["assets"] and not args.overwrite:
            skipped += 1
            continue

        output_payload["assets"][local_path] = upload_asset(
            project_id=project_id,
            dataset=dataset,
            token=token,
            file_path=absolute_path,
            file_name=absolute_path.name,
        )
        uploaded += 1
        print(f"Uploaded {uploaded}: {local_path}", file=sys.stderr)

    args.output.write_text(json.dumps(output_payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Uploaded {uploaded} assets, skipped {skipped}.")
    print(f"- Asset map: {args.output}")


if __name__ == "__main__":
    main()
