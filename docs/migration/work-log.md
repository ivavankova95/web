# Work log

Datum zalozeni: 2026-04-09

Tento soubor je prubezny denik implementace, zmen a blokatoru.

## 2026-04-09

### Dokonceno

- proveden technicky audit verejneho webu
- vytvoren crawl verejnych URL a DOM analyza
- vytvorena runtime sonda integraci
- vytvoren lokalni snapshot textu a obrazku
- vytvorena hlavni migrační dokumentace
- potvrzen scope bez clenske sekce
- potvrzeno, ze FAPI se v novem reseni nepouzije
- potvrzeno, ze Stripe je cilova checkout vrstva
- zalozen backlog, decision log a `Agent.md`

### Aktuální stav

- projekt ma pripravenou analyzu, zdroje a rozhodnuti
- chybi implementacni scaffold Next.js + Sanity + Netlify
- chybi navrh konkretni Stripe architektury pro stranky puvodne zavisle na FAPI

### Blokátory

- zadny technicky blokator zatim neni zaznamenany

### Dalsi krok

- navrhnout konkretni Stripe flow pro `/e-book-jak-sestavit-jidelnicek`, `/osobni-konzultace`, `/osobni-konzultace-objednavka` a `/formular---pruvodce-vyzivou-a-pohybem`

## 2026-04-11

### Dokonceno

- upresnen cilovy model pro Stripe nahrazujici FAPI
- zapsano, ze dotcene stranky budou mit Stripe formular nebo checkout pro konkretni produkt / sluzbu
- zapsano, ze po platbe navazuje automatizace v Make
- zapsano, ze success stav muze pro MVP zustat na Stripe strane
- vytvorena specifikace `docs/migration/stripe-flow-spec.md`
- analyzovany dva Make blueprinty a zapsano skutecne mapovani formularu a nakupu
- vytvoren prvni bezici Next.js + Sanity + Stripe scaffold v rootu projektu
- vytvoreny route scaffoldy pro homepage, blog, clanky, kategorie, search a 4 Stripe relevantni stranky
- vytvoreny API scaffoldy `app/api/forms/submit` a `app/api/stripe/checkout`
- vytvoreny zakladni komponenty `SiteHeader`, `Footer`, `LeadForm` a `CheckoutPanel`
- vytvoreny zakladni Sanity schema types a provozni configy
- potvrzeno, ze projekt musi explicitne pocitat s editaci pres Sanity Studio
- rozsireny Sanity schema types o `navigation`, `footer`, `legalPage`, `seo` a page builder bloky
- vytvoreny GROQ query scaffold pro `siteSettings`, `navigation`, `footer`, `page`, `servicePage`, `offerPage`, `legalPage`, `blogPost` a `category`
- doplneny route scaffoldy pro legal stranky, profil / kontakt, dalsi offer pages a zbyvajici service pages z parity mapy
- vytvorena generovana import strategie ze `snapshot/pages-json/` do cilovych Sanity modelu
- vytvoren manifest `snapshot/manifests/sanity-import-plan.json` pro strojove zpracovani importu
- vytvoren prvni page builder renderer a napojen na `styleguide` route jako provozni ukazka noveho content modelu
- vytvorena snapshot content vrstva jako fallback zdroj pro route rendering bez pristupu do Sanity
- homepage, legal pages, service pages, offer pages, blog index, clanky a kategorie jsou ted renderovane nad lokalnim snapshotem
- `clanky/[slug]` a `kategorie/[slug]` jsou ted staticky generovane pres `generateStaticParams` ze snapshotu
- `SiteHeader` a `Footer` jsou nově napojene na data-driven snapshot shell misto ciste hardcoded navigace
- root metadata a klicove route metadata se ted generuji ze snapshot title / description / canonical hodnot
- vytvoren generator `scripts/generate_sanity_global_seed.py` pro `siteSettings`, `navigation` a `footer`
- vygenerovan manifest `snapshot/manifests/sanity-global-seed.json` jako import-ready zaklad pro globalni dokumenty
- doplneny Studio runtime dependency baliky `styled-components` a `@babel/runtime`
- overeny aktualni doporucene balicky a jejich verze z oficialnich zdroju
- probehlo `npm run typecheck` uspesne
- probehlo `npm run build` uspesne

### Aktuální stav

- architektonicky model checkoutu je propsany do beziciho scaffoldu
- projekt ma zaklad pro dalsi implementaci rout, Sanity modelu a integraci
- route parity scaffold ted pokryva i legal pages a vetsinu statickych marketingovych rout z parity mapy
- importni vrstva uz ma konkretni mapovani 50 snapshot stranek na cilove modely a layout families
- velka cast frontendu uz neni placeholder scaffold, ale fallback render nad realnymi snapshot daty
- shell webu uz ma snapshot-backed navigaci, footer a zakladni SEO helper vrstvu
- globalni Sanity dokumenty uz maji pripraveny seed, ale cekaji na doplneni social URL a kontaktu
- projekt uz explicitne pocita s editaci pres Sanity Studio, ne jen s obecným CMS backendem
- Sanity Studio je potvrzene jako editorsky workflow, ale embedded route zatim zustava blokovana build kompatibilitou
- linting je nakonfigurovany, ale validace je aktualne blokovana dependency problemem v `eslint-config-next` stromu

### Blokátory

- je potreba pred implementaci overit realny Make scenar, Stripe price IDs a mapovani produktu
- je potreba potvrdit, jestli zustava Base44 webhook mezivrstva
- je potreba potvrdit nesoulad group ID u `Konzultace_zdarma`
- `npm run lint` aktualne pada kvuli rozbite transitivni zavislosti `fastq`, takze lint zatim nelze brat jako spolehlivy gate

### Dalsi krok

- Studio uz ma custom structure pro globalni dokumenty, marketingove stranky, sluzby, nabidky, blog a legal obsah
- vytvoren generator `scripts/generate_sanity_snapshot_documents.py` pro realne Sanity dokumenty nad snapshotem
- vygenerovan bundle `snapshot/manifests/sanity-import-documents.ndjson` a summary manifest pro import 51 dokumentu
- schema byla rozsirena o `migrationSource` metadata a `migrationImage` placeholder objekty pro asset migration
- vytvoren asset manifest `snapshot/manifests/sanity-asset-manifest.json` pro 181 unikatnich snapshot assetu
- vytvorena sablona `snapshot/manifests/sanity-asset-map.template.json` a hydratační skript pro prepis placeholderu na realne image reference
- vytvoren upload skript `scripts/upload_sanity_assets.py` pro automaticke naplneni `sanity-asset-map.json`, jakmile budou dostupne Sanity env vars
- sepsan provozni postup v `docs/migration/sanity-import-workflow.md`
- dalsi krok je nahrat obrazky do Sanity asset pipeline a nahradit placeholdery realnymi image asset references
- rozsiřit snapshot-backed metadata na zbytek statickych rout a pripravit jejich prepnuti na Sanity SEO model
- doplnit realne social URL a kontaktni udaje do globalniho seedu
- doladit editorske workflow pro globalni dokumenty a page builder
- rozhodnout finalni provozni podobu Sanity Studio workflow vs. embedded Studio route
- sjednotit package manager workflow po workaroundu pres `pnpm`
- rozhodnout post-payment architekturu Stripe -> Make a doplnit realna `price_id`

## 2026-04-12

### Dokonceno

- nahrany snapshot assety do Sanity a vygenerovana `sanity-asset-map.json`
- nahydratovany import bundle na realne Sanity image reference
- proveden import 51 dokumentu do datasetu `production`
- overeno, ze v Sanity jsou blog posty, kategorie, marketingove stranky, legal obsah i globalni dokumenty
- doplnena SEO analyza nad exporty z Google Search Console pro web i Google obrázky
- pridany 301 redirecty pro historicke URL, ktere se stale objevuji v Search Console
- doplneny SEO override title / description pro nejvykonnejsi URL ze Search Console
- detail clanku rozsiřen o `BlogPosting`, `Recipe` a `FAQPage` structured data podle snapshot obsahu
- frontend shell (`siteSettings`, `navigation`, `footer`) prepnuty na cteni ze Sanity s automatickym snapshot fallbackem
- root metadata prepnuta na globalni SEO data ze Sanity s fallbackem na snapshot
- homepage prepnuta na hybridni rezim: pokud existuje page builder dokument v Sanity, frontend ho vykresli, jinak zustava snapshot fallback
- doplnena Sanity image helper vrstva pro frontend renderer a portable text obrazky
- pridana route `app/api/revalidate/sanity`, tagovana fetch vrstva a env scaffold pro on-demand revalidation ze Sanity webhooku
- sepsan samostatny provozni postup pro webhook setup v `docs/migration/sanity-webhook-setup.md`
- overeno `npm run typecheck` a `npm run build`

### Aktuální stav

- obsah je uz fyzicky nahrany v Sanity a editor ma k dispozici realne dokumenty misto prazdnych schemat
- frontend je ted hybridni: globalni shell a homepage uz umi cist ze Sanity, zbytek rout zustava bezpecne snapshot-backed
- Search Console potvrdila, ze `/clanky/dort-k-prvnim-narozeninam` je kriticka URL jak pro web search, tak pro Google obrázky
- dalsi obsahovy polish je vhodne delat rucne v Sanity Studiu, ne natvrdo v kodu

### Blokátory

- vetsina obsahovych rout zatim necte primarne obsah ze Sanity, takze editorske zmeny se jeste nepropisuji do celeho verejneho webu
- webhook flow je pripraveny, ale jeste je potreba ho zapojit v Sanity Manage / webhook nastaveni
- `npm run lint` porad neni spolehlivy gate kvuli transitivni zavislosti `fastq`

### Dalsi krok

- napojit blog, clanky, kategorie a dalsi hlavni routy na cteni ze Sanity s bezpecnym snapshot fallbackem
- zapojit webhook z Sanity do `api/revalidate/sanity` a nastavit `SANITY_REVALIDATE_SECRET`
- po technickem prepnuti udelat rucni SEO polish top stranek ve Studiu podle priorit ze Search Console

## 2026-04-12 (pokracovani)

### Dokonceno

- napojeny routy `/blog`, `/clanky/[slug]` a `/kategorie/[slug]` na Sanity s bezpecnym snapshot fallbackem
- rozsiřeny GROQ queries: `allBlogPostsQuery`, `allBlogPostSlugsQuery`, `categoryArticlesBySlugQuery`, `allCategoriesQuery`, aktualizovany `blogPostBySlugQuery` a `categoryBySlugQuery`
- pridany loadery: `getSanityBlogPosts`, `getSanityBlogPostBySlug`, `getSanityBlogPostSlugs`, `getSanityCategories`, `getSanityCategoryBySlug`, `getSanityCategoryArticles`
- vytvorena komponenta `SanityArticlePage` pro rendering Sanity blog postu pres PortableText
- `generateStaticParams` pro `/clanky/[slug]` merguje slugy ze Sanity i ze snapshotu (Gemini doporuceni)
- fallback logika: pokud Sanity vrati post s neprazdnym `content`, zobrazi Sanity renderer; jinak zustava `SnapshotContentPage`
- metadata pro `/blog`, `/clanky/[slug]` a `/kategorie/[slug]` ted preferuji Sanity i bez explicitne vyplneneho `seo` objektu a zachovavaji canonical, robots a OG/Twitter signal
- Sanity clanky doplneny o portable text image rendering a `BlogPosting` structured data s `image` a `datePublished`
- overeno `npm run typecheck` a `npm run build`, staticky se generuje 56 rout
- pridana sdilena hybridni vrstva pro page / servicePage / offerPage / legalPage routy, takze vetsina verejnych obsahovych stranek uz umi cist Sanity dokumenty a pri chybejicich datech bezpecne spadnou do snapshot fallbacku
- marketingove, offer a legal routy ted generuji metadata pres `getSanityRouteMetadata`, takze canonical, title, description a robots uz nejsou zavisle jen na snapshotu
- overeno `npm run typecheck` a `npm run build` bez chyb

### Aktuální stav

- `/blog`, `/clanky/[slug]` a `/kategorie/[slug]` cte primarne ze Sanity, automaticky fallback na snapshot
- editorske zmeny v Sanity Studiu se jiz propisuji do blog sekcce, pokud ma dokument vyplneny `content`
- import v Sanity obsahuje portable text z migrace — nektere posty mohou mit prazdny content (fallback na snapshot)

### Blokátory

- webhook flow je pripraveny, ale jeste je potreba ho zapojit v Sanity Manage / webhook nastaveni + nastavit `SANITY_REVALIDATE_SECRET`
- `npm run lint` porad neni spolehlivy gate kvuli transitivni zavislosti `fastq`

### Dalsi krok

- zapojit webhook z Sanity do `api/revalidate/sanity` a nastavit `SANITY_REVALIDATE_SECRET`
- otestovat, ze blog posty v Sanity maji vyplneny `content` (portable text z migrace) — pokud ne, zvazit doplneni obsahu rucne ve Studiu
- po nastaveni webhooku udelat rucni SEO polish top stranek ve Studiu podle priorit ze Search Console

## 2026-04-13

### Dokonceno

- prepnuta webhook route na HMAC-SHA256 validaci pres `@sanity/webhook` (balicek nainstalovan pres pnpm)
- odstranen `payload.secret` z route — autorizace ted probiha vyhradne pres podpis v hlavicce `sanity-webhook-signature`
- overeno, ze v Next.js 16 je `revalidateTag(tag, "max")` spravne — druhy argument `profile` je v teto verzi povinny
- vytvoren `scripts/check_sanity_content.py` pro audit portable text obsahu v Sanity
- skript potvrdil, ze vsech 19 blog postu ma vyplneny content — zadny neni bez Sanity rendereru
- aktualizovany `docs/migration/sanity-webhook-setup.md`: pridany instrukce pro Sanity Manage (filter na drafts, spravna projekce `slug.current`, lokalni testovaci skript)
- overeno `npm run typecheck` a `npm run build` bez chyb

### Aktuální stav

- webhook route je pripravena a bezpecna
- vsechny blog posty maji content a pouzivaji Sanity renderer (zadny neni na snapshot fallbacku)
- chybi jiz jen nastaveni webhooku v Sanity Manage a doplneni `SANITY_REVALIDATE_SECRET` do Netlify env vars

### Blokátory

- webhook v Sanity Manage zatim neni nakonfigurovan — vyzaduje rucni krok v [sanity.io/manage](https://www.sanity.io/manage)
- `SANITY_REVALIDATE_SECRET` neni v Netlify env vars (web neni nasazen)
- `npm run lint` porad neni spolehlivy gate kvuli transitivni zavislosti `fastq`

### Dalsi krok

- rucne nakonfigurovat webhook v Sanity Manage dle `docs/migration/sanity-webhook-setup.md`
- po nasazeni na Netlify pridat `SANITY_REVALIDATE_SECRET` do Netlify env vars
- po nasazeni otestovat end-to-end: upravit dokument ve Studiu → publikovat → overit, ze se zmena propise bez ručního rebuildu

## 2026-04-14

### Dokonceno
- **Oprava dostupnosti:** Vyresen konflikt portu, dev server bezi na portu 3000.
- **Linter & Stability:** ESLint downgradovan na v9 (kompatibilita), opraveny vsechny TS/lint chyby.
- **Vizuální parita /o-mne:** Vytvorena dedikovana stranka s gridy a certifikaty odpovidajici originalu.
- **Globální CSS:** Pridany kontejnery (.container--narrow) a prose typografie.
- **Stripe Webhook:** Implementovana routa `/api/stripe/webhook` pro odesilani plateb do Make.
- **Formuláře:** Dokonceno odesilani leadu do Make v `/api/forms/submit`.
- **Sanity Studio:** Opraven 404 error na `/studio` pridanim chybějící index stranky.

### Aktuální stav
- Web je technicky stabilni, visualne sjednocen s produkci.
- Integrace na Make jsou pripravene k testovani (cekaji na ENV klice).

### Dalsi krok
- Nastaveni Sanity revalidacniho webhooku.
- Testovani Stripe flow s testovacimi Price ID.


```md
## YYYY-MM-DD

### Dokonceno

- ...

### Aktuální stav

- ...

### Blokátory

- ...

### Dalsi krok

- ...
```
