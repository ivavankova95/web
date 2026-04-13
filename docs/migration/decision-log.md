# Decision log

Datum zalozeni: 2026-04-09

Tento soubor drzi architektonicka, produktova a provozni rozhodnuti projektu.

## Aktivni rozhodnuti

### 2026-04-09 - Cílový stack

- rozhodnuti: novy web poběží na Next.js + Sanity Free + Netlify Free
- duvod: odpovida zadani a umoznuje moderni content workflow s relativne jednoduchym provozem
- dopad: architektura musi byt static-first a setrna k buildum, funkcim a image transformacim

### 2026-04-11 - Editorské rozhraní

- rozhodnuti: editace obsahu bude probihat pres Sanity Studio jako soucast projektu a content workflow
- duvod: bylo explicitne upresneno zadanim a odpovida to cilovemu content workflow
- dopad: schema, globalni dokumenty, page builder i deployment workflow musi pocitat s editorskou praci pres Studio

### 2026-04-09 - URL parita

- rozhodnuti: verejne URL zustanou stejne
- duvod: nechceme resit redirect migraci a SEO ztraty
- dopad: route model a content model se musi prizpusobit existujicim slugum a query parametrum

### 2026-04-09 - Doména

- rozhodnuti: domena zustava `www.zdravimebavi.cz`
- duvod: kontinuita brandu a SEO
- dopad: launch vyzaduje cisty DNS cutover a parity QA

### 2026-04-09 - Členská sekce

- rozhodnuti: clenska sekce se neprevadi
- duvod: neni soucasti noveho scope
- dopad: vsechny verejne CTA maji smerovat na `https://app.zdravimebavi.cz/`

### 2026-04-09 - Checkout provider

- rozhodnuti: FAPI se rusí a cilova nahrada je Stripe
- duvod: bylo explicitne potvrzeno zadanim
- dopad: FAPI zustava pouze jako legacy reference stareho webu, nova implementace musi mit nativni formulare a Stripe checkout flow

### 2026-04-11 - Stripe page model

- rozhodnuti: na puvodne FAPI strankach bude vzdy Stripe formular nebo Stripe checkout pro konkretni produkt / sluzbu
- duvod: bylo explicitne upresneno zadanim
- dopad: kazda dotcena route potrebuje vlastni vazbu na produkt nebo cenu ve Stripe

### 2026-04-11 - Post-payment automatizace

- rozhodnuti: po uspesne platbe navazuje automatizace v Make, ktera zakazniky tridi podle zakoupeneho produktu nebo sluzby
- duvod: odpovida ocekavanemu provoznimu modelu
- dopad: pred launch je potreba overit konkretni Make scenar, mapovani produktu a cilove skupiny

### 2026-04-11 - Success handling

- rozhodnuti: pro prvni verzi muze byt success page ponechana na Stripe strane
- duvod: zjednodusuje MVP a nevytvari dalsi povinnou interní route
- dopad: vlastni success route neni potreba pro prvni implementacni fazi

### 2026-04-09 - Zdroj obsahu pro migraci

- rozhodnuti: implementace vychazi z lokalniho snapshotu
- duvod: stabilni, auditovatelny a opakovatelny podklad pro prepis obsahu
- dopad: obsah se nema migrovat rucne primo z live webu bez zaznamu

### 2026-04-09 - Vizuální kontinuita

- rozhodnuti: zachovat stavajici vizualni styl a prevest ho do design systemu
- duvod: scope neni redesign, ale technologicka migrace
- dopad: komponenty, typografie i barvy musi sledovat existujici brandovy feeling

## Jak pridavat dalsi rozhodnuti

Pouzij tento format:

```md
### YYYY-MM-DD - Nazev rozhodnuti

- rozhodnuti: ...
- duvod: ...
- dopad: ...
```
