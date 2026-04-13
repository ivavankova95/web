# Make automation map

Datum: 2026-04-11

Tento dokument shrnuje skutecne nalezy z dodanych Make blueprintu:

- `Integrace Webflow.blueprint.json`
- `Stripe Checkout → aplikace Máma ve formě.blueprint.json`

Je to referencni mapa soucasne automatizace pro:

- registrace z Webflow formularu
- post-payment routing po Stripe checkoutu

## 1. Souhrn

Soucasny stav je rozdeleny do dvou scenaru:

1. Webflow formulare -> MailerLite skupiny
2. Stripe nakup -> externi webhook -> MailerLite skupiny

To znamena, ze v novem reseni musime nahradit:

- Webflow trigger nativnimi Next.js formulary
- Stripe trigger zachovat, ale vedome navazat na stejny logicky routing produktu

## 2. Scenario A - Integrace Webflow

## 2.1 Trigger

- modul: `webflow:watchSites`
- webhook label: `Vyplnění formuláře`

## 2.2 Obecna logika

Po prijeti formulare:

- scenario routuje podle `{{1.name}}`
- pro kazdou vetev nejdriv vola `mailerlite2:CreateUpdateSubscriber`
- nasledne vola `mailerlite2:AddSubscribertoGroup`

Typicke mapovani:

- email z `{{1.data.Email}}`
- nekde fallback nebo kombinace s `{{1.data.\`Email 3\`}}`
- jmeno z `{{1.data.Jmeno}}`

## 2.3 Přesné větve

| Form key | Create/Update group ID | Add-to-group ID | MailerLite label |
| --- | --- | --- | --- |
| `Skupinove_lekce` | `89783754506110464` | `89783754506110464` | `Skupinove_lekce` |
| `Konzultace_zdarma` | `88499732844905880` | `89783694836893670` | `Konzultace_zdarma` |
| `Individualni_treninky` | `89809873728963595` | `89809873728963595` | `Individualni_treninky` |
| `Diagnostika` | `89862344295843745` | `89862344295843745` | `Diagnostika` |
| `Online_pohybova_konzultace` | `89862594862515477` | `89862594862515477` | `Online_pohybova_konzultace` |
| `Osobni_konzultace` | `95858162253432527` | `95858162253432527` | `Osobni_konzultace` |
| `Průvodce_vyzivou_pohybem` | `102019552058017427` | `102019552058017427` | `Čekací_listina_Pruvodce` |

## 2.4 Důležité poznatky

- `Konzultace_zdarma` ma nesoulad mezi group ID v `CreateUpdateSubscriber` a `AddSubscribertoGroup`.
- `Skupinove_lekce` mapuje email jako spojeni `Email + Email 3`.
- `Osobni_konzultace` mapuje subscriber ID jako spojeni `Email 3 + email z modulu 39`.
- stare Webflow formulare tedy nepouzivaji jednotnou strukturu emailovych poli.

Migrační dopad:

- v novem reseni je potreba zavest jednotny `form_key`
- email ma byt jednotne validovany a posilan jen z jednoho canonical pole
- pred prepisem newsletter / zajmovych formularu je potreba potvrdit spravny group ID pro `Konzultace_zdarma`

## 3. Scenario B - Stripe Checkout -> aplikace Máma ve formě

## 3.1 Trigger

- modul: `stripe:watchEvents`
- webhook label: `Live platby - aplikace`

## 3.2 Obecna logika

Po Stripe udalosti:

1. `http:ActionSendData`
   - posila purchase data do externiho webhooku
   - cil: Base44 endpoint
   - `api_key` header je v blueprintu pritomen
2. `mailerlite2:CreateUpdateSubscriber`
   - vytvori nebo aktualizuje subscriber podle emailu z `customer_details.email`
3. `builtin:BasicRouter`
   - podle `{{1.object.metadata.products}}` priradi zakaznika do MailerLite skupiny

## 3.3 Payload do externiho webhooku

Do externiho endpointu se posila:

- `email`
- `products`
- `session_id`
- `purchase_date`
- `total_amount`

Pouzity endpoint:

- Base44 aplikacni funkce `simpleAutomationWebhook`

Poznamka:

- tajny `api_key` jsem z dokumentace zamerne neprepsal

## 3.4 Přesné router větve po nákupu

Routing je postaveny nad `{{1.object.metadata.products}}`.

| Filter name | Podmínka | Group ID | MailerLite label |
| --- | --- | --- | --- |
| `workshop+ebook` | obsahuje `workshop` a `ebook` | `169601115012204212` | `App - Workshop+Ebook (zákazníci)` |
| `pouze workshop` | presne `workshop` a bez carky | `164601504137741859` | `App - Máma ve formě - Workshop (zákazníci)` |
| `Kurz Máma ve formě` | obsahuje `kurz` | `175040430812956045` | `App - Kurz Máma ve formě (zákazníci)` |
| `pouze Ebook` | presne `ebook` a bez carky | `179367059569771793` | `App - Ebook (zákazníci)` |

## 3.5 Důležité poznatky

- routing po platbe dnes nestoji na `price_id`, ale na textovem poli `metadata.products`
- kombinacni logika je zatim explicitne zachycena jen pro `workshop+ebook`
- pokud se zmeni nazvy produktu nebo format metadata, Make routing se rozbije
- novy web by mel zachovat jednoduche a stabilni `product_key`

Migrační dopad:

- doporucuju ve Stripe session posilat:
  - `product_key`
  - `source_page`
  - pripadne i lidsky citelne `products`
- Make nebo navazujici middleware by mel routovat primarne podle stabilniho klice, ne podle marketingoveho textu

## 4. Doporučení pro nový web

## 4.1 Pro formuláře

- nahradit routing podle `1.name` routingem podle interniho `form_key`
- centralizovat mapu `form_key -> MailerLite group ID`
- pouzivat jednotne pole:
  - `email`
  - `name`
  - `phone` pokud je potreba

## 4.2 Pro Stripe

- zachovat navaznost na Make, ale nepresne textove routovani omezit
- do Stripe metadata posilat stabilni `product_key`
- pokud je treba kompatibilita s aktualnim scenarem, docasne posilat i `products`
- pred launch overit, jestli Base44 webhook zustava soucasti architektury

## 4.3 Co ověřit před implementací

- spravny group ID pro `Konzultace_zdarma`
- jestli ma zustat Base44 webhook jako mezivrstva
- jestli Make umi nove routovat podle `product_key`
- jestli je potreba vic kombinaci produktu nez `workshop+ebook`

