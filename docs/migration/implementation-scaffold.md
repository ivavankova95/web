# Implementation scaffold

Datum: 2026-04-11

Tento dokument popisuje, co bylo zalozeno jako prvni kodovy scaffold projektu.

## 1. Co bylo vytvořeno

- root `package.json` pro Next.js + Sanity + Stripe
- `app/` se zakladnimi route scaffoldy
- `app/api/forms/submit`
- `app/api/stripe/checkout`
- `components/checkout/CheckoutPanel`
- `components/forms/LeadForm`
- `lib/forms` s mapou `form_key -> MailerLite group`
- `lib/stripe` s mapou `product_key -> price ID`
- `lib/sanity/queries.ts` s prvnimi GROQ query scaffoldy
- `components/page-builder.tsx` jako prvni renderer nad novym block modelem
- `lib/content/snapshot.ts` jako fallback content loader nad `snapshot/pages-json/`
- `components/snapshot-content-page.tsx` jako route renderer nad lokalnim snapshotem
- snapshot-backed `SiteHeader` a `Footer` shell nad lokalnimi route daty
- snapshot-backed SEO helper pro root layout, clanky, kategorie a klicove staticke route
- `scripts/generate_sanity_global_seed.py` pro globalni import-ready seed dokumenty
- minimalni `sanity.config.ts`, `sanity.cli.ts` a zakladni schema types
- Sanity Studio workflow pres `npm run sanity:dev` a schema layer v projektu
- doplnena Studio runtime dependency vrstva `styled-components` + `@babel/runtime`
- rozsirene schema types pro `navigation`, `footer`, `legalPage`, `seo` a page builder bloky
- route scaffoldy pro legal pages, profil / kontakt, offer pages a service pages podle parity mapy
- `app/styleguide/page.tsx` jako prvni provozni ukazka page builderu
- `scripts/generate_sanity_import_plan.py` pro generovani import mapy ze snapshotu
- `error-log.md` pro evidenci problemu

## 2. Overeni scaffoldu

- `npm run typecheck` prochazi
- `npm run build` prochazi
- `npm run lint` je aktualne blokovane dependency problemem zapsanym v `docs/migration/error-log.md`
- clanky a kategorie se buildi jako SSG pres `generateStaticParams` z lokalniho snapshotu
- shell i metadata uz umi bez Sanity fallbackovat na snapshot title / description / canonical data
- globalni seed manifest umi predpripravit `siteSettings`, `navigation` a `footer`

## 3. Co scaffold zatím nedělá

- neobsahuje realny import obsahu ze Sanity
- neposila realna lead data do MailerLite ani Make
- nema doplnene produkcni Stripe price IDs
- nema potvrzenou strategii pro Base44 webhook mezivrstvu
- nema jeste finalni data-driven navigation a footer ze Sanity
- nema jeste rozhodnutou finalni package manager strategii po workaroundu pres `pnpm`

## 4. Cíl další fáze

- doplnit konkretni route scaffold podle parity mapy
- doplnit Sanity schema pro page builder bloky
- napojit forms route na MailerLite / Make
- napojit Stripe checkout na produkcni price IDs
- rozhodnout finalni post-payment architekturu
