# Integrační dokumentace

Datum: 2026-04-09

Tento dokument popisuje, jaké integrace aktuální web používá, kde se vyskytují, k čemu slouží a jak je přenést do nového řešení.

## 1. Integrační principy

- integrace načítat modulárně, ne globálně bez rozlišení
- vše respektovat přes consent vrstvu
- veřejné identifikátory lze držet v `siteSettings` nebo public env vars
- tajné klíče držet jen v Netlify env vars
- page-specific integrace lazy-loadovat až na stránkách, kde jsou potřeba

## 2. Přehled integrací

| Integrace | Aktuální stav | Kde se používá | Účel | Nový přístup |
| --- | --- | --- | --- | --- |
| GTM / GA4 | aktivní | globálně | analytics a eventy | zavést znovu přes consent-aware loader |
| Hotjar | aktivní | globálně | behavior analytics | lazy-load po analytics consent |
| Facebook Pixel | aktivní | globálně | marketing měření | lazy-load po marketing consent |
| Cookie Script | aktivní | globálně | cookie consent | ponechat nebo nahradit, ale funkčně zachovat |
| MailerLite | aktivní | homepage, kalendář; script se načítá globálně | email capture | převést do `NewsletterForm` |
| Elfsight | aktivní | homepage, blog | social / widget embed | page-specific lazy load |
| Wistia | aktivní | dvě service pages | video embed | `VideoEmbed` komponenta |
| YouTube | aktivní | letní výzva | video embed | `VideoEmbed` komponenta |
| FAPI | aktivní na starém webu | e-book, průvodce form, osobní konzultace objednávka, mixed na osobní konzultaci | legacy checkout / form embed | do nového webu nepřenášet, použít jen jako migrační referenci |
| Stripe | aktivní | checkout flow přes FAPI | platba | oddělit od FAPI a použít jako cílovou checkout vrstvu |

## 3. Globální integrace

## 3.1 Cookie Script

### Současné použití

- načítá se globálně
- spravuje consent banner

### Účel

- právní vrstva souhlasu
- gating pro analytics a marketing

### Nový přístup

- načíst jako první nepovinnou 3rd-party vrstvu
- vše ostatní spouštět až po odpovídajícím consentu
- identifikátor skriptu držet v public configu

### Poznámka

Pokud se zvolí jiný consent manager, musí být zachována minimálně stejná právní a technická funkce. Název nástroje se změnit může, ale consent logika ne.

## 3.2 GTM / GA4

### Současné použití

- globálně
- součást runtime skriptů

### Účel

- page view tracking
- event tracking
- návaznost na marketing a měření výkonu

### Nový přístup

- zavést jako samostatný analytický modul
- spouštět po analytics consentu
- mít jasný event naming convention

### Doporučené eventy

- `cta_click`
- `form_submit`
- `newsletter_submit`
- `video_play`
- `external_app_click`
- `checkout_open`

## 3.3 Hotjar

### Současné použití

- globálně

### Účel

- heatmapy
- session recordings
- behavior analytics

### Nový přístup

- spouštět až po analytics consentu
- lazy-loadovat až po initial renderu

## 3.4 Facebook Pixel

### Současné použití

- globálně

### Účel

- marketing atribuční vrstva
- remarketing

### Nový přístup

- spouštět až po marketing consentu
- eventy navázat na CTA, leady a checkout flow

## 4. Lead capture a newsletter

## 4.1 MailerLite

### Současné použití

- homepage: aktivní subscribe form
- kalendář: aktivní subscribe form
- globálně se načítá i související script

### Účel

- sběr emailů
- newsletter / automatizace

### Nový přístup

Varianty implementace:

- Varianta A: dál používat přímý MailerLite embed
- Varianta B: použít vlastní `NewsletterForm` + server-side submit přes Netlify Function / API route

Doporučení:

- pro lepší kontrolu UX použít vlastní formulář
- public form metadata držet v Sanity
- tajné API klíče jen v Netlify env vars

### Kde musí být znovu zapojeno

- homepage
- `/kalendar`

## 5. Social a widgety

## 5.1 Elfsight

### Současné použití

- homepage
- blog

### Účel

- widget / social proof / embed feed

### Nový přístup

- načítat jen na stránkách, kde je widget skutečně zobrazen
- oddělit do `EmbedBlock`
- umožnit úplné vypnutí přes content config

## 6. Video integrace

## 6.1 Wistia

### Současné použití

- `/cviceni-v-benatkach-nad-jizerou`
- `/skupinove-lekce-benatky-nad-jizerou`

### Účel

- prodejní / vysvětlující video

### Nový přístup

- vytvořit komponentu `VideoEmbed`
- podporovat Wistia media ID a volitelné poster/placeholder renderování
- lazy-loadovat player až při interakci nebo ve viewportu

## 6.2 YouTube

### Současné použití

- `/letni-prazdninova-vyzva`

### Účel

- cvičební / obsahové video

### Nový přístup

- přes stejnou komponentu `VideoEmbed`
- preferovat privacy-friendly embed variantu, pokud to bude kompatibilní s obsahem

## 7. Formuláře a checkout

## 7.1 Webflow formuláře

### Současné použití

Nativní formuláře dnes existují minimálně zde:

- `/napis-mi`
- `/konzultace-zdarma`
- `/individualni-treninky-benatky-nad-jizerou-a-okoli`
- `/cviceni-v-benatkach-nad-jizerou`
- `/skupinove-lekce-benatky-nad-jizerou`
- `/osobni-konzultace`

### Účel

- kontaktní formuláře
- lead capture
- službové poptávky

### Nový přístup

- všechny nativní formuláře převést na vlastní komponenty
- odeslání řešit přes provider podle typu formuláře
- formulářové texty, labely, success/error messages držet v Sanity

## 7.2 FAPI

### Současné použití na starém webu

Potvrzené použití:

- `/osobni-konzultace`
- `/osobni-konzultace-objednavka`
- `/e-book-jak-sestavit-jidelnicek`
- `/formular---pruvodce-vyzivou-a-pohybem`

### Účel

- objednávkový formulář
- checkout
- lead / prodejní flow

### Nový přístup

- FAPI nepřenášet do nového webu
- stránky, které dnes používají FAPI, přepsat na vlastní formulářové a checkout komponenty
- placené a objednávkové flow převést do Stripe
- neplacené lead a intake formuláře převést do nativních Next.js komponent
- žádné FAPI skripty, embed ID ani neveřejné tokeny neplánovat do cílové architektury

### Důležitá poznámka

FAPI přináší do stránky i další runtime závislosti, včetně Stripe iframe a doprovodných skriptů. Pro migraci je potřeba je chápat jako součást současného stavu, ne jako součást cílového řešení.

## 7.3 Stripe

### Současné použití

- objevuje se v checkout flow na FAPI stránkách

### Účel

- platební vrstva

### Nový přístup

- Stripe se v novém řešení nesmí vázat na FAPI
- Stripe je cílová náhrada FAPI pro objednávkové a placené flow
- Stripe dostane vlastní integrační vrstvu a server-side secret management
- na kazde puvodne FAPI strance bude Stripe vazba na konkretni produkt nebo sluzbu
- po uspesne platbe navazuje automatizace v Make podle zakoupeneho produktu
- z aktualniho blueprintu vyplyva, ze routing dnes pouziva `object.metadata.products`
- pro prvni verzi je akceptovatelne nechat completion stav na Stripe success page
- checkout a payment eventy se mají měřit přes GTM / GA4

## 8. Mapa integrací podle stránek

| URL / rodina | Integrace |
| --- | --- |
| homepage `/` | Cookie Script, GTM/GA4, Hotjar, Facebook Pixel, MailerLite, Elfsight |
| `/blog` | Cookie Script, GTM/GA4, Hotjar, Facebook Pixel, Elfsight |
| články `/clanky/[slug]` | Cookie Script, GTM/GA4, Hotjar, Facebook Pixel |
| kategorie `/kategorie/[slug]` | Cookie Script, GTM/GA4, Hotjar, Facebook Pixel |
| `/cviceni-v-benatkach-nad-jizerou` | Cookie Script, GTM/GA4, Hotjar, Facebook Pixel, Wistia, lead form |
| `/skupinove-lekce-benatky-nad-jizerou` | Cookie Script, GTM/GA4, Hotjar, Facebook Pixel, Wistia, lead form |
| `/napis-mi` | Cookie Script, GTM/GA4, Hotjar, Facebook Pixel, contact form |
| `/konzultace-zdarma` | Cookie Script, GTM/GA4, Hotjar, Facebook Pixel, lead form |
| `/osobni-konzultace` | Cookie Script, GTM/GA4, Hotjar, Facebook Pixel, consultation form, Stripe handoff |
| `/osobni-konzultace-objednavka` | Cookie Script, GTM/GA4, Hotjar, Facebook Pixel, Stripe checkout |
| `/e-book-jak-sestavit-jidelnicek` | Cookie Script, GTM/GA4, Hotjar, Facebook Pixel, Stripe order flow |
| `/formular---pruvodce-vyzivou-a-pohybem` | Cookie Script, GTM/GA4, Hotjar, Facebook Pixel, native intake form, Stripe checkout |
| `/letni-prazdninova-vyzva` | Cookie Script, GTM/GA4, Hotjar, Facebook Pixel, YouTube |
| `/kalendar` | Cookie Script, GTM/GA4, Hotjar, Facebook Pixel, MailerLite |

## 9. Konfigurace a bezpečnost

## 9.1 Co může být public

- GTM container ID
- GA4 measurement ID
- Hotjar site ID
- Meta Pixel ID
- Cookie Script ID
- Elfsight widget ID
- Wistia media ID
- YouTube video ID

## 9.2 Co nesmí být v Sanity datasetu

- MailerLite secret token
- Stripe secret key
- Stripe webhook secret
- jakékoli server-side API klíče

## 9.3 Kde držet tajemství

- Netlify environment variables

## 9.4 Co ověřit mimo aplikaci

- existenci Stripe produktu a price ID pro kazdou dotcenou stranku
- Make scenar pro post-payment automatizaci
- mapovani produktu nebo `product_key` na cilove skupiny v Make
- jestli zustava soucasti flow i externi Base44 webhook
- spravny MailerLite group ID pro `Konzultace_zdarma`

## 10. QA checklist pro integrace

- consent banner blokuje analytics a marketing skripty do udělení souhlasu
- GTM a GA4 měří page view a CTA click
- Hotjar běží jen po povolení analytics
- Facebook Pixel běží jen po povolení marketingu
- MailerLite formuláře fungují na homepage a kalendáři
- Elfsight se načítá jen tam, kde má být
- Wistia videa fungují na obou service pages
- YouTube embed funguje na letní výzvě
- stránky původně závislé na FAPI fungují bez FAPI skriptů
- Stripe checkout a navazující potvrzovací flow fungují na všech dotčených stránkách
- Make automatizace po zaplaceni spravne rozdeli zakazniky podle produktu
- newsletter a zajmove formulare se zapisují do spravnych MailerLite skupin podle `form_key`
