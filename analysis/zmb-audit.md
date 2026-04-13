# Audit webu zdravimebavi.cz

Datum auditu: 2026-04-09

## Co bylo analyzováno

- sitemapa a interní link graph
- statické HTML všech dostupných URL
- normalizované DOM stromy pro každou stránku
- runtime DOM a načítané skripty přes Playwright CLI na reprezentativních šablonách
- formuláře, embedy, tracking a checkout závislosti

## Rychlý souhrn

- Web běží na Webflow.
- Crawl objevil 51 interních URL.
- 50 URL je veřejně dostupných.
- 1 URL je chráněná a vrací `401 Unauthorized`: `/pruvodce-pristup/domu`.
- Bylo identifikováno 26 unikátních `data-wf-page` šablon/stránek.
- Největší opakující se Webflow šablony:
  - články: 19 URL na jedné CMS šabloně
  - kategorie: 6 URL na jedné CMS šabloně
- Vedle Webflow HTML se runtime načítají i další integrace: GTM/GA4, Hotjar, Facebook Pixel, Cookie Script, MailerLite, Elfsight, Wistia, FAPI, Stripe a na jedné stránce YouTube.

## Inventář URL

| Typ stránky | Počet | Poznámka |
| --- | ---: | --- |
| Homepage | 1 | hlavní landing + feed obsahu + CTA |
| Blog index | 1 | listing článků + kategorie + pagination |
| Article detail | 19 | CMS kolekce `/clanky/[slug]` |
| Category detail | 6 | CMS kolekce `/kategorie/[slug]` |
| Service landing | 6 | prodejní a službové landingy |
| Content page | 7 | obsahové/lead pages mimo blog |
| Conversion form | 3 | samostatné objednávkové/form pages |
| Legal | 4 | GDPR, cookies, obchodní podmínky, odpovědnost |
| Search | 1 | Webflow search výsledky |
| Calendar | 1 | standalone landing s email capture |
| 404 | 1 | vlastní error page |

## Důležité URL mimo standardní sitemapu

- veřejná skrytá stránka: `/formular---pruvodce-vyzivou-a-pohybem`
- chráněná členská sekce: `/pruvodce-pristup/domu` -> `401 Unauthorized`

To znamená, že starý web obsahuje i chráněný vstup do členské části. V cílové migraci ale tato část není součástí scope a veřejný web má místo ní odkazovat na externí app.

## Hlavní layouty

### 1. Standardní marketing shell

Používá jej homepage, blog, články, většina službových stránek, kontakt a 404.

Společné znaky:

- navbar `div.navbar.w-nav`
- CTA v navigaci na členskou sekci
- footer `section.footer-subscribe`
- legal odkazy a social linky
- tracking vrstva načítaná globálně

Typický příklad DOM:

```text
- body.body-2
  - div.w-embed
  - div.dd_shadow
  - div.navbar.w-nav
    - div.container-2.w-container
      - a.brand.w-nav-brand [href="/"]
      - nav.nav-menu.w-nav-menu
        - a.link-block.w-inline-block [href="/o-mne"]
        - a.link-block.w-inline-block [href="/blog"]
        - a.link-block.w-inline-block [href="/e-book-jak-sestavit-jidelnicek"]
        - a.link-block.w-inline-block [href="/pruvodce"]
        - a.button-2.w-button [href="/pruvodce-pristup/domu", text="Členská sekce"]
  - ...
  - section.footer-subscribe
```

Plný strom: `analysis/dom-trees/home.txt`

### 2. CMS obsahový layout

Používá jej blog index, detail článku a detail kategorie.

#### Blog index

- kategorie jako CMS filter chips
- listing článků z `w-dyn-list`
- pagination přes query parametr typu `?9cdf212f_page=2`
- homepage má podobný listingový pattern a také používá query-based pagination (`?d2e85baa_page=2`)

Plný strom: `analysis/dom-trees/blog.txt`

#### Detail článku

Jedna sdílená CMS šablona pro 19 článků.

Společné bloky:

- název článku
- labely/kategorie
- datum
- `w-richtext`
- sekce "Nutriční hodnoty"
- sekce "Ingredience"
- sekce "Jak na to?"
- galerie / lightbox

Typický výřez DOM:

```text
- body.body
  - div.navbar.w-nav
  - div.section
    - div.container.cc-blog-detail
      - div.blog-detail-header-wrap
      - div.rich-text.w-richtext
      - div.blog-detail-header-wrap_2
      - div.blog-detail-header-wrap_2
      - div.rich-text.w-richtext
      - h2.heading-14
      - div.w-dyn-list
        - div.collection-list-10.w-dyn-items
          - div.collection-item-8.w-dyn-item.w-dyn-repeater-item
            - a.w-inline-block.w-lightbox [href="#"]
```

Plný strom: `analysis/dom-trees/clanky__arasidova-omacka.txt`

#### Detail kategorie

- jedna sdílená CMS šablona pro 6 kategorií
- název kategorie
- znovu listing kategorií jako chips
- listing článků filtrovaných podle kategorie
- pagination přes query parametr typu `?b0ee97b8_page=2`

Plný strom: `analysis/dom-trees/kategorie__sladke.txt`

### 3. Standalone landing / offer layout

Používá jej například:

- `/pruvodce`
- `/e-book-jak-sestavit-jidelnicek`
- `/osobni-konzultace`
- `/letni-prazdninova-vyzva`
- `/kalendar`
- `/formular---pruvodce-vyzivou-a-pohybem`

Typické znaky:

- často bez hlavní navbar navigace
- silně custom sekce
- větší reliance na embedované formuláře a CTA
- někdy chybí standardní footer

Příklad DOM pro FAPI/checkout landing:

```text
- body.body-10-copy
  - section#Web_KontaktniFormular_pruvodce.section-9-copy
    - h2.heading-11.heading-jumbo-small
    - div.div-block-70
      - div.w-layout-grid.grid-26
        - div
          - div.w-embed.w-script
        - div
          - h2.heading-jumbo-small
          - img.image-64_recenze
          - ...
```

Plný strom: `analysis/dom-trees/formular---pruvodce-vyzivou-a-pohybem.txt`

## Formuláře a lead capture

### Webflow formuláře

Byly nalezeny minimálně tyto nativní Webflow formy:

- `/napis-mi`
  - `wf-form-Get-In-Touch-Form`
  - pole: `name`, `Email`, `Message`
- `/konzultace-zdarma`
  - `wf-form-Konzultace_zdarma`
  - pole: jméno, email, zpráva, souhlas s OP, souhlas GDPR
- `/individualni-treninky-benatky-nad-jizerou-a-okoli`
  - `wf-form-Individualni_treninky`
- `/skupinove-lekce-benatky-nad-jizerou`
  - `wf-form-Skupinove_lekce-2`
- `/cviceni-v-benatkach-nad-jizerou`
  - `wf-form-Skupinove_lekce-2`
  - runtime vrací `method="get"`, což je nekonzistentní a je potřeba to při přepisu ověřit
- `/osobni-konzultace`
  - `wf-form-Osobni_konzultace`

### MailerLite formuláře

Runtime sonda našla formuláře, které ve statickém HTML nejsou zjevné:

- homepage
  - POST na MailerLite subscribe endpoint
- `/kalendar`
  - POST na MailerLite subscribe endpoint

Tyto formuláře je dobré modelovat jako samostatný "lead capture" blok, ne jako běžný kontaktní formulář.

### FAPI + Stripe formuláře / checkout

Runtime sonda potvrdila FAPI a Stripe integrace:

- `/osobni-konzultace`
  - kromě Webflow formuláře se načítá i FAPI order form
  - Stripe iframe je součástí checkout flow
- `/formular---pruvodce-vyzivou-a-pohybem`
  - FAPI form s 18 poli
  - Stripe iframe
- `/osobni-konzultace-objednavka`
  - statický crawl ukazuje FAPI embed
- `/e-book-jak-sestavit-jidelnicek`
  - statický crawl ukazuje FAPI embed

Z pohledu migrace je to nejdůležitější integrační vrstva mimo samotný obsah.

## Media a 3rd-party integrace

### Globálně nebo velmi často načítané

- Google Tag Manager / GA4
- Hotjar
- Facebook Pixel
- Cookie Script
- Webflow runtime JS/CSS

### Na vybraných stránkách

- MailerLite
  - homepage
  - kalendář
- Elfsight
  - homepage
  - blog
- Wistia
  - `/cviceni-v-benatkach-nad-jizerou`
  - `/skupinove-lekce-benatky-nad-jizerou`
- YouTube
  - `/letni-prazdninova-vyzva`
- FAPI
  - objednávkové a lead magnet stránky
- Stripe
  - checkout/order stránky přes FAPI

## Search, pagination a utility flows

- Search je vlastní Webflow search stránka `/search`.
- Search DOM je minimalistický:

```text
- body
  - div.w-container
    - h1
    - form.w-form [action="/search"]
      - label [text="Search"]
      - input#search.w-input [type="search", name="query"]
      - input.w-button [type="submit"]
```

- Blog i kategorie používají query-based pagination.
- 404 je samostatná stránka s vlastní šablonou.

## Co to znamená pro přepis do Next.js + Sanity + Netlify

### Minimální layout vrstva v Next.js

Potřebuješ minimálně tyto layouty:

- `MarketingLayout`
  - navbar
  - footer
  - SEO / tracking hooks
- `ContentLayout`
  - blog
  - článek
  - kategorie
- `StandaloneLayout`
  - kampaně
  - výzvy
  - kalendář
  - lead magnet pages
- `CheckoutLayout`
  - objednávka
  - nativní checkout nebo konverzní formulář
  - Stripe checkout vrstva

### Doporučené content modely v Sanity

- `siteSettings`
  - tracking IDs
  - global scripts
  - brand assets
- `navigation`
  - hlavní menu
  - CTA
  - external app link
- `footer`
  - legal linky
  - social linky
- `page`
  - flexibilní blokový builder pro statické a obsahové stránky
- `servicePage`
  - službové landingy
  - CTA
  - ceníky
  - FAQ
  - testimonials
- `offerPage`
  - standalone sales pages a lead magnety
- `blogPost`
  - SEO
  - hero
  - portable text
  - recipe/nutrition sekce
  - galerie
  - související kategorie
- `category`
  - label, slug, SEO
- `formBlock`
  - webflow-like contact form
  - MailerLite signup
  - provider-specific fallback
- `embedBlock`
  - Wistia
  - YouTube
  - Elfsight
- `testimonial`
- `faq`
- `legalPage`

### Rozhodnutí, která mají být na začátku potvrzená

- současné FAPI flow se do nového řešení nepřenáší a placené flow se přesouvá do Stripe
- členská sekce `/pruvodce-pristup/domu` se nepřevádí a veřejný web má odkazovat na `https://app.zdravimebavi.cz/`
- zda search řešit čistě přes Sanity query, nebo přes dedikovaný index
- jestli zachovat MailerLite a Elfsight, nebo je odstranit a nahradit vlastním UI

## Doporučené migrační priority

1. Rozdělit stránky do layout families a potvrdit, které zůstanou standalone.
2. Navrhnout Sanity schémata pro `navigation`, `footer`, `page`, `servicePage`, `blogPost`, `category`, `formBlock`.
3. Vyjmout a znovu navrhnout formulářovou strategii.
4. Navrhnout Stripe náhradu pro současné FAPI stránky.
5. Přepsat blog/kategorie/search/404 jako core routy v Next.js.
6. Až potom migrovat jednotlivé prodejní landingy.

## Výstupy auditu

- JSON crawl: `analysis/site-crawl.json`
- runtime sonda: `analysis/runtime/runtime-probe.json`
- raw HTML snapshoty: `analysis/raw-html/`
- DOM trees: `analysis/dom-trees/`
- UML diagram: `analysis/zmb-architecture.puml`
