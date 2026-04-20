/**
 * Nahraje obrázky pro zbývající stránky (střední + nízká priorita).
 *
 * Použití:
 *   pnpm dotenv -e .env.local tsx scripts/seed-remaining-images.ts
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

const uploadCache = new Map<string, string>();

async function uploadCached(filename: string): Promise<string> {
  if (uploadCache.has(filename)) return uploadCache.get(filename)!;
  const asset = await upload(filename);
  uploadCache.set(filename, asset._id);
  return asset._id;
}

function imageRef(assetId: string) {
  return { _type: "image", asset: { _type: "reference", _ref: assetId } };
}

function refItem(assetId: string, key: string) {
  return { _key: key, _type: "image", asset: { _type: "reference", _ref: assetId } };
}

// ─── Konfigurace obrázků ──────────────────────────────────────────────────────

const PAGES = [
  {
    docId: "servicePage-cviceni-v-benatkach-nad-jizerou",
    hero: "c709e8434f58__64609aab46818cacc5c61e27_DSC02394.jpg",
    referenceFiles: [
      "55fe9db9b386__64704ad2dc557cbd3f2efe66_Mask-20recenze-20cviceni-1-.png",
      "d87c20e966ed__64d10cd80150bbca4a2cba37_cviceni_ref1.jpg",
      "191837f554ad__64d10cd850040191c74733c1_cviceni_ref2.jpg",
      "36db8afa8720__6509a67c73c26c897f344b10_IMG_6323.jpg"
    ]
  },
  {
    docId: "servicePage-skupinove-lekce-benatky-nad-jizerou",
    hero: "36db8afa8720__6509a67c73c26c897f344b10_IMG_6323.jpg",
    referenceFiles: []
  },
  {
    docId: "servicePage-individualni-treninky-benatky-nad-jizerou-a-okoli",
    hero: "35d17d3195df__647048d54f90b915dad25155_IMG_2827-1-.jpg",
    referenceFiles: []
  },
  {
    docId: "servicePage-konzultace-zdarma",
    hero: "2d26f82237e3__64692400ab8a9b8f10c3ae00_DSC02101_ctverec-1-.jpg",
    referenceFiles: []
  },
  {
    docId: "offerPage-pruvodce",
    hero: "d184a9df25f7__6596ce6f4372ca5db646aadf_uvodni_mockup_lepsi_kvalita-2.png",
    referenceFiles: [
      "c166fd450afb__66a90f5c10e8fb088f9c27db_Na-CC-81vrh-20bez-20na-CC-81zvu-5-.jpg",
      "0ad412c37989__66a90f5b62210e947efc8a3e_Na-CC-81vrh-20bez-20na-CC-81zvu-7-.jpg",
      "69ce12091919__66a90f5b5c686ac89c7f80c5_Na-CC-81vrh-20bez-20na-CC-81zvu-6-.jpg",
      "8c36bdcc1f58__6596da1a8b6b807361567a66_3.png",
      "631fcba7bd3a__6596da19e4136d5b0e85d586_2.png",
      "b8bbc203f0f4__6596da1874b05d8261fe0bea_4.png"
    ]
  },
  {
    docId: "offerPage-letni-prazdninova-vyzva",
    hero: "c709e8434f58__64609aab46818cacc5c61e27_DSC02394.jpg",
    referenceFiles: []
  },
  {
    docId: "offerPage-kalendar",
    hero: "ebfd6b0263ec__653e733da43278e1ab4662dd_ADVENTNI-20KALENDAR.png",
    referenceFiles: []
  }
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Nahrávám obrázky → ${projectId}/${dataset}\n`);

  for (const page of PAGES) {
    console.log(`📄  ${page.docId}`);

    process.stdout.write(`   hero: ${path.basename(page.hero)} … `);
    const heroId = await uploadCached(page.hero);
    console.log("✓");

    const referenceRefs = [];
    for (let i = 0; i < page.referenceFiles.length; i++) {
      const file = page.referenceFiles[i];
      process.stdout.write(`   ref[${i}]: ${path.basename(file)} … `);
      const id = await uploadCached(file);
      referenceRefs.push(refItem(id, `ref-${i}`));
      console.log("✓");
    }

    const patch = client.patch(page.docId).set({ heroImage: imageRef(heroId) });
    if (referenceRefs.length > 0) {
      patch.set({ referenceImages: referenceRefs });
    }
    await patch.commit();

    console.log(`   ✅  patchnuto\n`);
  }

  console.log("Hotovo!");
}

main().catch((err) => {
  console.error("❌  Chyba:", err.message);
  process.exit(1);
});
