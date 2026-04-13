# URL parita a routing mapa

Datum: 2026-04-09

Tento dokument definuje, jaké URL musí v novém řešení zůstat zachované a jak se mapují na nové route a content typy.

## 1. Pravidla parity

- veřejné URL zůstávají stejné
- žádná veřejná URL se nemění na nový slug
- nebudou se zavádět redirecty jen kvůli technologické migraci
- canonical URL zůstávají stejné
- pokud současný web používá query parametr jako součást navigace, nový web jej musí umět číst

## 2. Výjimka z parity scope

Route mimo scope:

- `/pruvodce-pristup/domu`

Důvod:

- jde o původní chráněnou členskou sekci
- v novém webu se členství neřeší
- navigace bude nově odkazovat externě na `https://app.zdravimebavi.cz/`

## 3. Legacy query compat vrstva

Tyto query parametry musí nový frontend rozumět i po migraci:

| URL | Legacy parametr | Význam | Požadavek |
| --- | --- | --- | --- |
| `/` | `d2e85baa_page` | stránkování homepage listingu | podporovat |
| `/blog` | `9cdf212f_page` | stránkování blogu | podporovat |
| `/kategorie/[slug]` | `b0ee97b8_page` | stránkování kategorií | podporovat |
| `/search` | `query` | fulltext dotaz | podporovat |

Doporučení pro implementaci:

- interně může existovat i alias `page`
- route nesmí vyžadovat redirect z legacy parametru na nový parametr
- canonical u paginace držet podle současného SEO zadání

## 4. Route mapy podle rodin

## 4.1 Core routes

| Současná URL | Cílová Next route | Sanity model | Layout | Poznámka |
| --- | --- | --- | --- | --- |
| `/` | `app/page.tsx` | `page` nebo `siteSettings + page` | `MarketingLayout` | homepage s CTA, listingem a MailerLite |
| `/blog` | `app/blog/page.tsx` | `blogPost`, `category` | `ContentLayout` | listing článků + kategorie + pagination |
| `/search` | `app/search/page.tsx` | index z `blogPost` + `page` | `ContentLayout` | zachovat query parametr `query` |
| `/404` | `app/not-found.tsx` + custom content | `page` nebo hardcoded config | `MarketingLayout` | zachovat vlastní 404 vzhled |

## 4.2 Legal a statické informační stránky

| Současná URL | Cílová Next route | Sanity model | Layout | Poznámka |
| --- | --- | --- | --- | --- |
| `/cookies` | `app/cookies/page.tsx` | `legalPage` | `MarketingLayout` | consent a cookies informace |
| `/gdpr` | `app/gdpr/page.tsx` | `legalPage` | `MarketingLayout` | osobní údaje |
| `/obchodni-podminky` | `app/obchodni-podminky/page.tsx` | `legalPage` | `MarketingLayout` | obchodní podmínky |
| `/odpovednost` | `app/odpovednost/page.tsx` | `legalPage` | `MarketingLayout` | disclaimer / odpovědnost |
| `/styleguide` | `app/styleguide/page.tsx` | `page` | `StandaloneLayout` | může sloužit jako veřejná DS showcase stránka |

## 4.3 Obsahové a profilové stránky

| Současná URL | Cílová Next route | Sanity model | Layout | Poznámka |
| --- | --- | --- | --- | --- |
| `/o-mne` | `app/o-mne/page.tsx` | `page` | `MarketingLayout` | profilová stránka |
| `/napis-mi` | `app/napis-mi/page.tsx` | `page` + `formBlock` | `MarketingLayout` | kontakt + Webflow form náhrada |
| `/pruvodce` | `app/pruvodce/page.tsx` | `offerPage` | `StandaloneLayout` | hlavní sales landing pro průvodce |
| `/zhubni-bez-pocitani-kalorii` | `app/zhubni-bez-pocitani-kalorii/page.tsx` | `offerPage` | `StandaloneLayout` | lead / sales landing |
| `/e-book-jak-sestavit-jidelnicek` | `app/e-book-jak-sestavit-jidelnicek/page.tsx` | `offerPage` | `StandaloneLayout` | Stripe order flow / lead magnet |
| `/letni-prazdninova-vyzva` | `app/letni-prazdninova-vyzva/page.tsx` | `offerPage` | `StandaloneLayout` | YouTube embed |
| `/kalendar` | `app/kalendar/page.tsx` | `offerPage` + `formBlock` | `StandaloneLayout` | MailerLite signup |

## 4.4 Službové landingy

| Současná URL | Cílová Next route | Sanity model | Layout | Poznámka |
| --- | --- | --- | --- | --- |
| `/cviceni-v-benatkach-nad-jizerou` | `app/cviceni-v-benatkach-nad-jizerou/page.tsx` | `servicePage` | `MarketingLayout` | Wistia + formulář |
| `/cviceni-v-benatkach-nad-jizerou-formular` | `app/cviceni-v-benatkach-nad-jizerou-formular/page.tsx` | `offerPage` nebo `servicePage` | `CheckoutLayout` | conversion page |
| `/individualni-treninky-benatky-nad-jizerou-a-okoli` | `app/individualni-treninky-benatky-nad-jizerou-a-okoli/page.tsx` | `servicePage` | `MarketingLayout` | formulář |
| `/konzultace-zdarma` | `app/konzultace-zdarma/page.tsx` | `servicePage` | `MarketingLayout` | formulář + CTA |
| `/lekce-cviceni` | `app/lekce-cviceni/page.tsx` | `servicePage` | `MarketingLayout` nebo `StandaloneLayout` | ověřit finální layout podle obsahové skladby |
| `/osobni-konzultace` | `app/osobni-konzultace/page.tsx` | `servicePage` | `StandaloneLayout` | consultation form + Stripe handoff |
| `/osobni-konzultace-objednavka` | `app/osobni-konzultace-objednavka/page.tsx` | `offerPage` | `CheckoutLayout` | Stripe checkout |
| `/skupinove-lekce-benatky-nad-jizerou` | `app/skupinove-lekce-benatky-nad-jizerou/page.tsx` | `servicePage` | `MarketingLayout` | Wistia + formulář |
| `/formular---pruvodce-vyzivou-a-pohybem` | `app/formular---pruvodce-vyzivou-a-pohybem/page.tsx` | `offerPage` | `CheckoutLayout` | native intake form + Stripe checkout |

## 4.5 Blog články

Všechny následující URL musí zůstat na stejné cestě a být obsloužené jednou route `app/clanky/[slug]/page.tsx` nad modelem `blogPost`.

| URL | Slug |
| --- | --- |
| `/clanky/5-tipu-jak-zvladnout-cviceni-v-horku` | `5-tipu-jak-zvladnout-cviceni-v-horku` |
| `/clanky/arasidova-omacka` | `arasidova-omacka` |
| `/clanky/brokolicova-omacka` | `brokolicova-omacka` |
| `/clanky/broskvovy-dort` | `broskvovy-dort` |
| `/clanky/chia-pudink` | `chia-pudink` |
| `/clanky/datle-v-cokolade-s-malinovym-kremem-a-omega-3` | `datle-v-cokolade-s-malinovym-kremem-a-omega-3` |
| `/clanky/dort-k-prvnim-narozeninam` | `dort-k-prvnim-narozeninam` |
| `/clanky/jak-spravne-jist` | `jak-spravne-jist` |
| `/clanky/jarni-salat-ktery-zasyti` | `jarni-salat-ktery-zasyti` |
| `/clanky/nejlepsi-ceske-podcasty-o-zdravem-zivotnim-stylu` | `nejlepsi-ceske-podcasty-o-zdravem-zivotnim-stylu` |
| `/clanky/obilna-kase-ctyrikrat-jinak` | `obilna-kase-ctyrikrat-jinak` |
| `/clanky/ochutnej-orech` | `ochutnej-orech` |
| `/clanky/plnene-datle-v-cokolade` | `plnene-datle-v-cokolade` |
| `/clanky/pohyb-mimo-cviceni` | `pohyb-mimo-cviceni` |
| `/clanky/skupinove-lekce-cviceni-v-benatkach-nad-jizerou` | `skupinove-lekce-cviceni-v-benatkach-nad-jizerou` |
| `/clanky/tiramisu` | `tiramisu` |
| `/clanky/tvarohova-babovka` | `tvarohova-babovka` |
| `/clanky/unava-5-duvodu-proc-jste-neustale-unaveni` | `unava-5-duvodu-proc-jste-neustale-unaveni` |
| `/clanky/veganske-proteinove-tycinky-ktere-stoji-za-vyzkouseni` | `veganske-proteinove-tycinky-ktere-stoji-za-vyzkouseni` |

## 4.6 Kategorie

Všechny následující URL musí zůstat na stejné cestě a být obsloužené jednou route `app/kategorie/[slug]/page.tsx` nad modelem `category`.

| URL | Slug |
| --- | --- |
| `/kategorie/cum-ea` | `cum-ea` |
| `/kategorie/peceni` | `peceni` |
| `/kategorie/sladke` | `sladke` |
| `/kategorie/slane` | `slane` |
| `/kategorie/vareni` | `vareni` |
| `/kategorie/ze-zivota` | `ze-zivota` |

## 5. QA checklist pro URL paritu

- homepage funguje na `/`
- blog funguje na `/blog`
- všech 19 článků vrací `200`
- všech 6 kategorií vrací `200`
- legal stránky vrací `200`
- search funguje na `/search?query=...`
- legacy query parametry fungují bez redirectu
- sitemap obsahuje jen veřejné URL
- `/pruvodce-pristup/domu` není součástí veřejného webu
- žádná veřejná stránka neobsahuje interní odkaz na `/pruvodce-pristup/domu`
