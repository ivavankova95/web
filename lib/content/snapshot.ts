import type { Metadata } from "next";
import { cache } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";

export type SnapshotBlock =
  | { type: "heading"; level?: string; text?: string }
  | { type: "paragraph"; text?: string }
  | { type: "image"; src?: string; alt?: string }
  | { type: "list_item"; text?: string }
  | { type: "cta"; text?: string; href?: string }
  | { type: "caption"; text?: string }
  | { type: "blockquote"; text?: string }
  | Record<string, unknown>;

export type SnapshotForm = {
  name?: string;
  id?: string;
  method?: string;
  action?: string;
  fields?: Array<{
    tag?: string;
    type?: string;
    name?: string;
    required?: boolean;
  }>;
};

export type SnapshotPage = {
  title: string;
  slug: string;
  url: string;
  page_type: string;
  canonical?: string;
  meta_description?: string;
  headings: string[];
  images: Array<{
    src?: string;
    alt?: string;
    source_url?: string;
    local_path?: string;
  }>;
  ctas: Array<{ text?: string; href?: string; type?: string }>;
  forms: SnapshotForm[];
  blocks: SnapshotBlock[];
};

export type SnapshotSiteLink = {
  label: string;
  href: string;
};

export type SnapshotSiteShell = {
  brand: {
    name: string;
    description: string;
    logoPath?: string;
  };
  primaryNav: SnapshotSiteLink[];
  footerNav: SnapshotSiteLink[];
  legalNav: SnapshotSiteLink[];
  externalNav: Array<SnapshotSiteLink & { external?: boolean }>;
};

export type SnapshotArticleSummary = {
  slug: string;
  title: string;
  description: string;
  href: string;
  canonical: string;
  imageUrl?: string;
  imageAlt?: string;
  categorySlugs: string[];
};

export type SnapshotCategorySummary = {
  slug: string;
  title: string;
  href: string;
  description: string;
  articleCount: number;
};

export type SnapshotRecipeData = {
  name: string;
  description: string;
  imageUrls: string[];
  ingredients: string[];
  instructions: string[];
};

export type SnapshotFaqItem = {
  question: string;
  answer: string;
};

const SNAPSHOT_DIR = path.join(process.cwd(), "snapshot", "pages-json");
const SITE_NAME = "Zdraví mě baví";
const SITE_URL = "https://www.zdravimebavi.cz";

const FORM_NAME_TO_KEY: Record<string, string> = {
  "wf-form-Skupinove_lekce-2": "skupinove_lekce",
  "wf-form-Get-In-Touch-Form": "kontakt",
  "wf-form-Individualni_treninky": "individualni_treninky",
  "wf-form-Osobni_konzultace": "osobni_konzultace",
  "wf-form-Konzultace_zdarma": "konzultace_zdarma"
};

const PRODUCT_KEY_BY_PATH: Record<string, string> = {
  "/e-book-jak-sestavit-jidelnicek": "ebook_jak_sestavit_jidelnicek",
  "/osobni-konzultace-objednavka": "osobni_konzultace",
  "/formular---pruvodce-vyzivou-a-pohybem": "pruvodce_vyzivou_a_pohybem"
};

const PRIMARY_NAV_CONFIG: SnapshotSiteLink[] = [
  { label: "O mně", href: "/o-mne" },
  { label: "Osobní konzultace", href: "/osobni-konzultace" },
  { label: "Průvodce", href: "/pruvodce" },
  { label: "E-book", href: "/e-book-jak-sestavit-jidelnicek" },
  { label: "Lekce cvičení", href: "/lekce-cviceni" },
  { label: "Blog", href: "/blog" }
];

const FOOTER_NAV_CONFIG: SnapshotSiteLink[] = [
  { label: "Konzultace zdarma", href: "/konzultace-zdarma" },
  { label: "Kontakt", href: "/napis-mi" },
  { label: "Kalendář", href: "/kalendar" }
];

const LEGAL_NAV_CONFIG: SnapshotSiteLink[] = [
  { label: "Cookies", href: "/cookies" },
  { label: "GDPR", href: "/gdpr" },
  { label: "Obchodní podmínky", href: "/obchodni-podminky" },
  { label: "Odpovědnost", href: "/odpovednost" }
];

const EXTERNAL_NAV_CONFIG: Array<SnapshotSiteLink & { external?: boolean }> = [
  { label: "Otevřít app", href: "https://app.zdravimebavi.cz/", external: true }
];

const SEO_OVERRIDES: Record<
  string,
  {
    title?: string;
    description?: string;
  }
> = {
  "/": {
    title: "Výživa, recepty a pohyb pro ženy | Zdraví mě baví",
    description:
      "Praktické články, recepty, cvičení a programy pro ženy, které chtějí zdravější tělo bez extrémů, diet a zbytečného stresu."
  },
  "/clanky/dort-k-prvnim-narozeninam": {
    title: "Dort k prvním narozeninám: zdravý recept pro roční dítě | Zdraví mě baví",
    description:
      "Ověřený zdravý recept na dort k prvním narozeninám pro roční dítě. Ingredience, postup, tipy na krém, zdobení i variantu bez cukru."
  },
  "/clanky/chia-pudink": {
    title: "Chia pudink přes noc: poměr, recept a tipy | Zdraví mě baví",
    description:
      "Jak připravit chia pudink přes noc, aby měl správnou konzistenci? Praktický recept, ideální poměr chia semínek a tekutiny i ověřené tipy."
  },
  "/clanky/brokolicova-omacka": {
    title: "Brokolicová omáčka: zdravý recept bez smetany | Zdraví mě baví",
    description:
      "Rychlá brokolicová omáčka ve zdravé veganské verzi. Jednoduchý recept, ingredience a postup pro syté jídlo hotové za pár minut."
  },
  "/clanky/arasidova-omacka": {
    title: "Arašídová omáčka: jednoduchý recept se zázvorem | Zdraví mě baví",
    description:
      "Krémová arašídová omáčka se zázvorem, kterou připravíš za pár minut. Hodí se k nudlím, zelenině i jako dip."
  },
  "/clanky/tvarohova-babovka": {
    title: "Tvarohová bábovka: zdravý a vláčný recept | Zdraví mě baví",
    description:
      "Nadýchaná tvarohová bábovka, která je jemná, voňavá a přitom zdravější než klasická verze. Ověřený recept krok za krokem."
  },
  "/clanky/plnene-datle-v-cokolade": {
    title: "Plněné datle v čokoládě: jednoduchý zdravý dezert | Zdraví mě baví",
    description:
      "Plněné datle v čokoládě jako rychlý a efektní zdravý dezert. Recept, ingredience a tipy na obměny."
  },
  "/clanky/obilna-kase-ctyrikrat-jinak": {
    title: "Obilná kaše 4x jinak: zdravá snídaně bez nudy | Zdraví mě baví",
    description:
      "Obilná kaše nemusí být jen ovesná. Inspirace na čtyři varianty kaše, které zasytí a zpestří zdravou snídani."
  },
  "/clanky/veganske-proteinove-tycinky-ktere-stoji-za-vyzkouseni": {
    title: "Veganské proteinové tyčinky: které stojí za vyzkoušení? | Zdraví mě baví",
    description:
      "Srovnání veganských proteinových tyčinek podle chuti, složení a praktičnosti. Které opravdu stojí za vyzkoušení?"
  },
  "/clanky/broskvovy-dort": {
    title: "Broskvový dort: zdravější recept s ovocem | Zdraví mě baví",
    description:
      "Lehký broskvový dort s korpusem ze sezamu a rozinek. Recept, postup a tipy na zdravější narozeninový dezert."
  },
  "/clanky/nejlepsi-ceske-podcasty-o-zdravem-zivotnim-stylu": {
    title: "Nejlepší české podcasty o zdravém životním stylu | Zdraví mě baví",
    description:
      "Výběr českých podcastů o zdravém životním stylu, výživě a pohybu, které stojí za poslech."
  },
  "/cviceni-v-benatkach-nad-jizerou": {
    title: "Cvičení v Benátkách nad Jizerou | Zdraví mě baví",
    description:
      "Skupinové i individuální cvičení v Benátkách nad Jizerou. Přehled lekcí, přístup a další kroky ke spolupráci."
  }
};

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toAbsoluteUrl(value?: string) {
  if (!value) {
    return undefined;
  }

  return value.startsWith("http://") || value.startsWith("https://") ? value : `${SITE_URL}${value}`;
}

function normalizeTitleKey(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizeHeadingKey(value: string) {
  return normalizeTitleKey(value).replace(/\?/g, "");
}

function extractFirstParagraph(page: SnapshotPage) {
  return page.blocks
    .filter((block): block is Extract<SnapshotBlock, { type: "paragraph" }> => block.type === "paragraph")
    .map((block) => asText(block.text))
    .find(Boolean);
}

function getPrimarySnapshotImage(page: SnapshotPage) {
  return (
    page.images.find((image) => image.source_url && !/(logo|podpis)/i.test(asText(image.alt))) ??
    page.images.find((image) => image.source_url)
  );
}

function getContentImageUrls(page: SnapshotPage) {
  return page.images
    .filter((image) => image.source_url && !/(logo|podpis)/i.test(asText(image.alt)))
    .map((image) => toAbsoluteUrl(image.source_url))
    .filter((value): value is string => Boolean(value));
}

function extractListingTitles(page: SnapshotPage) {
  return page.blocks
    .filter(
      (block): block is Extract<SnapshotBlock, { type: "heading"; level?: string; text?: string }> =>
        block.type === "heading" && block.level === "2"
    )
    .map((block) => asText(block.text))
    .filter(Boolean);
}

function extractSectionBlocks(page: SnapshotPage, headingMatchers: string[]) {
  const matcherKeys = headingMatchers.map(normalizeHeadingKey);
  const startIndex = page.blocks.findIndex(
    (block) =>
      block.type === "heading" &&
      matcherKeys.includes(normalizeHeadingKey(asText((block as { text?: string }).text)))
  );

  if (startIndex === -1) {
    return [];
  }

  const sectionBlocks: SnapshotBlock[] = [];

  for (let index = startIndex + 1; index < page.blocks.length; index += 1) {
    const block = page.blocks[index];
    if (block.type === "heading") {
      const level = Number((block as { level?: string }).level || "0");
      if (level <= 2) {
        break;
      }
    }
    sectionBlocks.push(block);
  }

  return sectionBlocks;
}

function extractRecipeIngredients(page: SnapshotPage) {
  return extractSectionBlocks(page, ["Ingredience", "Suroviny"])
    .flatMap((block) => {
      if (block.type === "paragraph") {
        return asText(block.text)
          .split(/\s{2,}|(?<=\.)\s+(?=[A-Z0-9])/)
          .map((item) => item.trim())
          .filter(Boolean);
      }

      if (block.type === "list_item") {
        return [asText(block.text)].filter(Boolean);
      }

      return [];
    })
    .filter(Boolean);
}

function extractRecipeInstructions(page: SnapshotPage) {
  const sectionBlocks = extractSectionBlocks(page, ["Jak na to", "Postup"]);
  const instructions: string[] = [];
  let currentStep = "";

  function flushStep() {
    const normalized = currentStep.replace(/\s+/g, " ").trim();
    if (normalized) {
      instructions.push(normalized);
    }
    currentStep = "";
  }

  for (const block of sectionBlocks) {
    if (block.type === "heading") {
      flushStep();
      currentStep = asText((block as { text?: string }).text);
      continue;
    }

    if (block.type === "paragraph" || block.type === "list_item") {
      const text = asText(block.text);
      if (!text) {
        continue;
      }

      currentStep = currentStep ? `${currentStep} ${text}` : text;
    }
  }

  flushStep();
  return instructions;
}

function extractFaqItems(page: SnapshotPage) {
  const items: SnapshotFaqItem[] = [];

  for (let index = 0; index < page.blocks.length; index += 1) {
    const block = page.blocks[index];

    if (block.type !== "heading") {
      continue;
    }

    const question = asText((block as { text?: string }).text);
    const level = Number((block as { level?: string }).level || "0");

    if (!question || !question.endsWith("?") || level < 4) {
      continue;
    }

    const answerParts: string[] = [];

    for (let innerIndex = index + 1; innerIndex < page.blocks.length; innerIndex += 1) {
      const innerBlock = page.blocks[innerIndex];

      if (innerBlock.type === "heading") {
        const innerLevel = Number((innerBlock as { level?: string }).level || "0");
        if (innerLevel <= level) {
          break;
        }
      }

      if (innerBlock.type === "paragraph") {
        const text = asText(innerBlock.text);
        if (text) {
          answerParts.push(text);
        }
      }
    }

    const answer = answerParts.join(" ").trim();
    if (answer) {
      items.push({ question, answer });
    }
  }

  return items;
}

export function normalizeSnapshotPath(routePath: string) {
  const normalized = routePath.trim() || "/";
  return normalized === "/" ? "/" : normalized.replace(/\/+$/, "");
}

function routePathToFileName(routePath: string) {
  const normalized = normalizeSnapshotPath(routePath);

  if (normalized === "/") {
    return "home.json";
  }

  if (normalized.startsWith("/clanky/")) {
    return `clanky__${normalized.replace("/clanky/", "")}.json`;
  }

  if (normalized.startsWith("/kategorie/")) {
    return `kategorie__${normalized.replace("/kategorie/", "")}.json`;
  }

  return `${normalized.slice(1)}.json`;
}

function fileNameToRoutePath(fileName: string) {
  if (fileName === "home.json") {
    return "/";
  }

  if (fileName.startsWith("clanky__")) {
    return `/clanky/${fileName.replace("clanky__", "").replace(".json", "")}`;
  }

  if (fileName.startsWith("kategorie__")) {
    return `/kategorie/${fileName.replace("kategorie__", "").replace(".json", "")}`;
  }

  return `/${fileName.replace(".json", "")}`;
}

const readSnapshotPage = cache(async (routePath: string): Promise<SnapshotPage | null> => {
  const fileName = routePathToFileName(routePath);
  const filePath = path.join(SNAPSHOT_DIR, fileName);

  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as SnapshotPage;
  } catch {
    return null;
  }
});

export async function getSnapshotPage(routePath: string) {
  return readSnapshotPage(normalizeSnapshotPath(routePath));
}

async function filterExistingLinks(links: SnapshotSiteLink[]) {
  const results = await Promise.all(
    links.map(async (link) => ({
      link,
      exists: (await getSnapshotPage(link.href)) !== null
    }))
  );

  return results.filter((entry) => entry.exists).map((entry) => entry.link);
}

export async function getSnapshotRoutes() {
  const files = await fs.readdir(SNAPSHOT_DIR);
  return files
    .filter((fileName) => fileName.endsWith(".json"))
    .map(fileNameToRoutePath)
    .sort((left, right) => left.localeCompare(right, "cs"));
}

export async function getSnapshotArticleSlugs() {
  const files = await fs.readdir(SNAPSHOT_DIR);
  return files
    .filter((fileName) => fileName.startsWith("clanky__"))
    .map((fileName) => fileName.replace("clanky__", "").replace(".json", ""))
    .sort();
}

export async function getSnapshotCategorySlugs() {
  const files = await fs.readdir(SNAPSHOT_DIR);
  return files
    .filter((fileName) => fileName.startsWith("kategorie__"))
    .map((fileName) => fileName.replace("kategorie__", "").replace(".json", ""))
    .sort();
}

export function getSnapshotDisplayTitle(page: SnapshotPage) {
  const title = asText(page.title);
  if (title && title !== SITE_NAME) {
    return title;
  }

  return page.headings.find((heading) => heading.trim()) ?? SITE_NAME;
}

export function getSnapshotDescription(page: SnapshotPage) {
  return asText(page.meta_description) || extractFirstParagraph(page) || `Obsahová stránka ${getSnapshotDisplayTitle(page)}.`;
}

export function getSnapshotFormKeys(forms: SnapshotForm[]) {
  return forms
    .map((form) => form.name || "")
    .filter((name) => FORM_NAME_TO_KEY[name])
    .map((name) => FORM_NAME_TO_KEY[name]);
}

export function getSnapshotProductKey(routePath: string) {
  return PRODUCT_KEY_BY_PATH[normalizeSnapshotPath(routePath)] ?? null;
}

export const getSnapshotSiteShell = cache(async (): Promise<SnapshotSiteShell> => {
  const homePage = await getSnapshotPage("/");

  return {
    brand: {
      name: SITE_NAME,
      description:
        homePage?.meta_description ??
        "Obsahový web Zdraví mě baví zaměřený na výživu, recepty, pohyb a dlouhodobě udržitelnou změnu.",
      logoPath: homePage?.images?.find((image) => image.local_path)?.local_path
    },
    primaryNav: await filterExistingLinks(PRIMARY_NAV_CONFIG),
    footerNav: await filterExistingLinks(FOOTER_NAV_CONFIG),
    legalNav: await filterExistingLinks(LEGAL_NAV_CONFIG),
    externalNav: EXTERNAL_NAV_CONFIG
  };
});

const getSnapshotArticleIndex = cache(async () => {
  const articleSlugs = await getSnapshotArticleSlugs();
  const articlePages = await Promise.all(
    articleSlugs.map(async (slug) => ({
      slug,
      page: await getSnapshotPage(`/clanky/${slug}`)
    }))
  );

  const rawArticles = articlePages
    .filter((entry): entry is { slug: string; page: SnapshotPage } => Boolean(entry.page))
    .map(({ slug, page }) => {
      const image = getPrimarySnapshotImage(page);

      return {
        slug,
        title: getSnapshotDisplayTitle(page),
        description: getSnapshotDescription(page),
        href: `/clanky/${slug}`,
        canonical: page.canonical ?? `${SITE_URL}/clanky/${slug}`,
        imageUrl: toAbsoluteUrl(image?.source_url),
        imageAlt: asText(image?.alt)
      };
    });

  const articleSlugByTitle = new Map(rawArticles.map((article) => [normalizeTitleKey(article.title), article.slug]));
  const categorySlugs = await getSnapshotCategorySlugs();
  const categoryMap = new Map<string, Set<string>>();
  const categories: SnapshotCategorySummary[] = [];

  for (const slug of categorySlugs) {
    const page = await getSnapshotPage(`/kategorie/${slug}`);
    if (!page) {
      continue;
    }

    const matchedSlugs = Array.from(
      new Set(
        extractListingTitles(page)
          .map((title) => articleSlugByTitle.get(normalizeTitleKey(title)))
          .filter((value): value is string => Boolean(value))
      )
    );

    for (const articleSlug of matchedSlugs) {
      if (!categoryMap.has(articleSlug)) {
        categoryMap.set(articleSlug, new Set());
      }
      categoryMap.get(articleSlug)?.add(slug);
    }

    categories.push({
      slug,
      title: getSnapshotDisplayTitle(page),
      href: `/kategorie/${slug}`,
      description: getSnapshotDescription(page),
      articleCount: matchedSlugs.length
    });
  }

  const blogPage = await getSnapshotPage("/blog");
  const blogOrder = blogPage
    ? extractListingTitles(blogPage)
        .map((title) => articleSlugByTitle.get(normalizeTitleKey(title)))
        .filter((value): value is string => Boolean(value))
    : [];
  const blogOrderIndex = new Map(blogOrder.map((slug, index) => [slug, index]));

  const articles: SnapshotArticleSummary[] = rawArticles
    .map((article) => ({
      ...article,
      categorySlugs: Array.from(categoryMap.get(article.slug) ?? [])
    }))
    .sort((left, right) => {
      const leftOrder = blogOrderIndex.get(left.slug);
      const rightOrder = blogOrderIndex.get(right.slug);

      if (leftOrder !== undefined && rightOrder !== undefined) {
        return leftOrder - rightOrder;
      }

      if (leftOrder !== undefined) {
        return -1;
      }

      if (rightOrder !== undefined) {
        return 1;
      }

      return left.title.localeCompare(right.title, "cs");
    });

  return {
    articles,
    articlesBySlug: new Map(articles.map((article) => [article.slug, article])),
    categories,
    categoriesBySlug: new Map(categories.map((category) => [category.slug, category]))
  };
});

export async function getSnapshotBlogArticles() {
  return (await getSnapshotArticleIndex()).articles;
}

export async function getSnapshotArticleSummary(slug: string) {
  return (await getSnapshotArticleIndex()).articlesBySlug.get(slug) ?? null;
}

export async function getSnapshotCategorySummaries() {
  return (await getSnapshotArticleIndex()).categories;
}

export async function getSnapshotCategorySummary(slug: string) {
  return (await getSnapshotArticleIndex()).categoriesBySlug.get(slug) ?? null;
}

export async function getSnapshotCategoryArticles(slug: string) {
  const { articles } = await getSnapshotArticleIndex();
  return articles.filter((article) => article.categorySlugs.includes(slug));
}

export async function getSnapshotRecipeData(slug: string): Promise<SnapshotRecipeData | null> {
  const page = await getSnapshotPage(`/clanky/${slug}`);
  if (!page) {
    return null;
  }

  const ingredients = extractRecipeIngredients(page);
  const instructions = extractRecipeInstructions(page);

  if (!ingredients.length || !instructions.length) {
    return null;
  }

  return {
    name: getSnapshotDisplayTitle(page),
    description: getSnapshotDescription(page),
    imageUrls: getContentImageUrls(page),
    ingredients,
    instructions
  };
}

export async function getSnapshotFaqData(slug: string): Promise<SnapshotFaqItem[]> {
  const page = await getSnapshotPage(`/clanky/${slug}`);
  if (!page) {
    return [];
  }

  return extractFaqItems(page);
}

type SnapshotMetadataOptions = {
  fallbackTitle?: string;
  fallbackDescription?: string;
};

export async function getSnapshotMetadata(
  routePath: string,
  options: SnapshotMetadataOptions = {}
): Promise<Metadata> {
  const page = await getSnapshotPage(routePath);
  const override = SEO_OVERRIDES[normalizeSnapshotPath(routePath)];
  const normalizedPath = normalizeSnapshotPath(routePath);
  const canonical =
    page?.canonical ?? (normalizedPath === "/" ? `${SITE_URL}/` : `${SITE_URL}${normalizedPath}`);
  const displayTitle =
    override?.title ??
    (page ? getSnapshotDisplayTitle(page) : options.fallbackTitle ?? SITE_NAME);
  const description =
    override?.description ??
    (page ? getSnapshotDescription(page) : undefined) ??
    options.fallbackDescription ??
    "Obsahový web Zdraví mě baví zaměřený na výživu, recepty a pohyb.";
  const image = page ? getPrimarySnapshotImage(page) : null;
  const imageUrl = toAbsoluteUrl(image?.source_url);
  const title = displayTitle;
  const isArticle = normalizedPath.startsWith("/clanky/");

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true
    },
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: "cs_CZ",
      type: isArticle ? "article" : "website",
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: asText(image?.alt) || displayTitle
            }
          ]
        : undefined
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined
    }
  };
}

export async function getSnapshotSitemapEntries(): Promise<
  Array<{ route: string; imageUrls: string[]; canonical: string }>
> {
  const routes = await getSnapshotRoutes();

  const pages = await Promise.all(
    routes.map(async (route) => ({
      route,
      page: await getSnapshotPage(route)
    }))
  );

  return pages.map(({ route, page }) => ({
    route,
    imageUrls: page ? getContentImageUrls(page).slice(0, 8) : [],
    canonical:
      page?.canonical ?? (route === "/" ? `${SITE_URL}/` : `${SITE_URL}${route}`)
  }));
}
