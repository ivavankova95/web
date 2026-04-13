# Stripe flow specification

Datum: 2026-04-11

Tento dokument popisuje cilovy navrh nahrazeni puvodnich FAPI formularu a checkoutu pomoci Stripe.

## 1. Cílový princip

Na dotcenych strankach se misto FAPI pouzije Stripe formular / checkout pro konkretni produkt nebo sluzbu.

Pracovni model:

- kazda puvodne FAPI stranka bude mit vlastni Stripe vazbu
- vazba bude smerovat na konkretni produkt, cenu nebo sluzbu ve Stripe
- po uspesne platbe poběží navazujici automatizace v Make
- Make rozdeli zakazniky do skupin podle toho, co koupili
- success stav muze byt reseny primo Stripe success page

Poznamka:

- pred launch je potreba overit konkretni Make scenar, mapovani produktu a cilove skupiny
- z aktualniho Make blueprintu vyplyva, ze post-payment routing dnes bezi nad `object.metadata.products`

## 2. Dotčené stránky

| URL | Typ flow | Cílový Stripe model |
| --- | --- | --- |
| `/e-book-jak-sestavit-jidelnicek` | produktovy nakup | Stripe produkt / cena pro e-book |
| `/osobni-konzultace` | pre-sales / vstup do objednavky | Stripe handoff na produkt konzultace |
| `/osobni-konzultace-objednavka` | objednavka sluzby | Stripe checkout pro konzultaci |
| `/formular---pruvodce-vyzivou-a-pohybem` | intake + objednavka | nativni intake formular + Stripe checkout pro pruvodce |

## 3. Doporučená technická architektura

## 3.1 Frontend

- Next.js stranka vykresli obsah a `CheckoutPanel`
- `CheckoutPanel` zna odpovidajici Stripe konfiguraci pro danou stranku
- u ciste objednavkovych stranek se uzivatel posila primo do Stripe checkout flow
- u intake stranek se nejdriv odešle nativni formular a az potom se otevre Stripe checkout

## 3.2 Backend

- Next.js server action nebo API route vytvori Stripe Checkout Session
- session musi nest metadata pro:
  - `source_page`
  - `product_key`
  - `service_group`
  - pripadne `customer_email`
- Stripe webhook potvrdi uspesnou platbu
- Make automatizace navazuje na Stripe udalost nebo na webhook forwarding vrstvu
- v aktualnim stavu se po Stripe eventu posilaji purchase data i do externiho Base44 webhooku

## 3.3 Downstream automatizace

Cilovy model po zaplaceni:

- Stripe oznami dokoncenou platbu
- Make scenar precte produkt nebo metadata
- Make zaradi zakaznika do odpovidajici skupiny / vetve automatizace
- Make spusti dalsi akce podle typu zakupu

Minimalni rozlisovaci klice:

- `price_id`
- nebo `product_id`
- nebo vlastni metadata `product_key`
- v aktualnim stavu take `metadata.products`

Doporuceni:

- preferovat vlastni metadata `product_key`, protoze jsou stabilnejsi pro logiku integrace nez ciste textove nazvy produktu
- pokud je potreba hladka navaznost na soucasny Make scenar, docasne posilat i `products`

## 4. Success a completion chování

Pro MVP je prijatelne:

- success page ponechat na Stripe strane
- nevyzadovat vlastni interní success route

Dusledky:

- nevznika nova povinna route v parity scope
- implementace je rychlejsi
- po navratu ze Stripe neni potreba udrzovat extra stavovou stranku na webu

Pokud by pozdeji vznikla potreba vlastni success stranky:

- je mozne ji doplnit jako rozsireni
- neni nutna pro prvni fazi migrace

## 5. Page-by-page návrh

## 5.1 `/e-book-jak-sestavit-jidelnicek`

Cil:

- prodat jeden konkretni digitalni produkt

Navrh:

- stranka ma produktovy obsah a CTA
- CTA otevre Stripe checkout pro e-book
- po zaplaceni Stripe success page
- Make zaradi zakaznika do vetve pro e-book

Metadata:

- `product_key = ebook_jak_sestavit_jidelnicek`
- `source_page = /e-book-jak-sestavit-jidelnicek`

## 5.2 `/osobni-konzultace`

Cil:

- vysvetlit sluzbu a privest uzivatele do objednavky

Navrh:

- stranka zustava sales / service landing
- obsahuje nativni konzultacni nebo lead formular
- po odeslani nebo po CTA handoff do Stripe checkout flow pro konzultaci
- success resi Stripe
- Make radi zakaznika do vetve osobnich konzultaci

Metadata:

- `product_key = osobni_konzultace`
- `source_page = /osobni-konzultace`

## 5.3 `/osobni-konzultace-objednavka`

Cil:

- cisty objednavkovy krok

Navrh:

- stranka ma jednodussi checkout layout
- hlavni CTA nebo vlozeny checkout panel vytvori Stripe session pro konzultaci
- success resi Stripe
- Make radi zakaznika do vetve konzultaci

Metadata:

- `product_key = osobni_konzultace_objednavka`
- `source_page = /osobni-konzultace-objednavka`

## 5.4 `/formular---pruvodce-vyzivou-a-pohybem`

Cil:

- sesbirat vstupni data a nasledne dokoncit objednavku

Navrh:

- nejdriv nativni intake formular
- po validnim odeslani formularu vznikne nebo se aktivuje Stripe checkout
- intake data se ulozi nebo preda do systemu pred zaplacenim
- po zaplaceni Stripe success page
- Make radi zakaznika do vetve pruvodce

Metadata:

- `product_key = pruvodce_vyzivou_a_pohybem`
- `source_page = /formular---pruvodce-vyzivou-a-pohybem`

## 6. Co musí umět obsahový model

Minimalni konfigurace pro Stripe block nebo checkout panel:

- `productKey`
- `stripePriceId`
- `checkoutMode`
- `buttonLabel`
- `prefillSourcePage`
- `successMode`

Pro intake flow navic:

- `collectLeadDataBeforeCheckout`
- `leadFields`
- `makeRoutingKey`

## 7. Co musí umět tracking

Doporucene eventy:

- `checkout_open`
- `checkout_start`
- `checkout_success`
- `lead_submit`
- `intake_submit`

Doporucene parametry:

- `product_key`
- `source_page`
- `flow_type`

## 8. Provozní ověření před launch

Pred spuštěním produkce overit:

- existenci vsech Stripe produktu a price IDs
- existenci Make scenare
- mapovani `product_key` -> cilova skupina / automatizace
- jestli zustava soucasti architektury i Base44 webhook mezivrstva
- funkcni Stripe webhook nebo Make napojeni
- funkcni Stripe success page
- funkcni event tracking v GTM / GA4
