# Deployment a provoz

Datum: 2026-04-09

Tento dokument popisuje doporučený provozní setup pro nový web na Next.js + Sanity + Netlify.

## 1. Cílové prostředí

- GitHub Private repo
- Netlify Free
- Sanity Free
- stejná doména `www.zdravimebavi.cz`
- automatický deployment z GitHubu

## 2. Doporučený provozní model

## 2.1 Frontend

- Next.js projekt hostovaný na Netlify
- build trigger z GitHubu
- static-first rendering
- minimum runtime server computingu

## 2.2 CMS

- Sanity projekt se 2 datasety:
  - `staging`
  - `production`
- editorske rozhrani: Sanity Studio integrovane do projektu pres schema a CLI workflow

Důvod:

- Free plán má limit 2 datasetů
- zároveň to stačí pro bezpečný redakční workflow

Role caveat:

- Sanity Free má omezené role
- pokud budou na projektu externí editorky nebo širší tým s odlišnými oprávněními, je potřeba to předem rozhodnout

## 2.3 Média

- originály v Sanity asset store
- delivery přes Sanity CDN
- finální optimalizace a edge delivery přes Netlify Image CDN

## 3. Git workflow

Nejjednodušší workflow pro Free plán:

- `main`
  - production
- feature branches
  - pull request + Deploy Preview

Volitelně:

- `develop`
  - branch deploy pro interní testy

Doporučení:

- nepřidávat zbytečně další dlouho žijící branche
- kvůli omezením Free plánu držet build flow jednoduchý

## 4. GitHub private repo a Netlify

## 4.1 Preferovaná varianta

- soukromý repozitář
- automatický deploy při merge do `main`
- preview deploy při otevření nebo update PR

## 4.2 Důležitá poznámka

Pokud bude repozitář umístěný v GitHub Organization a ne v osobním účtu, je potřeba před finálním setupem znovu ověřit kompatibilitu s Netlify Free pro Git-based deployment. Pokud by to bylo omezené, fallback je:

- GitHub Actions
- Netlify build hook nebo Netlify CLI deploy

## 5. Limity Netlify Free a pravidla pro deploy

### 5.1 Limity plánu (ověřeno 2026-04-13)

| Limit | Hodnota |
|-------|---------|
| Build minuty | **300 minut / měsíc** |
| Chování při překročení | Web se automaticky pozastaví (žádné přeplatky) |
| Upozornění | při 50 %, 75 %, 90 % a 100 % spotřeby |

Náš Next.js build trvá přibližně **2–3 minuty** → při normálním provozu to umožňuje cca **100–150 deployů za měsíc**.

### 5.2 Doporučená pravidla

- Průběžný vývoj a ladění testovat **lokálně** (`npm run dev`) — ne pushovat každou iteraci.
- Na GitHub pushovat až **hotové, otestované bloky** — každý push triggeruje deploy.
- Při blížícím se limitu (upozornění od Netlify) přejít na `netlify deploy --build` ručně přes CLI, nebo dočasně přepnout Netlify na manuální deploy (vypnout auto-publish).
- Větší obsahové změny v Sanity Studiu **dávkovat** — jeden webhook = jeden rebuild.
- Sanity webhook na `api/revalidate/sanity` rebuild **nespouští** — pouze invaliduje ISR cache. Build se spustí jen při push do `main`.

## 6. Doporučené build chování

S ohledem na Netlify Free:

- build všech veřejných stránek při merge do `main`
- content publish v Sanity má triggerovat invalidaci přes webhook (ne rebuild)
- nepoužívat složitý runtime personalization
- search řešit bez heavy server computingu
- preferovat route rendering přes static generation a cache-friendly data fetching

## 6. Doporučený search přístup

Protože web je obsahově malý, search by měl být:

- build-time indexovaný
- query-driven na route `/search`
- bez závislosti na externím Webflow search backendu

Doporučení:

- v buildu generovat jednoduchý search dataset z `blogPost` a vybraných `page`
- client-side filtrovat nebo použít lehký server endpoint jen pokud bude nutný

## 7. Environment proměnné

## 7.1 Public env vars

| Proměnná | Účel |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | veřejná doména |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project |
| `NEXT_PUBLIC_SANITY_DATASET` | aktivní dataset |
| `NEXT_PUBLIC_GTM_ID` | GTM container |
| `NEXT_PUBLIC_GA4_ID` | GA4 measurement id |
| `NEXT_PUBLIC_HOTJAR_ID` | Hotjar site id |
| `NEXT_PUBLIC_META_PIXEL_ID` | Facebook Pixel |
| `NEXT_PUBLIC_COOKIE_SCRIPT_ID` | Cookie Script |
| `NEXT_PUBLIC_ELFSIGHT_WIDGET_ID` | Elfsight |

## 7.2 Secret env vars

| Proměnná | Účel |
| --- | --- |
| `SANITY_API_READ_TOKEN` | preview / protected queries |
| `SANITY_API_WRITE_TOKEN` | webhook / admin operace |
| `MAILERLITE_API_TOKEN` | server-side newsletter submit, pokud se použije |
| `STRIPE_SECRET_KEY` | Stripe server-side integrace |
| `STRIPE_WEBHOOK_SECRET` | ověření Stripe webhooků |

## 8. Doména a DNS cutover

## 8.1 Pravidlo

Doména zůstává stejná:

- `www.zdravimebavi.cz`

## 8.2 Postup cutoveru

1. dokončit implementaci a QA na Netlify preview / temporary domain
2. provést content freeze v původním Webflow
3. udělat finální migraci obsahu do Sanity production datasetu
4. ověřit build na production branch
5. přepnout DNS na Netlify
6. ověřit SSL, sitemap, robots, canonical, tracking a formuláře

## 8.3 Po cutoveru

Smoke test:

- homepage
- blog
- vybraný článek
- vybraná kategorie
- kontakt
- jedna service page
- jedna checkout page
- search
- 404

## 9. Media pipeline

## 9.1 Pravidla

- obsahové obrázky v Sanity
- hot spot a crop v Sanity
- `next/image` jako render vrstva
- Netlify Image CDN pro výkon a cache

## 9.2 Důležité omezení

Na Free plánu je potřeba hlídat:

- počet image variant
- velikosti hero obrázků
- zbytečné transformace

Proto:

- definovat konečný set variant, ne generovat nekontrolovaně mnoho velikostí
- používat moderní formáty
- u opakovaných komponent sdílet image preset konfigurace

## 10. Content release workflow

## 10.1 Redakční workflow

- editor upraví obsah v Sanity Studio nad datasetem `staging`
- interně se ověří preview
- obsah se publikuje do `production`
- webhook spustí Netlify build

## 10.2 Pro Free plán důležité

- publikaci dávkovat, nevyvolávat zbytečně mnoho rebuildů
- větší obsahové změny dělat v blocích

## 11. QA checklist před launch

## 11.1 Technické

- build je zelený
- Deploy Preview je v pořádku
- production build je v pořádku
- sitemap je správná
- robots je správný
- canonical URL jsou správné
- structured data je validní, pokud se používá

## 11.2 Obsahové

- všechny veřejné stránky mají obsah
- žádná stránka není placeholder
- žádné chybějící obrázky
- členská sekce není nikde veřejně odkazovaná
- všechny CTA na app míří na `https://app.zdravimebavi.cz/`

## 11.3 Integrace

- consent funguje
- analytics fungují
- newsletter funguje
- formuláře fungují
- Wistia a YouTube fungují
- stránky původně napojené na FAPI fungují bez FAPI
- Stripe funguje ve všech checkout a objednávkových flow

## 12. Rollback plán

Rollback má být jednoduchý:

- DNS vrátit na původní hosting
- ponechat původní Webflow web publikovatelný po přechodové období
- nezahazovat export a audit původního webu před potvrzením stability

## 13. Doporučené milníky

1. setup repa, Netlify, Sanity
2. design systém
3. core routes
4. content migration
5. integrations
6. QA
7. cutover

## 14. Reference

Oficiální reference ověřené k 2026-04-09:

- Netlify pricing: [https://www.netlify.com/pricing/](https://www.netlify.com/pricing/)
- Netlify Git workflows: [https://docs.netlify.com/configure-builds/get-started/#git-workflows](https://docs.netlify.com/configure-builds/get-started/#git-workflows)
- Sanity pricing: [https://www.sanity.io/pricing](https://www.sanity.io/pricing)
