#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

python3 scripts/map_webflow_site.py
python3 scripts/runtime_probe.py
python3 scripts/export_content_snapshot.py

echo "Source bundle refreshed:"
echo "  - analysis/site-crawl.json"
echo "  - analysis/runtime/runtime-probe.json"
echo "  - snapshot/"
