# Sanity Import Workflow

Datum: 2026-04-12

Tento postup navazuje na snapshot export a připravuje finální import do Sanity datasetu.

## 1. Vygenerovat obsahové dokumenty

```bash
npm run sanity:generate-import-documents
```

Výstup:

- `snapshot/manifests/sanity-import-documents.ndjson`
- `snapshot/manifests/sanity-import-documents.summary.json`

Bundle obsahuje globální dokumenty, stránky, služby, nabídky, články a kategorie.

## 2. Vygenerovat asset manifest

```bash
npm run sanity:generate-asset-manifest
```

Výstup:

- `snapshot/manifests/sanity-asset-manifest.json`
- `snapshot/manifests/sanity-asset-map.template.json`

Manifest obsahuje:

- unikátní `local_path` každého snapshot assetu
- původní `source_url`
- doporučený alt/caption text
- vazby na dokumenty a konkrétní field path

## 3. Nahrát assety do Sanity

Automatizovaná varianta:

```bash
npm run sanity:upload-assets
```

Požadované env vars:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_WRITE_TOKEN`

Výstup:

- `snapshot/manifests/sanity-asset-map.json`

Skript:

- nahraje snapshot assety do cílového datasetu
- uloží `asset_ref` mapu podle `local_path`
- připraví podklad pro finální hydratační krok

Ruční fallback zůstává možný přes `sanity-asset-map.template.json`, pokud je potřeba assety nahrát jiným workflow.

## 4. Hydratovat image reference do finálního bundle

```bash
npm run sanity:hydrate-assets
```

Výstup:

- `snapshot/manifests/sanity-import-documents.hydrated.ndjson`
- `snapshot/manifests/sanity-import-documents.hydrated.summary.json`

Hydratace:

- nahradí všechny `migrationImage` placeholdery za Sanity `image` objekty s asset reference
- u `blogPost` doplní `mainImage` z prvního dostupného importovaného obrázku v obsahu
- spadne s chybou, pokud v mapě chybí některý `local_path`

## 5. Import do datasetu

Po hydrataci je cílový bundle připravený pro dataset import.

Před ostrým importem zkontrolovat:

- `productKey` a `stripePriceId` u checkout stránek
- social URL a kontaktní údaje v `siteSettings`
- SEO metadata u stránek bez kvalitního `meta_description`
- zda je embedded Studio route stále mimo scope nebo se bude řešit paralelně

## 6. Zapojit revalidaci po publikaci

Po importu a přepnutí frontendu na Sanity je potřeba zapojit webhook revalidaci.

Požadované env vars:

- `SANITY_REVALIDATE_SECRET`

Frontend route:

```text
/api/revalidate/sanity
```

Detailní postup:

- viz `docs/migration/sanity-webhook-setup.md`
