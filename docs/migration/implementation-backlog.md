# Implementacni backlog

Datum: 2026-04-09

Tento backlog je ridici TODO seznam pro migraci webu `zdravimebavi.cz`.

Legenda:

- `[x]` hotovo
- `[~]` rozpracovano
- `[ ]` ceka

## 1. Dokumentace a analyza

- [x] technicky audit stareho webu
- [x] crawl verejnych URL
- [x] runtime probe integraci
- [x] UML komponentova mapa
- [x] lokalni snapshot textu a obrazku
- [x] migrační dokumentace pro Next.js + Sanity + Netlify
- [x] rozhodnout scope clenske sekce
- [x] rozhodnout, ze FAPI se nepouzije
- [x] rozhodnout, ze Stripe je cilova checkout vrstva

## 2. Projektove rizeni

- [x] zalozit centralni backlog
- [x] zalozit decision log
- [x] zalozit work log
- [x] zalozit `Agent.md`
- [ ] prubezne aktualizovat backlog podle implementace
- [ ] prubezne zapisovat technicka rozhodnuti
- [ ] prubezne zapisovat implementacni log

## 3. Setup projektu

- [x] zalozit Next.js app
- [~] nastavit TypeScript, linting a formatter
- [x] pripravit strukturu `app/`, `components/`, `features/`, `lib/`, `sanity/`
- [x] zalozit Sanity Studio
- [x] pripravit Sanity Studio workflow v projektu
- [ ] zalozit Netlify site
- [ ] pripojit GitHub private repo
- [x] pripravit `netlify.toml`
- [~] nastavit env vars pro staging a production

## 4. Design system a UI vrstva

- [ ] prevest design tokeny do CSS variables nebo theme vrstvy
- [ ] pripravit typografickou vrstvu Montserrat + Merriweather
- [ ] vytvorit `MarketingLayout`
- [ ] vytvorit `ContentLayout`
- [ ] vytvorit `StandaloneLayout`
- [ ] vytvorit `CheckoutLayout`
- [x] vytvorit `SiteHeader`
- [x] vytvorit `Footer`
- [ ] vytvorit tlacitka, formulare a zakladni obsahove komponenty
- [x] pripravit `CheckoutPanel` pro Stripe flow
- [~] vytvorit interní styleguide / showcase route
- [~] napojit site shell na data-driven snapshot fallback

## 5. Routing a URL parita

- [x] scaffold homepage route
- [x] scaffold blog route
- [x] scaffold article detail route `/clanky/[slug]`
- [x] scaffold category route `/kategorie/[slug]`
- [x] scaffold search route `/search`
- [x] scaffold legal pages
- [x] scaffold service a offer pages
- [x] scaffold custom `404`
- [ ] implementovat legacy query compat parametry
- [ ] overit, ze zadna verejna route neodkazuje na `/pruvodce-pristup/domu`

## 6. Sanity schema a obsahovy model

- [x] `siteSettings`
- [x] `navigation`
- [x] `footer`
- [x] `page`
- [x] `servicePage`
- [x] `offerPage`
- [x] `blogPost`
- [x] `category`
- [x] `legalPage`
- [x] bloky `heroBlock`, `richTextBlock`, `ctaBlock`, `imageBlock`
- [x] bloky `formBlock`, `embedBlock`, `testimonialBlock`, `faqBlock`
- [x] SEO model
- [x] pripravit studio structure
- [ ] doladit editorskou UX ve Studiu
- [ ] rozhodnout, zda se Studio bude embedovat do Next.js route, nebo zustane oddelene

## 7. Migrace obsahu a assetu

 - [x] navrhnout import mapu ze snapshotu do Sanity
- [x] import-ready vygenerovat navigaci a footer
- [x] pripravit import-ready seed pro globalni dokumenty `siteSettings`, `navigation` a `footer`
- [x] pripravit import bundle pro legal stranky
- [x] pripravit import bundle pro staticke a obsahove stranky
- [x] pripravit import bundle pro service a offer pages
- [x] pripravit import bundle pro kategorie
- [x] pripravit import bundle pro clanky
- [x] pripravit asset manifest a hydration workflow pro obrazky
- [x] nahrat obrazky do Sanity
- [ ] doplnit alt texty, kde chybi
- [~] zkontrolovat SEO metadata
- [ ] rucne projit top SEO stranky ve Studiu a doladit title, meta description, hero obrazek a alt text
- [ ] rucne doplnit souvisejici clanky a interni prolinkovani u top 5 az 10 URL ze Search Console

## 8. Integrace

- [ ] consent manager a cookie vrstva
- [ ] GTM / GA4
- [ ] Hotjar
- [ ] Facebook Pixel
- [ ] MailerLite
- [ ] Elfsight
- [ ] Wistia
- [ ] YouTube
- [~] native lead formulare
- [~] Stripe checkout flow
- [ ] Stripe webhook a potvrzovaci stavy
- [ ] GTM/GA4 eventy pro checkout a payment flow

## 9. QA a launch

- [ ] URL parity QA
- [ ] content parity QA
- [ ] visual parity QA
- [ ] mobile QA
- [ ] integracni QA
- [ ] SEO QA
- [ ] overit po launchi Search Console coverage, indexaci a image performance pro top URL
- [ ] smoke test po deploy preview
- [ ] finalni content freeze plan
- [ ] DNS cutover plan
- [ ] post-launch smoke test

## 10. Bezprostredni dalsi kroky

- [x] navrhnout konkretni Stripe architekturu pro 4 puvodne FAPI stranky
- [x] pripravit Next.js implementacni scaffold
- [x] pripravit Sanity schema scaffold
- [x] rozhodnout import strategii ze snapshotu do Sanity
- [~] napojit route na snapshot-backed content rendering
- [~] napojit snapshot-backed metadata a shell na hlavni routy
- [x] pripravit generator globalniho Sanity seed manifestu
- [x] napojit frontend routy na Sanity dokumenty s bezpecnym snapshot fallbackem
- [x] prepnout globalni dokumenty (`siteSettings`, `navigation`, `footer`) na cteni ze Sanity
- [x] pridat on-demand revalidation / webhook flow mezi Sanity a frontendem
- [x] dorovnat SEO metadata a structured data pro hybridni routy `/blog`, `/clanky/[slug]` a `/kategorie/[slug]`
- [x] prepnout hlavni page / servicePage / offerPage / legalPage routy na hybridni Sanity renderer
- [x] overit Stripe price IDs a mapovani `product_key`
- [ ] overit Make scenar a routovani zakazniku podle nakupu
- [ ] overit, zda zustava Base44 webhook v cilove architekture
- [ ] potvrdit spravny MailerLite group ID pro `Konzultace_zdarma`
- [x] vyresit lint / npm dependency problem kolem `fastq`
- [x] sjednotit package manager strategii (`pnpm`)
- [x] implementace Stripe webhooku pro propojení s Make
- [x] napojení odesílání formulářů na Make
- [ ] nastavit Sanity revalidační webhook

