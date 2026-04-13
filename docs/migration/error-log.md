# Error log

Datum zalozeni: 2026-04-11

Tento soubor drzi vsechny nalezene chyby, blokatory a otevrene technicke problemy.

## Aktivní problémy

### 2026-04-11 - MailerLite group mismatch pro `Konzultace_zdarma`

- oblast: Make / MailerLite
- zavaznost: stredni
- popis: v blueprintu `Integrace Webflow` se `CreateUpdateSubscriber` a `AddSubscribertoGroup` rozchazeji v group ID pro `Konzultace_zdarma`
- dopad: bez potvrzeni neni jiste, do jake skupiny se maji kontakty zapisovat v novem reseni
- dalsi krok: potvrdit spravne group ID pred implementaci formulare

### 2026-04-11 - Nejednotná email pole ve starých Webflow formulářích

- oblast: Make / formulare
- zavaznost: nizka
- popis: cast starych rout pouziva `Email`, jine kombinuji `Email` a `Email 3`
- dopad: nova aplikace musi zavest jedno canonical email pole
- dalsi krok: vsechny nove formulare normalizovat na `email`

### 2026-04-11 - Base44 webhook mezivrstva není potvrzená

- oblast: Stripe / Make
- zavaznost: stredni
- popis: aktualni Stripe blueprint po nakupu vola externi Base44 webhook, ale neni potvrzeno, jestli ma zustat i v cilove architekture
- dopad: ovlivnuje navrh webhook vrstvy a odpovednost za post-payment automatizaci
- dalsi krok: potvrdit, zda Base44 zustava, nebo se flow zjednodusi na Stripe -> Make

### 2026-04-11 - Stripe price IDs zatím nejsou známé

- oblast: Stripe
- zavaznost: stredni
- popis: scaffold uz pocita s `product_key` a price ID, ale konkretni produkcni price IDs jeste nejsou doplnene
- dopad: checkout route bez techto hodnot nepujde dokoncit
- dalsi krok: doplnit `STRIPE_PRICE_ID_*` pred prvnim end-to-end testem

### 2026-04-11 - `npm run lint` blokuje rozbita transitive dependency `fastq`

- oblast: frontend tooling / npm
- zavaznost: stredni
- popis: `npm run lint` pada uvnitr stromu `eslint-config-next`, kde chybi nebo je v nekonzistentnim stavu balicek `fastq` pouzivany pres `@nodelib/fs.walk` a `fast-glob`
- dopad: typecheck i build prochazi, ale lint zatim nelze pouzit jako validacni gate projektu
- dalsi krok: pred dalsi implementacni fazi procistit install strom a znovu overit kompatibilitu `eslint` + `eslint-config-next` + lockfile

### 2026-04-11 - Chybejici social URL a kontaktni udaje v globalnim seedu

- oblast: snapshot / Sanity import
- zavaznost: nizka
- popis: ze snapshotu se nepodarilo spolehlive vytahnout finalni Instagram, Facebook, kontaktni email a telefon pro globalni dokumenty `siteSettings` a `footer`
- dopad: import-ready seed pro globalni dokumenty je pripraveny, ale tyto hodnoty zustavaji prazdne a musi se doplnit manualne
- dalsi krok: potvrdit realne social profily a kontaktni udaje pred prvnim importem do Sanity

### 2026-04-11 - Embedded Sanity Studio route pada pri Next 16 buildu

- oblast: Sanity Studio / Next.js build
- zavaznost: stredni
- popis: pokus o embedded Studio route v `app/studio/[[...index]]` rozbil build ve fazi `collect page data`; narazili jsme na runtime chyby kolem `createContext` a na chybejici Studio runtime dependency vrstvu
- dopad: projekt muze pocitat se Sanity Studio jako editacnim workflow, ale embedded `/studio` route zatim neni spolehliva build path
- dalsi krok: nechat Studio zatim jako projektovy / CLI workflow, az pozdeji znovu overit kompatibilni embedded variantu pro finalni provoz

### 2026-04-11 - `npm install` pada na `Invalid Version`, workaround sel pres `pnpm`

- oblast: frontend tooling / package manager
- zavaznost: stredni
- popis: pri doplneni Studio dependency vrstvy (`styled-components`, `@babel/runtime`) `npm install` opakovane padal na chybe `Invalid Version`; instalace probehla az pres `pnpm`
- dopad: projekt ma aktualne smiseny lockfile stav a pred stabilizaci CI / deploy workflow je potreba rozhodnout, jestli se vracime k cistemu `npm`, nebo prejdeme na `pnpm`
- dalsi krok: sjednotit package manager strategii a odstranit paralelni lockfile stav

## Šablona nového záznamu

```md
### YYYY-MM-DD - Nazev problemu

- oblast: ...
- zavaznost: nizka | stredni | vysoka
- popis: ...
- dopad: ...
- dalsi krok: ...
```
