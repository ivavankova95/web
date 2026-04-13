# Lokální snapshot textů a obrázků

Datum: 2026-04-09

Tento dokument popisuje doporučený způsob, jak získat lokální snapshot aktuálního veřejného webu pro implementaci nového řešení.

## 1. Proč snapshot dělat

Implementace nového webu by neměla být závislá na tom, že:

- live web je vždy dostupný
- obsah se během vývoje nezmění
- obrázky zůstanou na stejných CDN URL navždy

Proto je potřeba mít lokální pracovní snapshot:

- textů
- obrázků
- page metadata
- základních odkazů a CTA

## 2. Co je “nejlepší způsob”

Pro tento projekt je nejlepší kombinace 3 vrstev:

### Vrstva A. Technický crawl

Účel:

- zachytit všechny veřejné URL
- uložit raw HTML
- zachytit DOM stromy
- získat metadata o šablonách, formulářích a embed doménách

Skript:

- `scripts/map_webflow_site.py`

Výstupy:

- `analysis/site-crawl.json`
- `analysis/raw-html/`
- `analysis/dom-trees/`

### Vrstva B. Runtime sonda

Účel:

- zachytit to, co se do stránky dostane až v browseru
- potvrdit MailerLite, Elfsight, Wistia, legacy FAPI a Stripe vazby

Skript:

- `scripts/runtime_probe.py`

Výstup:

- `analysis/runtime/runtime-probe.json`

### Vrstva C. Lokální content snapshot

Účel:

- exportovat texty do Markdown a JSON
- stáhnout obrázky lokálně
- vytvořit manifest, které assety jsou stažené a které ne

Skript:

- `scripts/export_content_snapshot.py`

Výstupy:

- `snapshot/pages-md/`
- `snapshot/pages-json/`
- `snapshot/assets/images/`
- `snapshot/manifests/snapshot-manifest.json`
- `snapshot/README.md`

## 3. Doporučený workflow

### První vytvoření snapshotu

```bash
python3 scripts/map_webflow_site.py
python3 scripts/runtime_probe.py
python3 scripts/export_content_snapshot.py
```

Nebo jedním příkazem:

```bash
./scripts/refresh_source_bundle.sh
```

### Obnova snapshotu těsně před implementací

```bash
python3 scripts/export_content_snapshot.py --refresh
```

`--refresh` nejdřív obnoví crawl a až potom vytvoří nový content bundle.

## 4. Co se exportuje automaticky

### Texty

- headings
- odstavce
- seznamy
- captions
- CTA texty a odkazy
- metadata stránky

### Obrázky

- obrázky z `<img>` tagů
- nejlepší nalezená varianta ze `srcset`
- OG / Twitter image reference
- obrázky objevené v CSS přes `url(...)`

### Stránkové informace

- URL
- page type
- canonical
- základní formulářová struktura
- seznam content bloků

## 5. Co se neexportuje plně automaticky

Tyto věci jsou zachycené jen jako reference, ne jako úplný obsah providerů:

- Wistia videa
- YouTube videa
- FAPI checkout internals z aktuálního webu
- Stripe checkout internals
- obsah uvnitř cross-origin iframe
- chráněná členská sekce

To je v pořádku, protože pro přepis veřejného webu jsou klíčové hlavně:

- veřejné texty
- veřejné obrázky
- informace, že daný embed na stránce existuje

## 6. Proč je tento přístup nejlepší právě tady

Protože současný web:

- běží na Webflow
- má mix standardních stránek, CMS listingu a standalone landingů
- používá i runtime embedy a formuláře

Pouhý `wget` mirror by nestačil, protože:

- neumí dobře oddělit text od šumu
- nedá ti použitelné content soubory pro implementaci
- neodliší runtime integrace od skutečného obsahu

Pouhá ruční copy-paste migrace by nestačila, protože:

- je pomalá
- není auditovatelná
- špatně se opakuje

Tato kombinace crawl + runtime + content export dává:

- auditovatelnost
- opakovatelnost
- lokální asset bank
- pracovní Markdown/JSON podklady pro implementaci

## 7. Doporučení pro implementační fázi

- při přepisu používat `snapshot/pages-md/` jako čitelný zdroj
- při importu nebo scaffoldingu používat `snapshot/pages-json/` jako structured source
- obrázky brát z `snapshot/assets/images/`
- pro videa a původní checkout flow vycházet z `analysis/runtime/runtime-probe.json` a `docs/migration/integrations.md` jen jako z referenční dokumentace ke stávajícímu stavu

## 8. QA pro snapshot

Po exportu zkontrolovat:

- `snapshot/pages-md/` obsahuje 50 veřejných stránek
- `snapshot/assets/images/` obsahuje očekávané brandové a obsahové assety
- žádný asset není ve stavu `failed`
- klíčové stránky jako homepage, blog, článek, průvodce a checkout page mají smysluplný Markdown export

## 9. Související soubory

- `scripts/map_webflow_site.py`
- `scripts/runtime_probe.py`
- `scripts/export_content_snapshot.py`
- `snapshot/README.md`
- `analysis/site-crawl.json`
- `analysis/runtime/runtime-probe.json`
