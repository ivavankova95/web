import type { MetadataRoute } from "next";
import { getSnapshotSitemapEntries } from "@/lib/content/snapshot";

const SITE_URL = "https://www.zdravimebavi.cz";
const EXCLUDED_ROUTES = new Set([
  "/404",
  "/search",
  "/styleguide",
  "/kalendar",
  "/letni-prazdninova-vyzva",
  "/pruvodce",
  "/skupinove-lekce-benatky-nad-jizerou",
  "/cviceni-v-benatkach-nad-jizerou-formular",
  "/konzultace-zdarma",
  "/osobni-konzultace-objednavka",
  "/formular---pruvodce-vyzivou-a-pohybem"
]);

function getPriority(route: string) {
  if (route === "/") {
    return 1;
  }

  if (route === "/blog") {
    return 0.9;
  }

  if (route.startsWith("/clanky/")) {
    return 0.8;
  }

  if (route.startsWith("/kategorie/")) {
    return 0.75;
  }

  if (route.startsWith("/obchodni-podminky") || route.startsWith("/gdpr") || route.startsWith("/cookies")) {
    return 0.3;
  }

  return 0.7;
}

function getChangeFrequency(route: string): MetadataRoute.Sitemap[number]["changeFrequency"] {
  if (route === "/" || route === "/blog") {
    return "weekly";
  }

  if (route.startsWith("/clanky/") || route.startsWith("/kategorie/")) {
    return "monthly";
  }

  return "monthly";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getSnapshotSitemapEntries();

  return entries
    .filter((entry) => !EXCLUDED_ROUTES.has(entry.route))
    .map((entry) => ({
    url: entry.canonical || `${SITE_URL}${entry.route === "/" ? "/" : entry.route}`,
    lastModified: entry.lastModified,
    changeFrequency: getChangeFrequency(entry.route),
    priority: getPriority(entry.route),
    images: entry.imageUrls
    }));
}
