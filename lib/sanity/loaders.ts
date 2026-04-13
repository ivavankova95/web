import { cache } from "react";
import type { Metadata } from "next";
import { sanityClient } from "@/lib/sanity/client";
import {
  footerQuery,
  homePageQuery,
  navigationQuery,
  siteSettingsQuery,
  pageBySlugQuery,
  servicePageBySlugQuery,
  offerPageBySlugQuery,
  legalPageBySlugQuery,
  allBlogPostsQuery,
  allBlogPostSlugsQuery,
  blogPostBySlugQuery,
  allCategoriesQuery,
  categoryBySlugQuery,
  categoryArticlesBySlugQuery
} from "@/lib/sanity/queries";
import { urlForImage } from "@/lib/sanity/image";
import { env } from "@/lib/env";
import {
  getSnapshotMetadata,
  getSnapshotSiteShell,
  type SnapshotArticleSummary,
  type SnapshotCategorySummary,
  type SnapshotSiteShell
} from "@/lib/content/snapshot";
import type { PageBuilderBlock } from "@/components/page-builder";

type SanityLinkItem = {
  label?: string;
  href?: string;
  openInNewTab?: boolean;
  variant?: string;
};

type SanitySiteSettings = {
  title?: string;
  siteDescription?: string;
  siteUrl?: string;
  appUrl?: string;
  socialLinks?: SanityLinkItem[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
  };
};

type SanityNavigation = {
  items?: SanityLinkItem[];
  ctaLabel?: string;
  ctaHref?: string;
};

type SanityFooter = {
  aboutText?: string;
  primaryLinks?: SanityLinkItem[];
  legalLinks?: SanityLinkItem[];
  socialLinks?: SanityLinkItem[];
};

type SanityPageDocument = {
  _id?: string;
  _type?: string;
  title?: string;
  excerpt?: string;
  summary?: string;
  slug?: { current?: string };
  pageKey?: string;
  serviceKey?: string;
  leadFormKey?: string;
  productKey?: string;
  pageBuilder?: PageBuilderBlock[];
  content?: readonly unknown[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
  };
};

type SanityRouteDocumentKind = "page" | "servicePage" | "offerPage" | "legalPage";

const routeDocumentQueries: Record<SanityRouteDocumentKind, string> = {
  page: pageBySlugQuery,
  servicePage: servicePageBySlugQuery,
  offerPage: offerPageBySlugQuery,
  legalPage: legalPageBySlugQuery
};

function hasSanityConfig() {
  return Boolean(env.sanityProjectId && env.sanityDataset);
}

function toShellLinks(items?: SanityLinkItem[]) {
  return (items ?? [])
    .filter((item): item is Required<Pick<SanityLinkItem, "label" | "href">> & SanityLinkItem =>
      Boolean(item?.label && item?.href)
    )
    .map((item) => ({
      label: item.label,
      href: item.href
    }));
}

const fetchSanityGlobals = cache(async () => {
  if (!hasSanityConfig()) {
    return null;
  }

  try {
    const [siteSettings, navigation, footer] = await Promise.all([
      sanityClient.fetch<SanitySiteSettings | null>(siteSettingsQuery, {}, { next: { revalidate: 60, tags: ["siteSettings", "siteShell"] } }),
      sanityClient.fetch<SanityNavigation | null>(navigationQuery, {}, { next: { revalidate: 60, tags: ["navigation", "siteShell"] } }),
      sanityClient.fetch<SanityFooter | null>(footerQuery, {}, { next: { revalidate: 60, tags: ["footer", "siteShell"] } })
    ]);

    if (!siteSettings && !navigation && !footer) {
      return null;
    }

    return { siteSettings, navigation, footer };
  } catch {
    return null;
  }
});

export const getSiteShellData = cache(async (): Promise<SnapshotSiteShell> => {
  const fallback = await getSnapshotSiteShell();
  const globals = await fetchSanityGlobals();

  if (!globals) {
    return fallback;
  }

  const { siteSettings, navigation, footer } = globals;
  const externalHref = navigation?.ctaHref || siteSettings?.appUrl || fallback.externalNav[0]?.href;
  const externalLabel = navigation?.ctaLabel || fallback.externalNav[0]?.label || "Otevřít app";

  return {
    brand: {
      name: siteSettings?.title || fallback.brand.name,
      description: siteSettings?.siteDescription || footer?.aboutText || fallback.brand.description,
      logoPath: fallback.brand.logoPath
    },
    primaryNav: toShellLinks(navigation?.items).length ? toShellLinks(navigation?.items) : fallback.primaryNav,
    footerNav: toShellLinks(footer?.primaryLinks).length ? toShellLinks(footer?.primaryLinks) : fallback.footerNav,
    legalNav: toShellLinks(footer?.legalLinks).length ? toShellLinks(footer?.legalLinks) : fallback.legalNav,
    externalNav: externalHref
      ? [
          {
            label: externalLabel,
            href: externalHref,
            external: true
          }
        ]
      : fallback.externalNav
  };
});

export const getRootMetadata = cache(async (): Promise<Metadata> => {
  const fallback = await getSnapshotMetadata("/", {
    fallbackDescription: "Implementační scaffold pro migraci webu Zdraví mě baví."
  });
  const globals = await fetchSanityGlobals();

  if (!globals?.siteSettings) {
    return fallback;
  }

  const { siteSettings } = globals;
  const siteUrl = siteSettings.siteUrl || "https://www.zdravimebavi.cz";
  const fallbackTitle =
    typeof fallback.title === "string" ? fallback.title : siteSettings.title || "Zdraví mě baví";
  const title = siteSettings.seo?.metaTitle || siteSettings.title || fallbackTitle;
  const description =
    siteSettings.seo?.metaDescription ||
    siteSettings.siteDescription ||
    (typeof fallback.description === "string" ? fallback.description : undefined) ||
    "Obsahový web Zdraví mě baví zaměřený na výživu, recepty a pohyb.";
  const canonical = siteSettings.seo?.canonicalUrl || siteUrl;
  const noIndex = siteSettings.seo?.noIndex ?? false;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    robots: {
      index: !noIndex,
      follow: !noIndex
    },
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteSettings.title || "Zdraví mě baví",
      locale: "cs_CZ",
      type: "website"
    },
    twitter: {
      card: "summary",
      title,
      description
    }
  };
});

export const getHomePageData = cache(async (): Promise<SanityPageDocument | null> => {
  if (!hasSanityConfig()) {
    return null;
  }

  try {
    return await sanityClient.fetch<SanityPageDocument | null>(homePageQuery, {}, { next: { revalidate: 60, tags: ["page", "page:home", "route:/"] } });
  } catch {
    return null;
  }
});

export const getSanityRouteDocument = cache(
  async (kind: SanityRouteDocumentKind, slug: string): Promise<SanityPageDocument | null> => {
    if (!hasSanityConfig()) {
      return null;
    }

    try {
      return await sanityClient.fetch<SanityPageDocument | null>(
        routeDocumentQueries[kind],
        { slug },
        { next: { revalidate: 60, tags: [kind, `${kind}:${slug}`, `route:/${slug}`] } }
      );
    } catch {
      return null;
    }
  }
);

type SanityRouteMetadataOptions = {
  kind: SanityRouteDocumentKind;
  routePath: string;
  fallbackDescription?: string;
};

export const getSanityRouteMetadata = cache(
  async ({
    kind,
    routePath,
    fallbackDescription
  }: SanityRouteMetadataOptions): Promise<Metadata> => {
    const slug = routePath.replace(/^\/+/, "");
    const [document, fallback] = await Promise.all([
      getSanityRouteDocument(kind, slug),
      getSnapshotMetadata(routePath, {
        fallbackDescription
      })
    ]);

    if (!document) {
      return fallback;
    }

    const title =
      document.seo?.metaTitle ||
      document.title ||
      (typeof fallback.title === "string" ? fallback.title : slug);
    const description =
      document.seo?.metaDescription ||
      document.excerpt ||
      document.summary ||
      (typeof fallback.description === "string" ? fallback.description : "") ||
      fallbackDescription ||
      "Obsahový web Zdraví mě baví zaměřený na výživu, recepty a pohyb.";
    const canonical =
      document.seo?.canonicalUrl ||
      (routePath === "/" ? "https://www.zdravimebavi.cz/" : `https://www.zdravimebavi.cz${routePath}`);
    const noIndex = document.seo?.noIndex ?? false;

    return {
      ...fallback,
      title,
      description,
      robots: {
        index: !noIndex,
        follow: !noIndex
      },
      alternates: {
        canonical
      },
      openGraph: {
        ...(fallback.openGraph ?? {}),
        title,
        description,
        url: canonical,
        siteName: "Zdraví mě baví",
        locale: "cs_CZ",
        type: "website"
      },
      twitter: {
        ...(fallback.twitter ?? {}),
        title,
        description
      }
    };
  }
);

// ─── Blog / Articles ─────────────────────────────────────────────────────────

type SanityCategory = {
  _id?: string;
  title?: string;
  slug?: { current?: string };
  description?: string;
  articleCount?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
  };
};

type SanityBlogPost = {
  _id?: string;
  title?: string;
  slug?: { current?: string };
  excerpt?: string;
  publishedAt?: string;
  mainImage?: { asset?: unknown; alt?: string };
  categories?: SanityCategory[];
  content?: readonly unknown[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
  };
};

function mapBlogPostToSummary(post: SanityBlogPost): SnapshotArticleSummary {
  const slug = post.slug?.current ?? "";
  const imageUrl = urlForImage(post.mainImage);
  const canonical = post.seo?.canonicalUrl || `https://www.zdravimebavi.cz/clanky/${slug}`;
  return {
    slug,
    title: post.title ?? slug,
    description: post.excerpt ?? post.seo?.metaDescription ?? "",
    href: `/clanky/${slug}`,
    canonical,
    imageUrl,
    imageAlt: post.mainImage?.alt,
    categorySlugs: (post.categories ?? []).map((cat) => cat.slug?.current ?? "").filter(Boolean)
  };
}

function mapCategoryToSummary(cat: SanityCategory): SnapshotCategorySummary {
  const slug = cat.slug?.current ?? "";
  return {
    slug,
    title: cat.title ?? slug,
    href: `/kategorie/${slug}`,
    description: cat.description ?? "",
    articleCount: cat.articleCount ?? 0
  };
}

export const getSanityBlogPosts = cache(async (): Promise<SnapshotArticleSummary[] | null> => {
  if (!hasSanityConfig()) {
    return null;
  }
  try {
    const posts = await sanityClient.fetch<SanityBlogPost[]>(
      allBlogPostsQuery,
      {},
      { next: { revalidate: 60, tags: ["blogPost"] } }
    );
    if (!posts?.length) {
      return null;
    }
    return posts.map(mapBlogPostToSummary);
  } catch {
    return null;
  }
});

export const getSanityBlogPostSlugs = cache(async (): Promise<string[]> => {
  if (!hasSanityConfig()) {
    return [];
  }
  try {
    const slugs = await sanityClient.fetch<string[]>(
      allBlogPostSlugsQuery,
      {},
      { next: { revalidate: 300, tags: ["blogPost"] } }
    );
    return slugs ?? [];
  } catch {
    return [];
  }
});

export const getSanityBlogPostBySlug = cache(async (slug: string): Promise<SanityBlogPost | null> => {
  if (!hasSanityConfig()) {
    return null;
  }
  try {
    return await sanityClient.fetch<SanityBlogPost | null>(
      blogPostBySlugQuery,
      { slug },
      { next: { revalidate: 60, tags: ["blogPost", `blogPost:${slug}`] } }
    );
  } catch {
    return null;
  }
});

export const getSanityCategories = cache(async (): Promise<SnapshotCategorySummary[] | null> => {
  if (!hasSanityConfig()) {
    return null;
  }
  try {
    const cats = await sanityClient.fetch<SanityCategory[]>(
      allCategoriesQuery,
      {},
      { next: { revalidate: 60, tags: ["category"] } }
    );
    if (!cats?.length) {
      return null;
    }
    return cats.map(mapCategoryToSummary);
  } catch {
    return null;
  }
});

export const getSanityCategoryBySlug = cache(async (slug: string): Promise<SanityCategory | null> => {
  if (!hasSanityConfig()) {
    return null;
  }
  try {
    return await sanityClient.fetch<SanityCategory | null>(
      categoryBySlugQuery,
      { slug },
      { next: { revalidate: 60, tags: ["category", `category:${slug}`] } }
    );
  } catch {
    return null;
  }
});

export const getSanityCategoryArticles = cache(async (slug: string): Promise<SnapshotArticleSummary[] | null> => {
  if (!hasSanityConfig()) {
    return null;
  }
  try {
    const posts = await sanityClient.fetch<SanityBlogPost[]>(
      categoryArticlesBySlugQuery,
      { slug },
      { next: { revalidate: 60, tags: ["blogPost", "category", `category:${slug}`] } }
    );
    if (!posts?.length) {
      return null;
    }
    return posts.map(mapBlogPostToSummary);
  } catch {
    return null;
  }
});

export type {
  SanityBlogPost,
  SanityCategory,
  SanityPageDocument,
  SanityRouteDocumentKind
};
