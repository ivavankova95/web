# Import strategie ze snapshotu do Sanity

Datum: 2026-04-11

Tento dokument je generovany ze `snapshot/pages-json/` a slouzi jako pracovní mapa importu veřejného obsahu do nových Sanity modelů.

## 1. Souhrn

- `blogIndexVirtual`: 1
- `blogPost`: 19
- `category`: 6
- `legalPage`: 4
- `offerPage`: 8
- `page`: 5
- `searchVirtual`: 1
- `servicePage`: 6

## 2. Mapovací pravidla

- `/clanky/[slug]` -> `blogPost`
- `/kategorie/[slug]` -> `category`
- legal URL -> `legalPage`
- service landings -> `servicePage`
- offer / conversion / calendar URL -> `offerPage`
- homepage a obsahové stránky -> `page`
- `/blog` a `/search` zůstávají aplikacní route, ne importované dokumenty

## 3. Import tabulka

| URL | Zdroj | Cílový typ | Cílový slug | Layout | Form key | Product key |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | `home.json` | `page` | `home` | `MarketingLayout` | `—` | `—` |
| `/404` | `404.json` | `page` | `404` | `MarketingLayout` | `—` | `—` |
| `/blog` | `blog.json` | `blogIndexVirtual` | `blog` | `ContentLayout` | `—` | `—` |
| `/clanky/5-tipu-jak-zvladnout-cviceni-v-horku` | `clanky__5-tipu-jak-zvladnout-cviceni-v-horku.json` | `blogPost` | `5-tipu-jak-zvladnout-cviceni-v-horku` | `ContentLayout` | `—` | `—` |
| `/clanky/arasidova-omacka` | `clanky__arasidova-omacka.json` | `blogPost` | `arasidova-omacka` | `ContentLayout` | `—` | `—` |
| `/clanky/brokolicova-omacka` | `clanky__brokolicova-omacka.json` | `blogPost` | `brokolicova-omacka` | `ContentLayout` | `—` | `—` |
| `/clanky/broskvovy-dort` | `clanky__broskvovy-dort.json` | `blogPost` | `broskvovy-dort` | `ContentLayout` | `—` | `—` |
| `/clanky/chia-pudink` | `clanky__chia-pudink.json` | `blogPost` | `chia-pudink` | `ContentLayout` | `—` | `—` |
| `/clanky/datle-v-cokolade-s-malinovym-kremem-a-omega-3` | `clanky__datle-v-cokolade-s-malinovym-kremem-a-omega-3.json` | `blogPost` | `datle-v-cokolade-s-malinovym-kremem-a-omega-3` | `ContentLayout` | `—` | `—` |
| `/clanky/dort-k-prvnim-narozeninam` | `clanky__dort-k-prvnim-narozeninam.json` | `blogPost` | `dort-k-prvnim-narozeninam` | `ContentLayout` | `—` | `—` |
| `/clanky/jak-spravne-jist` | `clanky__jak-spravne-jist.json` | `blogPost` | `jak-spravne-jist` | `ContentLayout` | `—` | `—` |
| `/clanky/jarni-salat-ktery-zasyti` | `clanky__jarni-salat-ktery-zasyti.json` | `blogPost` | `jarni-salat-ktery-zasyti` | `ContentLayout` | `—` | `—` |
| `/clanky/nejlepsi-ceske-podcasty-o-zdravem-zivotnim-stylu` | `clanky__nejlepsi-ceske-podcasty-o-zdravem-zivotnim-stylu.json` | `blogPost` | `nejlepsi-ceske-podcasty-o-zdravem-zivotnim-stylu` | `ContentLayout` | `—` | `—` |
| `/clanky/obilna-kase-ctyrikrat-jinak` | `clanky__obilna-kase-ctyrikrat-jinak.json` | `blogPost` | `obilna-kase-ctyrikrat-jinak` | `ContentLayout` | `—` | `—` |
| `/clanky/ochutnej-orech` | `clanky__ochutnej-orech.json` | `blogPost` | `ochutnej-orech` | `ContentLayout` | `—` | `—` |
| `/clanky/plnene-datle-v-cokolade` | `clanky__plnene-datle-v-cokolade.json` | `blogPost` | `plnene-datle-v-cokolade` | `ContentLayout` | `—` | `—` |
| `/clanky/pohyb-mimo-cviceni` | `clanky__pohyb-mimo-cviceni.json` | `blogPost` | `pohyb-mimo-cviceni` | `ContentLayout` | `—` | `—` |
| `/clanky/skupinove-lekce-cviceni-v-benatkach-nad-jizerou` | `clanky__skupinove-lekce-cviceni-v-benatkach-nad-jizerou.json` | `blogPost` | `skupinove-lekce-cviceni-v-benatkach-nad-jizerou` | `ContentLayout` | `—` | `—` |
| `/clanky/tiramisu` | `clanky__tiramisu.json` | `blogPost` | `tiramisu` | `ContentLayout` | `—` | `—` |
| `/clanky/tvarohova-babovka` | `clanky__tvarohova-babovka.json` | `blogPost` | `tvarohova-babovka` | `ContentLayout` | `—` | `—` |
| `/clanky/unava-5-duvodu-proc-jste-neustale-unaveni` | `clanky__unava-5-duvodu-proc-jste-neustale-unaveni.json` | `blogPost` | `unava-5-duvodu-proc-jste-neustale-unaveni` | `ContentLayout` | `—` | `—` |
| `/clanky/veganske-proteinove-tycinky-ktere-stoji-za-vyzkouseni` | `clanky__veganske-proteinove-tycinky-ktere-stoji-za-vyzkouseni.json` | `blogPost` | `veganske-proteinove-tycinky-ktere-stoji-za-vyzkouseni` | `ContentLayout` | `—` | `—` |
| `/cookies` | `cookies.json` | `legalPage` | `cookies` | `MarketingLayout` | `—` | `—` |
| `/cviceni-v-benatkach-nad-jizerou` | `cviceni-v-benatkach-nad-jizerou.json` | `servicePage` | `cviceni-v-benatkach-nad-jizerou` | `MarketingLayout` | `skupinove_lekce` | `—` |
| `/cviceni-v-benatkach-nad-jizerou-formular` | `cviceni-v-benatkach-nad-jizerou-formular.json` | `offerPage` | `cviceni-v-benatkach-nad-jizerou-formular` | `CheckoutLayout` | `—` | `—` |
| `/e-book-jak-sestavit-jidelnicek` | `e-book-jak-sestavit-jidelnicek.json` | `offerPage` | `e-book-jak-sestavit-jidelnicek` | `StandaloneLayout` | `—` | `ebook_jak_sestavit_jidelnicek` |
| `/formular---pruvodce-vyzivou-a-pohybem` | `formular---pruvodce-vyzivou-a-pohybem.json` | `offerPage` | `formular---pruvodce-vyzivou-a-pohybem` | `CheckoutLayout` | `—` | `pruvodce_vyzivou_a_pohybem` |
| `/gdpr` | `gdpr.json` | `legalPage` | `gdpr` | `MarketingLayout` | `—` | `—` |
| `/individualni-treninky-benatky-nad-jizerou-a-okoli` | `individualni-treninky-benatky-nad-jizerou-a-okoli.json` | `servicePage` | `individualni-treninky-benatky-nad-jizerou-a-okoli` | `MarketingLayout` | `individualni_treninky` | `—` |
| `/kalendar` | `kalendar.json` | `offerPage` | `kalendar` | `StandaloneLayout` | `—` | `—` |
| `/kategorie/cum-ea` | `kategorie__cum-ea.json` | `category` | `cum-ea` | `ContentLayout` | `—` | `—` |
| `/kategorie/peceni` | `kategorie__peceni.json` | `category` | `peceni` | `ContentLayout` | `—` | `—` |
| `/kategorie/sladke` | `kategorie__sladke.json` | `category` | `sladke` | `ContentLayout` | `—` | `—` |
| `/kategorie/slane` | `kategorie__slane.json` | `category` | `slane` | `ContentLayout` | `—` | `—` |
| `/kategorie/vareni` | `kategorie__vareni.json` | `category` | `vareni` | `ContentLayout` | `—` | `—` |
| `/kategorie/ze-zivota` | `kategorie__ze-zivota.json` | `category` | `ze-zivota` | `ContentLayout` | `—` | `—` |
| `/konzultace-zdarma` | `konzultace-zdarma.json` | `servicePage` | `konzultace-zdarma` | `MarketingLayout` | `konzultace_zdarma` | `—` |
| `/lekce-cviceni` | `lekce-cviceni.json` | `servicePage` | `lekce-cviceni` | `MarketingLayout` | `—` | `—` |
| `/letni-prazdninova-vyzva` | `letni-prazdninova-vyzva.json` | `offerPage` | `letni-prazdninova-vyzva` | `StandaloneLayout` | `—` | `—` |
| `/napis-mi` | `napis-mi.json` | `page` | `napis-mi` | `MarketingLayout` | `kontakt` | `—` |
| `/o-mne` | `o-mne.json` | `page` | `o-mne` | `MarketingLayout` | `—` | `—` |
| `/obchodni-podminky` | `obchodni-podminky.json` | `legalPage` | `obchodni-podminky` | `MarketingLayout` | `—` | `—` |
| `/odpovednost` | `odpovednost.json` | `legalPage` | `odpovednost` | `MarketingLayout` | `—` | `—` |
| `/osobni-konzultace` | `osobni-konzultace.json` | `servicePage` | `osobni-konzultace` | `StandaloneLayout` | `osobni_konzultace` | `—` |
| `/osobni-konzultace-objednavka` | `osobni-konzultace-objednavka.json` | `offerPage` | `osobni-konzultace-objednavka` | `CheckoutLayout` | `—` | `osobni_konzultace` |
| `/pruvodce` | `pruvodce.json` | `offerPage` | `pruvodce` | `StandaloneLayout` | `—` | `—` |
| `/search` | `search.json` | `searchVirtual` | `search` | `ContentLayout` | `—` | `—` |
| `/skupinove-lekce-benatky-nad-jizerou` | `skupinove-lekce-benatky-nad-jizerou.json` | `servicePage` | `skupinove-lekce-benatky-nad-jizerou` | `MarketingLayout` | `skupinove_lekce` | `—` |
| `/styleguide` | `styleguide.json` | `page` | `styleguide` | `StandaloneLayout` | `—` | `—` |
| `/zhubni-bez-pocitani-kalorii` | `zhubni-bez-pocitani-kalorii.json` | `offerPage` | `zhubni-bez-pocitani-kalorii` | `StandaloneLayout` | `—` | `—` |

## 4. Poznámky a otevřené body

- `blogIndexVirtual` a `searchVirtual` se do Sanity neimportují jako samostatné dokumenty.
- Homepage doporučeno řídit přes `page` s `pageKey='home'` a globální `siteSettings`.
- U checkout stránek je potřeba před ostrým importem doplnit finální `product_key` a `price_id`.
- Všechny detekované obrázky importovat do Sanity asset pipeline, nechat delivery na Sanity CDN + Netlify Image CDN.
- CTA vedoucí do původní členské sekce přepsat na `https://app.zdravimebavi.cz/`.
