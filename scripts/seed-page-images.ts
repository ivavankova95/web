/**
 * Nahraje obrázky ze snapshot/assets do Sanity a napatchuje dokumenty.
 *
 * Použití:
 *   pnpm dotenv -e .env.local tsx scripts/seed-page-images.ts
 */

import { createClient } from "@sanity/client";
import { createReadStream } from "node:fs";
import path from "node:path";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) { console.error("❌  Chybí NEXT_PUBLIC_SANITY_PROJECT_ID"); process.exit(1); }
if (!token)     { console.error("❌  Chybí SANITY_API_WRITE_TOKEN"); process.exit(1); }

const client = createClient({ projectId, dataset, apiVersion: "2026-04-11", token, useCdn: false });

const ASSETS = path.resolve(process.cwd(), "snapshot/assets/images");

// ─── Nahrání jednoho obrázku ─────────────────────────────────────────────────

type SanityAsset = { _id: string; url: string };

async function upload(filename: string): Promise<SanityAsset> {
  const filePath = path.join(ASSETS, filename);
  const ext = path.extname(filename).slice(1).toLowerCase();
  const mimeType =
    ext === "jpg" || ext === "jpeg" ? "image/jpeg" :
    ext === "png"  ? "image/png"  :
    ext === "webp" ? "image/webp" :
    "image/jpeg";

  const asset = await client.assets.upload("image", createReadStream(filePath), {
    filename,
    contentType: mimeType
  });
  return asset as unknown as SanityAsset;
}

function ref(assetId: string, key: string) {
  return {
    _key: key,
    _type: "image",
    asset: { _type: "reference", _ref: assetId }
  };
}

// ─── Konfigurace obrázků pro každou stránku ──────────────────────────────────

const PAGES = [
  // první dvě stránky jsou hotové — přeskočit při rerun
  // {
  //   docId: "servicePage-osobni-konzultace",
  // },
  // {
  //   docId: "servicePage-lekce-cviceni",
  // },
  {
    docId: "servicePage-osobni-konzultace",
    hero: "d64fc6d760ca__64609aab5a61c167cdb158b4_DSC02320.jpg",
    referenceFiles: [
      "1758d1e80d5d__6460b0dc3cd46f902830f882_peta_kralikova.jpg",
      "5ded891d2f4c__64ff3893bbb1fafbff388405_IMG_6773.jpeg",
      "236959fb6ad4__64d10af5c5c3ff4ded63c1f9_konzultace_ref4.jpg",
      "505b19ddd343__64d10af51ceaa7987fc6ae9e_konzultace_ref3.jpg",
      "26caa29cac03__646124bd46818cacc538506b_1.jpg"
    ]
  },
  {
    docId: "servicePage-lekce-cviceni",
    hero: "76e0df0e7658__646a78359edfdb7aedb784b8_cviceni-1-.jpg",
    referenceFiles: [
      "55fe9db9b386__64704ad2dc557cbd3f2efe66_Mask-20recenze-20cviceni-1-.png",
      "d87c20e966ed__64d10cd80150bbca4a2cba37_cviceni_ref1.jpg",
      "191837f554ad__64d10cd850040191c74733c1_cviceni_ref2.jpg",
      "35d17d3195df__647048d54f90b915dad25155_IMG_2827-1-.jpg",
      "36db8afa8720__6509a67c73c26c897f344b10_IMG_6323.jpg"
    ]
  },
  {
    docId: "offerPage-e-book-jak-sestavit-jidelnicek",
    hero: "f3f977e96100__66dff65b0990f6008059890b_E-book-20mockup-20kniha-201-1-.png",
    referenceFiles: [
      "c166fd450afb__66a90f5c10e8fb088f9c27db_Na-CC-81vrh-20bez-20na-CC-81zvu-5-.jpg",
      "0ad412c37989__66a90f5b62210e947efc8a3e_Na-CC-81vrh-20bez-20na-CC-81zvu-7-.jpg",
      "69ce12091919__66a90f5b5c686ac89c7f80c5_Na-CC-81vrh-20bez-20na-CC-81zvu-6-.jpg",
      "49bbac1f40cb__66e06df04c513a944a7fd958_Ebook_recenze.jpeg",
      "52ebd5158911__66e06df0fec5f6dd0ffa7c10_Ebook_recenze2.jpeg",
      "1b95e7dc2333__66e1a8beff1798bdf412754e_IMG_0600.jpeg"
    ]
  },
  {
    docId: "offerPage-zhubni-bez-pocitani-kalorii",
    hero: "056662070f68__66f13c63723b5b9b621d8513_banner-20webina-CC-81r-CC-8C-20na-20web-20-PC-1-1-.png",
    referenceFiles: [
      "c166fd450afb__66a90f5c10e8fb088f9c27db_Na-CC-81vrh-20bez-20na-CC-81zvu-5-.jpg",
      "0ad412c37989__66a90f5b62210e947efc8a3e_Na-CC-81vrh-20bez-20na-CC-81zvu-7-.jpg",
      "69ce12091919__66a90f5b5c686ac89c7f80c5_Na-CC-81vrh-20bez-20na-CC-81zvu-6-.jpg",
      "04d000b83cb1__66a911f7488b20f7060c605a_IMG_9435.jpeg",
      "cc1e1b30b997__66a911f7f3c5d97aaee94a8a_IMG_9434.jpeg",
      "8b3aac724fa6__66a911f797cd5f7a9cc730c2_IMG_9437.jpeg",
      "a9496c56d3e1__66a911f7c6947b23762f4ae6_IMG_9436.jpeg"
    ]
  }
];

// ─── Main ─────────────────────────────────────────────────────────────────────

// Cache pro již nahrané soubory (sdílené mezi stránkami — proměny jsou na 2 stránkách)
const uploadCache = new Map<string, string>();

async function uploadCached(filename: string): Promise<string> {
  if (uploadCache.has(filename)) {
    return uploadCache.get(filename)!;
  }
  const asset = await upload(filename);
  uploadCache.set(filename, asset._id);
  return asset._id;
}

async function main() {
  console.log(`Nahrávám obrázky → ${projectId}/${dataset}\n`);

  for (const page of PAGES) {
    console.log(`📄  ${page.docId}`);

    // Hero image
    process.stdout.write(`   hero: ${path.basename(page.hero)} … `);
    const heroId = await uploadCached(page.hero);
    console.log("✓");

    // Reference images
    const referenceRefs = [];
    for (let i = 0; i < page.referenceFiles.length; i++) {
      const file = page.referenceFiles[i];
      process.stdout.write(`   ref[${i}]: ${path.basename(file)} … `);
      const id = await uploadCached(file);
      referenceRefs.push(ref(id, `ref-${i}`));
      console.log("✓");
    }

    // Patch dokument
    await client
      .patch(page.docId)
      .set({
        heroImage: {
          _type: "image",
          asset: { _type: "reference", _ref: heroId }
        },
        referenceImages: referenceRefs
      })
      .commit();

    console.log(`   ✅  dokument patchnut\n`);
  }

  console.log("Hotovo!");
}

main().catch((err) => {
  console.error("❌  Chyba:", err.message);
  process.exit(1);
});
