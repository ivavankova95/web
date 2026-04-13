# Design systém pro nový web

Datum: 2026-04-09

Cílem design systému je převést současný vizuální styl do udržitelné komponentové vrstvy bez změny brandového dojmu.

## 1. Brand principy

Současný web působí jako:

- warm
- lidský
- podpůrný
- ženský, ale ne křehký
- editorial, ne korporátní
- čistý a vzdušný

Nový design systém musí zachovat:

- světlý a měkký základ
- vínový / malinový brand akcent
- velké centrální headline bloky
- rounded CTA prvky
- kombinaci fotek, textu a prodejních sekcí
- jednoduchou, přístupnou orientaci

## 2. Design tokens

## 2.1 Barvy

Primární tokeny vycházejí ze současného CSS:

| Token | Hodnota | Význam |
| --- | --- | --- |
| `--color-brand` | `#a84163` | hlavní CTA a akcent |
| `--color-surface` | `#f9f7f3` | hlavní světlé pozadí |
| `--color-surface-alt` | `#f3ead5` | druhé teplé pozadí |
| `--color-text` | `#363636` | hlavní text |
| `--color-text-muted` | `#a9adb4` | sekundární text |
| `--color-white` | `#ffffff` | invert / button text |
| `--color-black` | `#000000` | utility / overlay |

Doporučené semantické tokeny:

| Semantika | Token |
| --- | --- |
| Primary CTA | `--color-brand` |
| CTA hover bg | `--color-surface` nebo `--color-surface-alt` |
| Page background | `--color-surface` |
| Section contrast bg | `--color-surface-alt` |
| Heading text | `--color-text` |
| Body text | `--color-text` |
| Metadata / helper text | `--color-text-muted` |
| Border subtle | `rgba(54,54,54,0.12)` |
| Shadow subtle | `rgba(0,0,0,0.12)` |

## 2.2 Typografie

Ze současného CSS:

- primární font: `Montserrat`
- sekundární / editorial font: `Merriweather`

Doporučení:

| Použití | Font | Váhy |
| --- | --- | --- |
| H1-H3, CTA, navigace | Montserrat | 500, 700 |
| Rich text akcenty, citace, subheady | Merriweather | 700 |
| Body text a formuláře | Montserrat | 400, 500 |
| Meta / popisky | Montserrat | 400 |

Typografická hierarchie:

| Role | Velikost desktop | Mobil |
| --- | ---: | ---: |
| Display / Hero H1 | 48-64 px | 32-40 px |
| Section H2 | 32-40 px | 26-32 px |
| Card H3 | 22-28 px | 20-24 px |
| Body L | 18 px | 17-18 px |
| Body M | 16 px | 16 px |
| Meta / helper | 14 px | 14 px |
| CTA | 14-16 px uppercase | 14-16 px uppercase |

## 2.3 Spacing

Doporučená škála:

- `4`
- `8`
- `12`
- `16`
- `24`
- `32`
- `40`
- `56`
- `64`
- `80`
- `120`

Použití:

- mezi formulářovými prvky: `12-16`
- mezi kartami: `24-32`
- sekce desktop: `64-120`
- sekce mobil: `40-64`

## 2.4 Radius

Hodnoty odvozené z aktuálního stylu:

| Použití | Radius |
| --- | ---: |
| CTA button | `15px` |
| Cards / panels | `20px` |
| Inputs | `12-16px` |
| Badge / chips | `999px` |

## 2.5 Stíny

Stín má být jemný a měkký, ne technický:

```css
--shadow-soft: 0 10px 30px rgba(0,0,0,0.08);
--shadow-card: 0 6px 18px rgba(0,0,0,0.10);
```

## 3. Layout pravidla

## 3.1 Kontejnery

| Typ kontejneru | Doporučení |
| --- | --- |
| `container.content` | max `940px` pro article a textový obsah |
| `container.default` | max `1200-1280px` pro běžné sekce |
| `container.wide` | max `1440px` pro hero split a gallery |

Desktop padding má zachovat velkorysost současného webu. Současný web používá velmi široké horizontální odsazení v navigaci, proto se nemá přejít na příliš úzký SaaS layout.

## 3.2 Breakpointy

Doporučené breakpointy:

- `480`
- `768`
- `992`
- `1280`

Pravidla:

- CTA a hero bloky musí být plně čitelné už od mobilu
- velké gridy se mají rozpadat do 1 sloupce bez horizontálního scrollu
- video a galerijní bloky musí mít stabilní aspect ratio

## 4. Komponentová knihovna

## 4.1 Povinné komponenty

| Cílová komponenta | Účel | Poznámka |
| --- | --- | --- |
| `SiteHeader` | hlavní navigace | CTA do `https://app.zdravimebavi.cz/` |
| `PrimaryButton` | hlavní CTA | rounded, uppercase, brand color |
| `SecondaryButton` | sekundární CTA | outline / light surface |
| `CategoryChip` | blog kategorie | pill styl |
| `HeroSplit` | image + text hero | homepage / service / sales |
| `SectionHeading` | sekční nadpis | velký, centrovaný nebo split |
| `FeatureGrid` | odrážky / benefity | služby, prodejní bloky |
| `RichTextContent` | článek / legal | Portable Text renderer |
| `NutritionGrid` | nutriční hodnoty | article detail |
| `IngredientsSteps` | recept / postup | article detail |
| `ArticleCard` | listing článků | blog a kategorie |
| `Pagination` | listingy | kompatibilní s legacy query parametry |
| `TestimonialCard` | reference | služby a sales pages |
| `VideoEmbed` | Wistia / YouTube | lazy load |
| `NewsletterForm` | MailerLite | homepage / kalendář |
| `ContactForm` | kontaktní / lead form | Next + API / provider |
| `CheckoutPanel` | Stripe checkout / payment summary | checkout layout |
| `Footer` | legal + social | globální shell |

## 4.2 Vizuální pravidla komponent

### Tlačítka

- primární tlačítko má brand background `#a84163`
- text bílý
- uppercase label
- letter spacing `1px`
- hover jde do světlého povrchu a textu v brand barvě
- radius `15px`

### Formuláře

- inputs s větším vnitřním paddingem
- labely čitelné, žádné placeholder-only formuláře
- error stavy v barvě brand / semantic error
- checkbox sekce pro GDPR a obchodní podmínky vizuálně oddělit

### Karty

- jemný stín
- velkorysé paddingy
- nesmí působit technicky nebo dashboardově

### Rich text

- jasná hierarchie H2 / H3 / H4
- komfortní délka řádku
- odstavce ne příliš husté
- obrázky s konzistentní mezerou

## 5. Stránkové vzory

## 5.1 Homepage

Musí zachovat:

- hero s hlavní hodnotovou větou
- sekce služeb
- obsahové CTA bloky
- sociální widget / feed jen pokud zůstane součástí zadání
- footer shell

## 5.2 Blog a články

Musí zachovat:

- editorial čitelnost
- snadnou navigaci mezi kategoriemi
- article cards
- nutriční bloky a galerie u článků

## 5.3 Service a sales landingy

Musí zachovat:

- image-led hero
- benefit grids
- testimonial bloky
- CTA flow směrem k formuláři nebo checkoutu

## 5.4 Checkout / embed pages

Musí zachovat:

- maximální soustředění na konverzi
- minimum rušivých prvků
- důvěryhodnost
- jasnou návaznost mezi prodejním textem a formulářem

## 6. Přístupnost

Povinné zásady:

- kontrast minimálně WCAG AA
- focus state pro všechny interaktivní prvky
- žádné CTA jen jako obrázek
- alt texty na všech obsahových obrázcích
- headings ve správné hierarchii
- formuláře s labely a error texty

## 7. Implementační pravidla

- stylovat přes design tokens, ne přes ad-hoc barvy v komponentách
- všechny nové sekce stavět z komponent, ne z page-specific CSS bloků
- page-specific výjimky držet minimálně
- stejné komponenty použít napříč homepage, service pages a offers, jen s různým obsahem

## 8. Minimální token set pro start implementace

```css
:root {
  --color-brand: #a84163;
  --color-surface: #f9f7f3;
  --color-surface-alt: #f3ead5;
  --color-text: #363636;
  --color-text-muted: #a9adb4;
  --color-white: #ffffff;
  --radius-button: 15px;
  --radius-card: 20px;
  --shadow-soft: 0 10px 30px rgba(0, 0, 0, 0.08);
  --font-heading: "Montserrat", sans-serif;
  --font-body: "Montserrat", sans-serif;
  --font-editorial: "Merriweather", serif;
}
```

## 9. QA pro design paritu

- homepage působí vizuálně stejně teple a vzdušně jako dnes
- CTA mají správnou barvu, radius a hover
- navigace a footer drží stejný brandový tón
- blog listing a detail článku jsou čitelné a nepůsobí jako nový produkt
- mobilní verze nekolabuje a zachovává charakter webu
