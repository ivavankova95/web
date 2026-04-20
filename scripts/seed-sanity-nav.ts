/**
 * Seed script — aktualizuje navigation dokument v Sanity.
 *
 * Použití:
 *   SANITY_API_WRITE_TOKEN=<token> pnpm tsx scripts/seed-sanity-nav.ts
 *
 * Nebo s .env.local:
 *   pnpm dotenv -e .env.local tsx scripts/seed-sanity-nav.ts
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

const NAV_ITEMS = [
  { label: "O mně", href: "/o-mne", openInNewTab: false, variant: "default" },
  { label: "Blog", href: "/blog", openInNewTab: false, variant: "default" },
  { label: "E-book", href: "/e-book-jak-sestavit-jidelnicek", openInNewTab: false, variant: "default" },
  { label: "Online kurz", href: "/zhubni-bez-pocitani-kalorii", openInNewTab: false, variant: "default" }
];

const CTA = {
  ctaLabel: "Členská sekce",
  ctaHref: "https://app.zdravimebavi.cz/"
};

async function main() {
  console.log(`Seeding navigation → ${projectId}/${dataset}`);

  await client
    .patch("navigation-main")
    .set({
      title: "Main navigation",
      items: NAV_ITEMS,
      ...CTA
    })
    .commit();

  console.log("✅  Navigation dokument aktualizován.");
}

main().catch((err) => {
  console.error("❌  Chyba:", err.message);
  process.exit(1);
});
