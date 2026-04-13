# Agent.md

Datum zalozeni: 2026-04-09

Tento soubor je operativni manual pro vyvoj a koordinaci projektu migrace `zdravimebavi.cz`.

## 1. Cíl projektu

Postavit novy verejny web na:

- Next.js
- Sanity Free
- Sanity Studio
- Netlify Free
- GitHub Private repo

pri zachovani:

- stejnych verejnych URL
- stejne nebo obsahove ekvivalentni prezentace obsahu
- stejneho vizualniho stylu
- stejne domeny `www.zdravimebavi.cz`

## 2. Nevyjednatelna pravidla

- URL parita ma vyssi prioritu nez technicke zjednoduseni.
- Verejne URL se nemeni a nemaji se resit redirecty kvuli migraci.
- Clenska sekce se neprevadi.
- Vsechny puvodni CTA do clenske sekce maji nově smerovat na `https://app.zdravimebavi.cz/`.
- FAPI se v novem reseni nepouzije.
- Puvodni FAPI flow se nahrazuje kombinaci nativnich Next.js formularu a Stripe checkoutu.
- Netlify Free a Sanity Free jsou soucast zadani, proto se ma architektura drzet static-first pristupu.
- Editace obsahu se ma delat pres Sanity Studio workflow a schema layer v projektu.
- Citlive klice nikdy nepatri do Sanity datasetu.

## 3. Zdroj pravdy

Pred kazdou vetsi implementaci vychazet z techto souboru:

- hlavni specifikace: `docs/migration/README.md`
- URL parita: `docs/migration/url-parity.md`
- design system: `docs/migration/design-system.md`
- integrace: `docs/migration/integrations.md`
- implementacni scaffold: `docs/migration/implementation-scaffold.md`
- import strategie: `docs/migration/import-strategy.md`
- deployment a provoz: `docs/migration/deployment-and-operations.md`
- snapshot workflow: `docs/migration/content-snapshot.md`
- audit stareho webu: `analysis/zmb-audit.md`
- UML: `analysis/zmb-architecture.puml`
- backlog: `docs/migration/implementation-backlog.md`
- decision log: `docs/migration/decision-log.md`
- work log: `docs/migration/work-log.md`
- error log: `docs/migration/error-log.md`

## 4. Doporučený postup práce

Poradi implementace:

1. potvrdit scope a rozhodnuti v decision logu
2. drzet backlog aktualni
3. scaffold projektu a infrastruktury
4. design system a layouty
5. core routy a URL parita
6. Sanity schema a content model
7. migrace obsahu a assetu
8. integrace
9. QA parity
10. launch a post-launch kontrola

## 5. Pravidla pro obsah

- Obsah se ma prepisovat proti lokalnimu snapshotu, ne proti nahodnemu rucnimu kopirovani z live webu.
- Markdown exporty v `snapshot/pages-md/` jsou citelny zdroj.
- JSON exporty v `snapshot/pages-json/` jsou strukturovany zdroj.
- Obrazky se maji brat z `snapshot/assets/images/` a nahravat do Sanity.
- Pri nejasnosti mezi live webem a snapshotem se ma nejdriv zapsat poznamka do work logu a az pak menit model nebo implementaci.

## 6. Pravidla pro integrace

- Consent vrstva musi ridit analytics a marketing skripty.
- GTM/GA4, Hotjar, Meta Pixel, Cookie Script, MailerLite, Elfsight, Wistia a YouTube se implementuji podle `docs/migration/integrations.md`.
- Stripe je cilova checkout vrstva.
- Lead formulare maji byt nativni Next.js komponenty.
- Checkout a payment eventy musi byt meritelne pres GTM/GA4.

## 7. Definition of Done

Task je hotovy, jen pokud:

- odpovida backlogu nebo schvalenemu scope
- je zapsany do work logu, pokud menil architekturu, data nebo workflow
- pokud menil rozhodnuti, je doplneny i decision log
- respektuje URL paritu, design system a integracni pravidla
- nenarusi CTA smerujici na `https://app.zdravimebavi.cz/`

## 8. Jak používat logy

- `docs/migration/implementation-backlog.md`
  - zivi seznam ukolu, priorit a stavu
- `docs/migration/decision-log.md`
  - zaznam zmen architektonickych a produktovych rozhodnuti
- `docs/migration/work-log.md`
  - prubezny denik implementace, blokatoru a navazujicich kroku
- `docs/migration/error-log.md`
  - centralni evidence otevrenych chyb, dependency problemu a integracnich nejasnosti

## 9. Kdy aktualizovat ktery soubor

- backlog: pri zmene priorit, scope nebo stavu ukolu
- decision log: pri zmene architektury, provideru, workflow nebo pravidel
- work log: po kazdem vetsi implementacnim bloku, auditu nebo objevenem riziku
- error log: pri kazdem technickem problemu, validacnim failu nebo neoverene integracni nejasnosti, ktera muze zablokovat dalsi praci
