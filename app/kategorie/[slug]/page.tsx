import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleDirectory } from "@/components/article-directory";
import { StructuredData } from "@/components/structured-data";
import {
  getSnapshotCategoryArticles,
  getSnapshotCategorySummaries,
  getSnapshotCategorySummary,
  getSnapshotCategorySlugs,
  getSnapshotMetadata
} from "@/lib/content/snapshot";
import {
  getSanityCategoryBySlug,
  getSanityCategoryArticles,
  getSanityCategories
} from "@/lib/sanity/loaders";

export async function generateStaticParams() {
  const [snapshotSlugs, sanityCategories] = await Promise.all([
    getSnapshotCategorySlugs(),
    getSanityCategories()
  ]);
  const sanitySlugs = (sanityCategories ?? []).map((category) => category.slug);
  const merged = [...new Set([...snapshotSlugs, ...sanitySlugs])].filter(Boolean);
  return merged.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sanityCategory = await getSanityCategoryBySlug(slug);
  if (sanityCategory) {
    const canonical = sanityCategory.seo?.canonicalUrl || `https://www.zdravimebavi.cz/kategorie/${slug}`;
    const title = sanityCategory.seo?.metaTitle || sanityCategory.title || slug;
    const description = sanityCategory.seo?.metaDescription || sanityCategory.description || "";
    const noIndex = sanityCategory.seo?.noIndex ?? false;
    return {
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
        siteName: "Zdraví mě baví",
        locale: "cs_CZ",
        type: "website"
      },
      twitter: {
        card: "summary",
        title,
        description
      }
    };
  }
  return getSnapshotMetadata(`/kategorie/${slug}`);
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [sanityCategory, sanityArticles, sanityCategories, snapshotCategory, snapshotCategories, snapshotArticles] = await Promise.all([
    getSanityCategoryBySlug(slug),
    getSanityCategoryArticles(slug),
    getSanityCategories(),
    getSnapshotCategorySummary(slug),
    getSnapshotCategorySummaries(),
    getSnapshotCategoryArticles(slug)
  ]);

  const category = sanityCategory
    ? {
        slug: sanityCategory.slug?.current ?? slug,
        title: sanityCategory.title ?? slug,
        href: `/kategorie/${sanityCategory.slug?.current ?? slug}`,
        description: sanityCategory.description ?? "",
        articleCount: sanityCategory.articleCount ?? 0
      }
    : snapshotCategory;

  if (!category) {
    notFound();
  }

  const articles = sanityArticles ?? snapshotArticles;
  const categories = sanityCategories ?? snapshotCategories;

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Blog",
          item: "https://www.zdravimebavi.cz/blog"
        },
        {
          "@type": "ListItem",
          position: 2,
          name: category.title,
          item: `https://www.zdravimebavi.cz${category.href}`
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${category.title} | Zdraví mě baví`,
      url: `https://www.zdravimebavi.cz${category.href}`,
      description: category.description,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: articles.map((article, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: article.canonical,
          name: article.title
        }))
      }
    }
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <ArticleDirectory
        activeCategorySlug={slug}
        articles={articles}
        categories={categories}
        description={category.description}
        eyebrow="Kategorie"
        title={category.title}
      />
    </>
  );
}
