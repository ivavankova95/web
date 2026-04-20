import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) { console.error("❌  Chybí NEXT_PUBLIC_SANITY_PROJECT_ID"); process.exit(1); }
if (!token) { console.error("❌  Chybí SANITY_API_WRITE_TOKEN"); process.exit(1); }

const client = createClient({ projectId, dataset, apiVersion: "2026-04-11", token, useCdn: false });

const FOOTER_LINKS = [
  { label: "Kontakt", href: "/napis-mi", openInNewTab: false, variant: "default" },
  { label: "E-book", href: "/e-book-jak-sestavit-jidelnicek", openInNewTab: false, variant: "default" },
  { label: "Online kurz", href: "/zhubni-bez-pocitani-kalorii", openInNewTab: false, variant: "default" },
];

async function main() {
  console.log(`Updating footer nav → ${projectId}/${dataset}`);
  await client.patch("footer-main").set({ primaryLinks: FOOTER_LINKS }).commit();
  console.log("✅  Footer nav aktualizován.");
}

main().catch((err) => { console.error("❌  Chyba:", err.message); process.exit(1); });
