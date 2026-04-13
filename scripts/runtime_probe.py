#!/usr/bin/env python3
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ANALYSIS_DIR = ROOT / "analysis" / "runtime"
SESSION = "zmb-runtime"
PWCLI = Path.home() / ".codex" / "skills" / "playwright" / "scripts" / "playwright_cli.sh"

PAGES = [
    "https://www.zdravimebavi.cz/",
    "https://www.zdravimebavi.cz/blog",
    "https://www.zdravimebavi.cz/clanky/arasidova-omacka",
    "https://www.zdravimebavi.cz/kategorie/sladke",
    "https://www.zdravimebavi.cz/cviceni-v-benatkach-nad-jizerou",
    "https://www.zdravimebavi.cz/letni-prazdninova-vyzva",
    "https://www.zdravimebavi.cz/napis-mi",
    "https://www.zdravimebavi.cz/konzultace-zdarma",
    "https://www.zdravimebavi.cz/osobni-konzultace",
    "https://www.zdravimebavi.cz/formular---pruvodce-vyzivou-a-pohybem",
    "https://www.zdravimebavi.cz/kalendar",
    "https://www.zdravimebavi.cz/search",
    "https://www.zdravimebavi.cz/404",
]

EVAL_JS = r"""JSON.stringify((() => {
  const toHostnames = (items) => [...new Set(
    items
      .filter(Boolean)
      .map((value) => {
        try { return new URL(value, location.href).hostname; } catch { return ''; }
      })
      .filter(Boolean)
  )];

  const visibleHeadings = [...document.querySelectorAll('h1,h2,h3')]
    .map((el) => (el.textContent || '').replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .slice(0, 8);

  const forms = [...document.querySelectorAll('form')].map((form) => ({
    id: form.id || '',
    name: form.getAttribute('name') || '',
    action: form.getAttribute('action') || '',
    method: (form.getAttribute('method') || 'get').toLowerCase(),
    fieldCount: form.querySelectorAll('input,textarea,select').length,
    fields: [...form.querySelectorAll('input,textarea,select')].map((el) => ({
      tag: el.tagName.toLowerCase(),
      type: el.getAttribute('type') || '',
      name: el.getAttribute('name') || '',
      required: el.required || el.getAttribute('aria-required') === 'true'
    }))
  }));

  return {
    url: location.href,
    title: document.title,
    readyState: document.readyState,
    bodyClass: document.body ? document.body.className : '',
    headings: visibleHeadings,
    forms,
    iframes: [...document.querySelectorAll('iframe')].map((el) => el.src).filter(Boolean),
    scriptDomains: toHostnames([...document.querySelectorAll('script[src]')].map((el) => el.src)),
    stylesheetDomains: toHostnames([...document.querySelectorAll('link[href]')].map((el) => el.href)),
    anchorsToExternal: [...document.querySelectorAll('a[href]')]
      .map((el) => el.href)
      .filter((href) => href && !href.startsWith(location.origin))
      .slice(0, 20),
    counts: {
      nav: document.querySelectorAll('.w-nav').length,
      dynList: document.querySelectorAll('.w-dyn-list').length,
      richText: document.querySelectorAll('.w-richtext').length,
      forms: document.querySelectorAll('.w-form').length,
      pagination: document.querySelectorAll('.w-pagination-wrapper').length,
      lightbox: document.querySelectorAll('.w-lightbox').length,
      elfsight: document.querySelectorAll('[class*="elfsight"]').length,
      wistia: document.querySelectorAll('[class*="wistia"], [src*="wistia"]').length,
      youtube: document.querySelectorAll('iframe[src*="youtube"], [src*="youtube.com"]').length,
      embeddedScripts: document.querySelectorAll('.w-embed script, .w-script script').length
    }
  };
})())"""


def run_pw(*args: str, raw: bool = False) -> str:
    cmd = [str(PWCLI)]
    if raw:
        cmd.append("--raw")
    cmd.extend(["-s", SESSION, *args])
    result = subprocess.run(cmd, cwd=ROOT, text=True, capture_output=True, check=True)
    return result.stdout.strip()


def ensure_cli() -> None:
    if not PWCLI.exists():
        raise FileNotFoundError(f"Playwright CLI wrapper not found: {PWCLI}")


def navigate(url: str, first: bool) -> None:
    if first:
        run_pw("open", url)
    else:
        run_pw("goto", url)
    run_pw("run-code", "await page.waitForLoadState('domcontentloaded'); await page.waitForTimeout(1800);")


def collect_page(url: str, first: bool) -> dict:
    navigate(url, first)
    raw = run_pw("eval", EVAL_JS, raw=True)
    payload = json.loads(raw)
    return json.loads(payload)


def main() -> int:
    ensure_cli()
    ANALYSIS_DIR.mkdir(parents=True, exist_ok=True)
    results = []
    for idx, url in enumerate(PAGES):
        results.append(collect_page(url, first=(idx == 0)))
    try:
        run_pw("close")
    except subprocess.CalledProcessError:
        pass

    output = {
        "session": SESSION,
        "pages": results,
    }
    out_path = ANALYSIS_DIR / "runtime-probe.json"
    out_path.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"page_count": len(results), "output": str(out_path.relative_to(ROOT))}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
