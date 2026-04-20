/**
 * Vytvoří Sanity dokumenty pro zbývající stránky (střední + nízká priorita).
 *
 * Pokryté stránky:
 *   servicePage: cviceni-v-benatkach-nad-jizerou, skupinove-lekce-benatky-nad-jizerou,
 *                individualni-treninky-benatky-nad-jizerou-a-okoli, konzultace-zdarma
 *   offerPage:   pruvodce, letni-prazdninova-vyzva, kalendar
 *   legalPage:   gdpr, obchodni-podminky, cookies, odpovednost
 *   page:        napis-mi
 *
 * Použití:
 *   pnpm dotenv -e .env.local tsx scripts/seed-remaining-pages.ts
 */

import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) { console.error("❌  Chybí NEXT_PUBLIC_SANITY_PROJECT_ID"); process.exit(1); }
if (!token)     { console.error("❌  Chybí SANITY_API_WRITE_TOKEN"); process.exit(1); }

const client = createClient({ projectId, dataset, apiVersion: "2026-04-11", token, useCdn: false });

// ─── Konverze snapshot bloků na PortableText ──────────────────────────────────

type SnapshotBlock =
  | { type: "heading"; level: string; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list_item"; text: string }
  | { type: "image"; src: string; alt?: string }
  | { type: "cta"; text: string; href: string };

function snapshotToPortableText(blocks: SnapshotBlock[], skipFirstH1 = false): unknown[] {
  const result: unknown[] = [];
  let keyIndex = 0;
  const key = () => `k${++keyIndex}`;
  let firstH1Skipped = false;

  for (const block of blocks) {
    // Skip the first h1 heading to avoid duplicating the document title
    if (skipFirstH1 && !firstH1Skipped && block.type === "heading" && block.level === "1") {
      firstH1Skipped = true;
      continue;
    }
    if (block.type === "heading") {
      const styleMap: Record<string, string> = { "1": "h1", "2": "h2", "3": "h3" };
      const text = block.text.trim();
      if (!text || text === "‍") continue;
      result.push({
        _type: "block", _key: key(),
        style: styleMap[block.level] ?? "normal",
        markDefs: [],
        children: [{ _type: "span", _key: key(), text, marks: [] }]
      });
    } else if (block.type === "paragraph") {
      const text = block.text.trim();
      if (!text || text === "‍") continue;
      result.push({
        _type: "block", _key: key(),
        style: "normal",
        markDefs: [],
        children: [{ _type: "span", _key: key(), text, marks: [] }]
      });
    } else if (block.type === "list_item") {
      const text = block.text.trim();
      if (!text) continue;
      result.push({
        _type: "block", _key: key(),
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [{ _type: "span", _key: key(), text, marks: [] }]
      });
    }
    // images and ctas are skipped for legal pages
  }
  return result;
}

function readSnapshotBlocks(slug: string): SnapshotBlock[] {
  const filePath = path.resolve(process.cwd(), `snapshot/pages-json/${slug}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return data.blocks ?? [];
}

// ─── Dokumenty ───────────────────────────────────────────────────────────────

const documents: unknown[] = [

  // ── SERVICE PAGES ──────────────────────────────────────────────────────────

  {
    _id: "servicePage-cviceni-v-benatkach-nad-jizerou",
    _type: "servicePage",
    title: "Cvičení v Benátkách nad Jizerou",
    slug: { _type: "slug", current: "cviceni-v-benatkach-nad-jizerou" },
    serviceKey: "cviceni-v-benatkach",
    excerpt: "Skupinové lekce pro sílu a kondici — intervalový trénink, posilování s vlastní vahou i pomůckami. Každý čtvrtek 18:00–19:00, TJ Sokol Benátky nad Jizerou.",
    benefits: [
      { _key: "b1", text: "Cvičíme každý čtvrtek 18:00–19:00 v benátské sokolovně (od jara do podzimu venku)" },
      { _key: "b2", text: "Cena 120 Kč za lekci — platíš hotově nebo přes QR kód" },
      { _key: "b3", text: "Intervalový trénink: 45 vteřin práce, 15 vteřin pauza — vybereš si obtížnost" },
      { _key: "b4", text: "Cviky ve více variantách pro začátečníky i pokročilé" },
      { _key: "b5", text: "Profesionální vedení, individuální přístup a skvělá parta" }
    ],
    steps: [
      {
        _key: "s1",
        title: "Přihlas se přes formulář",
        description: "Napiš mi, že chceš na lekci přijít. Přidám tě do WhatsApp skupiny."
      },
      {
        _key: "s2",
        title: "Potvrď účast v den lekce",
        description: "Ráno dopoledne vkládám do skupiny anketu — stačí označit Ano. Lekce se koná při min. 5 zájemcích."
      },
      {
        _key: "s3",
        title: "Přijď a zacvič si",
        description: "Sokolovna Benátky, Ladislava Vágnera 87/17 — 1. patro. Vezmi si pití a ručník."
      }
    ],
    testimonials: [
      {
        _key: "t1",
        quote: "Na tréninky chodím pravidelně. Líbí se mi kombinace silového a kondičního cvičení. Lekce je pokaždé trochu jiná a proto mě vždycky baví. Také je super tvůj pozitivní přístup, který vždycky k lepším výkonům namotivuje.",
        author: "Ivana Staňková, maminka na mateřské dovolené"
      }
    ],
    leadFormKey: "cviceni-v-benatkach"
  },

  {
    _id: "servicePage-skupinove-lekce-benatky-nad-jizerou",
    _type: "servicePage",
    title: "Skupinové lekce cvičení v Benátkách nad Jizerou",
    slug: { _type: "slug", current: "skupinove-lekce-benatky-nad-jizerou" },
    serviceKey: "skupinove-lekce",
    excerpt: "Přijď si zacvičit na skupinové lekce do Benátek nad Jizerou. Posilování a kondice s certifikovanou trenérkou Ivou Vaňkovou.",
    benefits: [
      { _key: "b1", text: "Skupinová motivace a profesionální vedení" },
      { _key: "b2", text: "Trénink ve variantách pro začátečníky i pokročilé" },
      { _key: "b3", text: "Správná technika cvičení pod dohledem trenérky" }
    ],
    leadFormKey: "skupinove-lekce"
  },

  {
    _id: "servicePage-individualni-treninky-benatky-nad-jizerou-a-okoli",
    _type: "servicePage",
    title: "Individuální tréninky v Benátkách nad Jizerou",
    slug: { _type: "slug", current: "individualni-treninky-benatky-nad-jizerou-a-okoli" },
    serviceKey: "individualni-treninky",
    excerpt: "Individuální tréninky na míru tvým cílům a možnostem. Workoutové hřiště nebo příroda v okolí Benátek nad Jizerou.",
    benefits: [
      { _key: "b1", text: "Trénink přizpůsobený tvým cílům a zdravotnímu stavu" },
      { _key: "b2", text: "Správná technika — cvičíš efektivně a bezpečně" },
      { _key: "b3", text: "Flexibilní termíny dle tvých možností" }
    ],
    leadFormKey: "individualni-treninky"
  },

  {
    _id: "servicePage-konzultace-zdarma",
    _type: "servicePage",
    title: "Konzultace zdarma",
    slug: { _type: "slug", current: "konzultace-zdarma" },
    serviceKey: "konzultace-zdarma",
    excerpt: "Vyplň kontaktní formulář a krátce popiš téma, kterému se chceš věnovat. Do tří dnů ti pošlu volné termíny a domluvíme se na detailech.",
    leadFormKey: "konzultace-zdarma"
  },

  // ── OFFER PAGES ────────────────────────────────────────────────────────────

  {
    _id: "offerPage-pruvodce",
    _type: "offerPage",
    title: "Průvodce výživou a pohybem",
    slug: { _type: "slug", current: "pruvodce" },
    productKey: "pruvodce",
    excerpt: "Individuální průvodce výživou a pohybem pro zaneprázdněné ženy. Metoda bez diet na celý život — zhubneš, získáš energii a přestaneš se kvůli jídlu stresovat.",
    whatYouGet: [
      { _key: "w1", text: "Tématické kapitoly s výživovými doporučeními, díky kterým konečně zhubneš" },
      { _key: "w2", text: "Inspirativní jídelníček na 7 dní s nákupním seznamem a recepty" },
      { _key: "w3", text: "Video tréninky — efektivní lekce do 20 minut (jóga, posilování, kondice)" },
      { _key: "w4", text: "Plánovač pohybu, cílů a priorit na celý rok" },
      { _key: "w5", text: "Přístup do členské sekce s průběžnou aktualizací obsahu" }
    ],
    forWhom: [
      { _key: "f1", text: "Zaneprázdněné ženy a maminky, které chtějí zhubnout bez diet" },
      { _key: "f2", text: "Ženy, které jsou frustrované neúspěšnými pokusy o hubnutí" },
      { _key: "f3", text: "Každá, která si chce z jídla i pohybu opět udělat radost, ne povinnost" }
    ],
    checkoutMode: "leadOnly"
  },

  {
    _id: "offerPage-letni-prazdninova-vyzva",
    _type: "offerPage",
    title: "Letní prázdninová výzva",
    slug: { _type: "slug", current: "letni-prazdninova-vyzva" },
    productKey: "letni-prazdninova-vyzva",
    excerpt: "Pěkně pálivá plážová pecka pro akční ženy. 10 minut posilování s důrazem na pevný střed těla — vedeno Ivou Vaňkovou.",
    whatYouGet: [
      { _key: "w1", text: "10minutový trénink posilování se zaměřením na pevný střed těla" },
      { _key: "w2", text: "Vedení certifikovanou kondiční trenérkou Ivou Vaňkovou" }
    ],
    forWhom: [
      { _key: "f1", text: "Akční ženy, které chtějí efektivně zacvičit i v létě" }
    ],
    checkoutMode: "leadOnly"
  },

  {
    _id: "offerPage-kalendar",
    _type: "offerPage",
    title: "Adventní kalendář",
    slug: { _type: "slug", current: "kalendar" },
    productKey: "adventni-kalendar",
    excerpt: "Zdarma — přidej se k otevírání adventního kalendáře! Každý den malý dárek pro lepší stravování, pohyb a péči o sebe.",
    whatYouGet: [
      { _key: "w1", text: "24 denních dárků pro lepší stravování a pohyb" },
      { _key: "w2", text: "Možnost výhry individuální výživové konzultace a originální čelenky" },
      { _key: "w3", text: "Každodenní inspirace pro zdravý životní styl" }
    ],
    forWhom: [
      { _key: "f1", text: "Každá žena, která chce věnovat v adventu chvilku svému zdraví a pohodě" }
    ],
    checkoutMode: "leadOnly"
  },

  // ── PAGE ───────────────────────────────────────────────────────────────────

  {
    _id: "page-napis-mi",
    _type: "page",
    title: "Napiš mi",
    slug: { _type: "slug", current: "napis-mi" },
    excerpt: "Máš otázku ohledně výživy, cvičení nebo zdravého životního stylu? Napiš mi — ráda ti odpovím.",
    pageBuilder: [
      {
        _type: "formBlock",
        _key: "form1",
        title: "Napiš mi",
        description: "Ráda ti odpovím na jakékoli otázky ohledně výživy, cvičení nebo zdravého životního stylu.",
        formKey: "napis-mi"
      }
    ]
  }
];

// ─── Legal pages — načíst ze snapshot ────────────────────────────────────────

const legalPages = [
  { slug: "gdpr",              id: "legalPage-gdpr",              title: "Podmínky ochrany osobních údajů" },
  { slug: "obchodni-podminky", id: "legalPage-obchodni-podminky", title: "Obchodní podmínky" },
  { slug: "cookies",           id: "legalPage-cookies",           title: "Cookie soubory" },
  { slug: "odpovednost",       id: "legalPage-odpovednost",       title: "Moje odpovědnost" }
];

for (const lp of legalPages) {
  const blocks = readSnapshotBlocks(lp.slug);
  const content = snapshotToPortableText(blocks, true);
  documents.push({
    _id: lp.id,
    _type: "legalPage",
    title: lp.title,
    slug: { _type: "slug", current: lp.slug },
    content
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Nahrávám dokumenty → ${projectId}/${dataset}\n`);

  for (const doc of documents as Array<{ _id: string; _type: string }>) {
    process.stdout.write(`📄  ${doc._type}:${doc._id} … `);
    await client.createOrReplace(doc);
    console.log("✓");
  }

  console.log(`\n✅  Hotovo — ${documents.length} dokumentů vytvořeno/aktualizováno.`);
}

main().catch((err) => {
  console.error("❌  Chyba:", err.message);
  process.exit(1);
});
