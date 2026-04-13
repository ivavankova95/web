# Dokumentace migrace webu zdravimebavi.cz

Datum: 2026-04-09

Tento dokument je hlavní specifikace pro přechod současného webu `https://www.zdravimebavi.cz/` na nové řešení postavené na Next.js, Sanity a Netlify při zachování stejné domény, stejných veřejných URL a stejného obsahu.

Editace obsahu v cílovém řešení se má dělat přes Sanity Studio, ne přes přímé zásahy do kódu nebo přes alternativní admin rozhraní.

## 1. Cíl migrace

Cílem je postavit nový veřejný web se stejnou informační architekturou a stejnými veřejnými URL, ale na novém stacku:

- frontend: Next.js
- hosting: Netlify Free
- CMS: Sanity Free
- editor: Sanity Studio
- média: Sanity CDN + Netlify Image CDN
- repozitář: GitHub Private repo
- deployment: automatický z GitHubu
- doména: zůstává `www.zdravimebavi.cz`

## 2. Hlavní pravidla projektu

### 2.1 Co se musí zachovat

- stejné veřejné URL adresy
- stejný nebo obsahově ekvivalentní obsah
- stejný vizuální styl a brand feeling
- stejné klíčové integrační body
- stejné SEO vstupy: titles, meta descriptions, canonical, OG/Twitter metadata, sitemap, robots

### 2.2 Co se mění

- Webflow se nahrazuje za Next.js + Sanity
- redakční rozhraní nového webu bude Sanity Studio jako součást projektu a content workflow
- členská sekce se nepřevádí
- původní interní CTA do členské sekce se nahradí externím odkazem na `https://app.zdravimebavi.cz/`
- FAPI se v novém řešení nebude používat
- současné FAPI flow se nahradí kombinací nativních Next.js formulářů a Stripe checkoutu
- formuláře a integrace se mohou implementovat nově, ale musí být zdokumentované a otestované

### 2.3 Co je mimo scope

- migrace chráněné členské části `/pruvodce-pristup/domu`
- refaktor brandu nebo redesign do nového vizuálního směru
- změna URL struktury
- zavádění přesměrování pro veřejné stránky, které zůstávají beze změny

## 3. Výchozí stav

Na základě technického auditu:

- web běží na Webflow
- bylo nalezeno 51 interních URL
- 50 URL je veřejných
- 1 URL je chráněná a vrací `401`: `/pruvodce-pristup/domu`
- hlavní opakovatelné šablony:
  - 19 článků na jedné CMS šabloně
  - 6 kategorií na jedné CMS šabloně
  - několik standalone landingů a objednávkových stránek mimo hlavní shell

Detaily jsou v:

- `analysis/zmb-audit.md`
- `analysis/site-crawl.json`
- `analysis/runtime/runtime-probe.json`
- `analysis/zmb-architecture.puml`

## 4. Cílová architektura

## 4.1 Architektonické principy

- static-first přístup kvůli Netlify Free limitům
- veřejný obsah renderovat build-time nebo ISR-style revalidací přes webhook, ne přes runtime SSR na každé request
- URL parita má vyšší prioritu než interní technické zjednodušení
- integrace načítat jen tam, kde jsou opravdu potřeba
- design systém postavit jako znovupoužitelnou vrstvu, ne jako přepis hotových HTML bloků 1:1
- všechny citlivé klíče držet mimo Sanity dataset, pouze v Netlify env vars

## 4.2 Doporučené layouty

- `MarketingLayout`
  - homepage
  - blog
  - články
  - většina službových stránek
  - kontakt
  - legal
  - 404
- `ContentLayout`
  - blog index
  - detail článku
  - detail kategorie
  - search
- `StandaloneLayout`
  - prodejní landingy
  - lead magnety
  - výzvy
  - kalendář
- `CheckoutLayout`
  - objednávkové a konverzní flow

## 4.3 Doporučená struktura repozitáře

Pro Free plán je vhodná jednoduchá struktura v jednom repozitáři:

```text
/
  app/
  components/
  features/
  lib/
    sanity/
    seo/
    analytics/
    forms/
    media/
  public/
  styles/
  sanity/
    schemas/
    structure/
  docs/
    migration/
  netlify.toml
  next.config.ts
  sanity.config.ts
```

## 5. Provozní omezení cílového stacku

## 5.1 Netlify Free

Tato migrace počítá s provozem na Netlify Free, takže architektura musí být úsporná:

- minimalizovat Netlify Functions a SSR
- minimalizovat počet buildů
- používat Deploy Previews a branch deploys jen tam, kde to dává smysl
- optimalizovat obrázky, protože Image CDN i bandwidth se promítají do usage

Ověřené plánové reference k 2026-04-09:

- Netlify pricing: [netlify.com/pricing](https://www.netlify.com/pricing/)

Poznámka k GitHub private repo:

- pokud bude repozitář soukromý v osobním GitHub účtu, drží se tento návrh
- pokud bude repozitář soukromý v GitHub Organization, je potřeba ověřit kompatibilitu s Free plánem před implementací Git-based deploye; fallback je GitHub Actions + Netlify deploy hook / CLI

## 5.2 Sanity Free

Tato migrace počítá s veřejným webem, takže Free plán je použitelný, ale má dopad na návrh:

- pouze 2 datasety
- datasety jsou public-only
- omezené role
- limity na dokumenty, requests a média

To znamená:

- nepoužívat Sanity pro ukládání citlivých dat nebo neveřejných konfiguračních tajemství
- počítat s datasety `staging` a `production`
- držet obsahový model jednoduchý a bez zbytečné dokumentové fragmentace
- pokud bude potřeba jemnější redakční oprávnění než admin/viewer, Free plán nebude stačit a bude potřeba upgrade

Ověřené reference k 2026-04-09:

- Sanity pricing: [sanity.io/pricing](https://www.sanity.io/pricing)

## 6. URL a obsahová parita

URL parita je základní akceptační podmínka:

- všechny veřejné URL zůstanou stejné
- všechny slugs zůstanou stejné
- search zůstane na `/search`
- blog zůstane na `/blog`
- články zůstanou na `/clanky/[slug]`
- kategorie zůstanou na `/kategorie/[slug]`

Pozor na query compat vrstvu:

- homepage používá legacy query parametr `d2e85baa_page`
- blog používá `9cdf212f_page`
- kategorie používají `b0ee97b8_page`
- search používá `query`

Tyto parametry je potřeba na novém webu dál podporovat, i kdyby interní stránkování používalo jinou logiku.

Detailní mapa URL je v:

- `docs/migration/url-parity.md`

## 7. Změna členské sekce

Členská sekce se nepřevádí.

Pravidla:

- v hlavní navigaci a ve všech CTA se původní odkaz na členskou sekci nahradí `https://app.zdravimebavi.cz/`
- route `/pruvodce-pristup/domu` není součástí parity scope
- tato URL nesmí zůstat jako aktivní interní link nikde ve veřejné části nového webu
- route se nemá objevovat v nové sitemapě

## 8. Obsahový model v Sanity

Sanity je v tomto projektu nejen content lake, ale i hlavní editorské rozhraní. To znamená:

- editace stránek, navigace, footeru, legal textů a SEO se má dělat přes Sanity Studio
- Studio je součást stejného repozitáře přes `sanity.config.ts`, `sanity.cli.ts` a schema layer
- pro aktuální scaffold se s editací počítá přes Sanity Studio workflow, ne přes přímé zásahy do kódu
- při návrhu schémat a dokumentů je potřeba vždy myslet na editorskou použitelnost, ne jen na frontend render

## 8.1 Minimální typy dokumentů

- `siteSettings`
- `navigation`
- `footer`
- `page`
- `servicePage`
- `offerPage`
- `blogPost`
- `category`
- `legalPage`
- `testimonial`
- `faq`

## 8.2 Minimální typy bloků / objektů

- `heroBlock`
- `richTextBlock`
- `ctaBlock`
- `imageBlock`
- `galleryBlock`
- `formBlock`
- `embedBlock`
- `testimonialBlock`
- `faqBlock`
- `featureGridBlock`
- `metricsBlock`
- `nutritionBlock`
- `seo`

## 8.3 Modelační pravidla

- články musí mít samostatný model `blogPost`
- kategorie musí být samostatné dokumenty kvůli listingu a filtraci
- landingy s rozdílnou skladbou bloků se mají modelovat přes blokový builder
- formuláře nesmí být hardcoded v page šablonách, ale přes `formBlock`
- externí integrace musí být reprezentovatelné přes `embedBlock` nebo přes central config v `siteSettings`

## 9. Obrazová strategie

## 9.1 Zdroj pravdy

- originální assety se ukládají do Sanity asset pipeline
- obsahové dokumenty v Sanity ukládají reference na assety

## 9.2 Delivery strategie

- Sanity řeší asset storage, crop, hotspot a základní image metadata
- Next.js používá optimalizované image komponenty
- Netlify Image CDN slouží jako delivery/cache vrstva pro produkční výstup

## 9.3 Praktická pravidla

- hero a content image neukládat do repozitáře, ale do Sanity
- malé statické assety typu favicon, manifest, základní loga a ikonky je možné držet v `public/`
- nepoužívat dvojité resize řetězení bez kontroly
- Sanity má řídit crop/hotspot
- Netlify má řídit finální delivery a varianty podle viewportu
- všechny obrázky musí mít alt text

## 10. Integrace

Migrovat se mají tyto integrace:

- GTM / GA4
- Hotjar
- Facebook Pixel
- Cookie Script
- MailerLite
- Elfsight
- Wistia
- YouTube
- Stripe

Podrobná dokumentace integrací je v:

- `docs/migration/integrations.md`

## 11. Design systém

Nový web musí zachovat vizuální styl současného webu, ale převést ho do udržitelného UI systému.

Detailní design systém je v:

- `docs/migration/design-system.md`

Základní principy:

- zachovat warm / editorial / approachable brand feeling
- zachovat hlavní fontové duo Montserrat + Merriweather
- zachovat brand akcent `#a84163`
- zachovat světlé krémové pozadí a měkké rounded CTA
- rozpadnout současné jednorázové bloky na opakovatelné komponenty

## 12. Deployment a DevOps

Detailní provozní dokument je v:

- `docs/migration/deployment-and-operations.md`

Klíčová pravidla:

- `main` branch = production deploy
- PR = Deploy Preview
- `staging` dataset = obsah pro preview / test
- `production` dataset = live obsah
- obsah publikuje Sanity, ale build orchestrace běží přes GitHub + Netlify

## 13. Migrační fáze

### Fáze 1. Základ projektu

- založit GitHub private repo
- založit Next.js projekt
- založit Sanity Studio a schémata
- založit Netlify site a připojit repo
- připravit env vars

### Fáze 2. Design systém a layouty

- převést brand tokeny
- vytvořit layouty
- vytvořit základní UI komponenty
- vytvořit route shell pro homepage, blog, article, category, legal, 404, search

### Fáze 3. Obsahová migrace

- import kategorií
- import článků
- import stránek
- import SEO metadat
- import médií

### Fáze 4. Integrace

- consent layer
- analytics
- formuláře
- video embedy
- nativní lead flow
- Stripe checkout flow

### Fáze 5. QA a parity kontrola

- URL parity
- content parity
- visual parity
- tracking parity
- form parity
- mobile parity

### Fáze 6. Cutover

- content freeze
- poslední synchronizace obsahu
- DNS cutover na Netlify
- post-launch smoke test

## 14. Akceptační kritéria

Migrace je hotová, pokud platí všechno níže:

- všechny veřejné URL fungují bez redirectů
- obsah odpovídá současnému webu
- navigace už neobsahuje interní odkaz na členskou sekci a používá `https://app.zdravimebavi.cz/`
- články, kategorie, legal stránky, homepage, service pages a conversion pages jsou dostupné
- design systém je implementovaný a použitý konzistentně
- GTM/GA4, Hotjar, Facebook Pixel, Cookie Script, MailerLite, Elfsight, Wistia, YouTube a Stripe jsou zdokumentované, znovu zapojené a otestované tam, kde mají být
- build, preview a production deploy běží přes GitHub + Netlify
- doména `www.zdravimebavi.cz` ukazuje na nový web

## 15. Rizika a mitigace

### Riziko: Free plán Netlify

Mitigace:

- static-first architektura
- omezit runtime compute
- šetřit image transformace
- držet preview provoz pod kontrolou

### Riziko: Free plán Sanity

Mitigace:

- jen 2 datasety: `staging` + `production`
- jednoduché schéma bez nadbytečných dokumentů
- citlivé klíče neukládat do datasetu

### Riziko: parita query parametrů

Mitigace:

- explicitně podporovat legacy Webflow pagination params
- zahrnout do QA smoke testu

### Riziko: externí checkout flow

Mitigace:

- současné FAPI flow zdokumentovat jako legacy stav a nepřenášet ho do cílové architektury
- nové formuláře navrhnout nativně v Next.js
- Stripe navrhnout jako cílovou platební a checkout vrstvu

## 16. Související dokumenty

- Operativní manuál: `Agent.md`
- Implementační backlog: `docs/migration/implementation-backlog.md`
- Decision log: `docs/migration/decision-log.md`
- Work log: `docs/migration/work-log.md`
- Error log: `docs/migration/error-log.md`
- Make automation map: `docs/migration/make-automation-map.md`
- Stripe flow specification: `docs/migration/stripe-flow-spec.md`
- Implementation scaffold: `docs/migration/implementation-scaffold.md`
- Import strategie: `docs/migration/import-strategy.md`
- Lokální snapshot obsahu: `docs/migration/content-snapshot.md`
- URL parita: `docs/migration/url-parity.md`
- Design systém: `docs/migration/design-system.md`
- Integrace: `docs/migration/integrations.md`
- Deployment a provoz: `docs/migration/deployment-and-operations.md`
- Audit současného webu: `analysis/zmb-audit.md`
- UML: `analysis/zmb-architecture.puml`
