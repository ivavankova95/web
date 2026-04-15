/**
 * Seed script — vytvoří servicePage a offerPage dokumenty v Sanity
 * s obsahem extrahovaným ze snapshot dat stávajícího webu.
 *
 * Použití:
 *   pnpm dotenv -e .env.local tsx scripts/seed-service-offer-pages.ts
 */

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) {
  console.error("❌  Chybí NEXT_PUBLIC_SANITY_PROJECT_ID");
  process.exit(1);
}
if (!token) {
  console.error("❌  Chybí SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-04-11",
  token,
  useCdn: false
});

// ─── servicePage: osobni-konzultace ─────────────────────────────────────────

const osobniKonzultace = {
  _id: "servicePage-osobni-konzultace",
  _type: "servicePage",
  title: "Osobní konzultace",
  slug: { _type: "slug", current: "osobni-konzultace" },
  serviceKey: "osobni-konzultace",
  excerpt:
    "Chceš mít jednou provždy jasno v tom, co jíst a jak se hýbat, aby ses cítila skvěle? Dopřej si svého individuálního Průvodce výživou a pohybem — odborná doporučení přesně na míru, 2 online konzultace a měsíc podpory.",
  benefits: [
    { _key: "b1", text: "Individualita — žádný univerzální jídelníček, průvodce přesně pro tebe" },
    { _key: "b2", text: "Udržitelnost — doporučení, která dokážeš dodržovat dlouhodobě" },
    { _key: "b3", text: "Dostupnost — bez speciálních doplňků stravy a bez fitka" },
    { _key: "b4", text: "Komplexnost — výživa, pohyb, spánek i celková pohoda v jednom" },
    { _key: "b5", text: "Nezávislost — osvojíš si návyky, které ti zůstanou navždy" }
  ],
  steps: [
    {
      _key: "s1",
      title: "Vyplníš vstupní dotazník",
      description: "Sdělíš mi svůj cíl, stravovací zvyklosti a pohybové aktivity."
    },
    {
      _key: "s2",
      title: "Domluvíme se na úvodní konzultaci",
      description: "Domlouváme se online — pohodlně z domova."
    },
    {
      _key: "s3",
      title: "Pošleš mi zápis jídelníčku",
      description: "Krátký přehled toho, co aktuálně jíš a jak se hýbáš (dostaneš návod, jak na to)."
    },
    {
      _key: "s4",
      title: "Připravím tvého Průvodce výživou a pohybem",
      description: "Výživová doporučení na míru, tipy pro pohyb, spánek a celkovou pohodu."
    },
    {
      _key: "s5",
      title: "Celý měsíc ti budu radit a podporovat tě",
      description: "Kdykoli budeš mít otázku, stačí napsat."
    },
    {
      _key: "s6",
      title: "Druhá konzultace — doladíme detaily",
      description: "Zhodnotíme pokrok a doladíme vše, co potřebuješ."
    }
  ],
  testimonials: [
    {
      _key: "t1",
      quote:
        "Z konzultace jsem si odnesla hlavně praktické informace, jak si mám poskládat jídlo, když nejím maso. Věděla jsem, že jím málo bílkovin a Iva mi poradila i kombinace jejich rostlinných zdrojů. Taky teď vím, že bych měla celkově jíst víc.",
      author: "Petra Králíková, maminka 2 kluků"
    },
    {
      _key: "t2",
      quote:
        "Přehlednou a srozumitelnou formou jsem dostala rady, čeho se vyvarovat a co s čím kombinovat. Nikdy jsem nejedla vyloženě nezdravě, ale přece jen moje strava nebyla dobře vyvážená.",
      author: "Pavla Hejralová, dogfrisbee trenérka a závodnice"
    }
  ],
  leadFormKey: "osobni-konzultace",
  seo: {
    metaTitle: "Osobní konzultace | Zdraví mě baví",
    metaDescription:
      "Průvodce výživou a pohybem přesně na míru. 2 online konzultace, měsíc podpory a doporučení, která ti opravdu sednou.",
    canonicalUrl: "https://www.zdravimebavi.cz/osobni-konzultace",
    noIndex: false
  }
};

// ─── servicePage: lekce-cviceni ─────────────────────────────────────────────

const lekceCviceni = {
  _id: "servicePage-lekce-cviceni",
  _type: "servicePage",
  title: "Tréninky a lekce cvičení",
  slug: { _type: "slug", current: "lekce-cviceni" },
  serviceKey: "lekce-cviceni",
  excerpt:
    "Zacvič se mnou naživo nebo online. Provedu tě kondičním tréninkem a pomohu ti vybudovat svaly i vytvarovat postavu. Cvičíme s milou partou nebo individuálně — jak ti to lépe sedí.",
  benefits: [
    { _key: "b1", text: "Naučíš se správnou techniku cvičení a zpevníš střed těla" },
    { _key: "b2", text: "Cvičení ti pomůže ke krásné postavě i silnému, funkčnímu tělu" },
    { _key: "b3", text: "Z lekce odejdeš s dobrou náladou — milá atmosféra a maximální podpora" },
    { _key: "b4", text: "Kombinujeme silový trénink, kondiční cvičení a vlastní váhu" },
    { _key: "b5", text: "Každý cvik ukážu ve více variantách — každá si najde tu svoji" }
  ],
  steps: [
    {
      _key: "s1",
      title: "Skupinové lekce v Benátkách nad Jizerou",
      description:
        "Každý čtvrtek 18:00–19:00 v TJ Sokol Benátky nad Jizerou. Za hezkého počasí cvičíme venku. Cena 120 Kč/lekce."
    },
    {
      _key: "s2",
      title: "Individuální trénink na míru",
      description:
        "60 minut, součástí je diagnostika pohybového aparátu. Cvičíme u tebe doma, venku nebo v sokolovně. Cena 890 Kč."
    },
    {
      _key: "s3",
      title: "Vyber si variantu a napiš mi",
      description:
        "Skupinová lekce nebo individuální trénink — domluváme se přes formulář níže nebo na info@zdravimebavi.cz."
    }
  ],
  testimonials: [
    {
      _key: "t1",
      quote:
        "Na tréninky chodím pravidelně. Líbí se mi kombinace silového a kondičního cvičení — lekce je pokaždé trochu jiná a proto mě vždycky baví. Také je super tvůj pozitivní přístup, který vždycky namotivuje k lepším výkonům.",
      author: "Ivana Staňková, maminka na mateřské dovolené"
    }
  ],
  leadFormKey: "lekce-cviceni",
  seo: {
    metaTitle: "Tréninky a lekce cvičení | Zdraví mě baví",
    metaDescription:
      "Skupinové lekce cvičení v Benátkách nad Jizerou nebo individuální trénink na míru. Kondice, správná technika a dobrá nálada.",
    canonicalUrl: "https://www.zdravimebavi.cz/lekce-cviceni",
    noIndex: false
  }
};

// ─── offerPage: e-book-jak-sestavit-jidelnicek ──────────────────────────────

const ebookJidelnicek = {
  _id: "offerPage-e-book-jak-sestavit-jidelnicek",
  _type: "offerPage",
  title: "E-book: Manuál pro mámy",
  slug: { _type: "slug", current: "e-book-jak-sestavit-jidelnicek" },
  productKey: "e-book-jidelnicek",
  excerpt:
    "Provede tě krok za krokem k jídelníčku, který ti dodá energii, podpoří tvé zdraví a pomůže ti k vysněné postavě. Už nikdy žádné diety a stres z jídla. Vyřeš svůj jídelníček jednou provždy.",
  productPrice: "1 485 Kč",
  whatYouGet: [
    { _key: "w1", text: "Přehledný návod, jak sestavit každé jídlo a kolikrát denně jíst" },
    { _key: "w2", text: "Úpravy jídelníčku pro hubnutí, udržování, přibírání a jídlo před i po sportu" },
    { _key: "w3", text: "Upozornění na nejčastější chyby a tipy, jak být úspěšná" },
    { _key: "w4", text: "Significance jednotlivých složek jídla a konkrétní potraviny, kde je najít" },
    { _key: "w5", text: "34 stran plných hodnotných informací bez zbytečných výplní" }
  ],
  forWhom: [
    { _key: "f1", text: "Mámy, které chtějí zhubnout bez diet a stresu z jídla" },
    { _key: "f2", text: "Ženy, které nemají čas věnovat se jídlu celý den" },
    { _key: "f3", text: "Ty, kdo hledají jednoduchý a srozumitelný návod na zdravý jídelníček" },
    { _key: "f4", text: "Ženy, které chtějí jíst normálně a stále dosahovat výsledků" }
  ],
  checkoutMode: "leadOnly",
  seo: {
    metaTitle: "E-book Manuál pro mámy | Zdraví mě baví",
    metaDescription:
      "Jak sestavit jídelníček, který zvládneš dodržet za každé situace. Průvodce výživou pro zaneprázdněné ženy. 1 485 Kč.",
    canonicalUrl: "https://www.zdravimebavi.cz/e-book-jak-sestavit-jidelnicek",
    noIndex: false
  }
};

// ─── offerPage: zhubni-bez-pocitani-kalorii ─────────────────────────────────

const zhubniWebinar = {
  _id: "offerPage-zhubni-bez-pocitani-kalorii",
  _type: "offerPage",
  title: "Zhubni bez počítání kalorií",
  slug: { _type: "slug", current: "zhubni-bez-pocitani-kalorii" },
  productKey: "webinar-zhubni",
  excerpt:
    "Zjistíš, jak si jednoduše poskládat jídlo za každé situace, abys hubla — i když vaříš pro rodinu, jíš v restauraci nebo máš nabitý program.",
  whatYouGet: [
    { _key: "w1", text: "Na co si dát pozor, když začínáš se zdravým životním stylem" },
    { _key: "w2", text: "Základy výživy, na kterých budeš stavět" },
    { _key: "w3", text: "Kolikrát denně jíst a co — jednoduše a srozumitelně" },
    { _key: "w4", text: "Pravidlo 100/100, které moje klientky milují" }
  ],
  forWhom: [
    { _key: "f1", text: "Ženy, které chtějí zhubnout bez počítání kalorií a bez diet" },
    { _key: "f2", text: "Maminky v kolotoči rodiny a práce, které chtějí dobře jíst" },
    { _key: "f3", text: "Ty, kdo chtějí srozumitelný a praktický přístup k výživě" }
  ],
  checkoutMode: "leadOnly",
  seo: {
    metaTitle: "Zhubni bez počítání kalorií | Zdraví mě baví",
    metaDescription:
      "Webinář zdarma: Zjistíš, jak si jednoduše poskládat jídlo za každé situace, abys hubla bez počítání kalorií.",
    canonicalUrl: "https://www.zdravimebavi.cz/zhubni-bez-pocitani-kalorii",
    noIndex: false
  }
};

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Seeding service & offer pages → ${projectId}/${dataset}\n`);

  const docs = [
    { doc: osobniKonzultace, label: "servicePage: osobni-konzultace" },
    { doc: lekceCviceni, label: "servicePage: lekce-cviceni" },
    { doc: ebookJidelnicek, label: "offerPage: e-book-jak-sestavit-jidelnicek" },
    { doc: zhubniWebinar, label: "offerPage: zhubni-bez-pocitani-kalorii" }
  ];

  for (const { doc, label } of docs) {
    try {
      await client.createOrReplace(doc);
      console.log(`✅  ${label}`);
    } catch (err) {
      console.error(`❌  ${label}:`, (err as Error).message);
    }
  }

  console.log("\nHotovo. Stránky jsou nyní v Sanity — refresh v prohlížeči by měl zobrazit nové šablony.");
}

main().catch((err) => {
  console.error("❌  Chyba:", err.message);
  process.exit(1);
});
