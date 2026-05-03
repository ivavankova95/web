import type { Metadata } from "next";
import { ArticleDirectory } from "@/components/article-directory";
import { StructuredData } from "@/components/structured-data";
import {
  getSnapshotBlogArticles,
  getSnapshotCategorySummaries,
  getSnapshotMetadata
} from "@/lib/content/snapshot";
import { getSanityBlogPosts, getSanityCategories } from "@/lib/sanity/loaders";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const [sanityArticles, sanityCategories, fallback] = await Promise.all([
    getSanityBlogPosts(),
    getSanityCategories(),
    getSnapshotMetadata("/blog")
  ]);

  if (!sanityArticles?.length) {
    return fallback;
  }

  const title = "Blog | Zdraví mě baví";
  const description =
    sanityCategories?.length
      ? `Články, recepty a praktické tipy k výživě, pohybu a zdravému životnímu stylu v ${sanityCategories.length} tematických kategoriích.`
      : "Články, recepty a praktické tipy k výživě, pohybu a zdravému životnímu stylu.";
  const canonical = "https://www.zdravimebavi.cz/blog";
  const leadImage = sanityArticles.find((article) => article.imageUrl)?.imageUrl;

  return {
    ...fallback,
    title,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Zdraví mě baví",
      locale: "cs_CZ",
      type: "website",
      images: leadImage
        ? [
            {
              url: leadImage,
              alt: "Blog Zdraví mě baví"
            }
          ]
        : undefined
    },
    twitter: {
      card: leadImage ? "summary_large_image" : "summary",
      title,
      description,
      images: leadImage ? [leadImage] : undefined
    }
  };
}

export default async function BlogPage() {
  const [sanityArticles, sanityCategories, snapshotArticles, snapshotCategories] = await Promise.all([
    getSanityBlogPosts(),
    getSanityCategories(),
    getSnapshotBlogArticles(),
    getSnapshotCategorySummaries()
  ]);

  const articles = sanityArticles ?? snapshotArticles;
  const categories = sanityCategories ?? snapshotCategories;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Blog | Zdraví mě baví",
    url: "https://www.zdravimebavi.cz/blog",
    description: "Články, recepty a praktické tipy k výživě, pohybu a zdravému životnímu stylu.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: article.canonical,
        name: article.title
      }))
    }
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <ArticleDirectory
        articles={articles}
        categories={categories}
        description="Obsahový hub se články, recepty a praktickými tipy, které pomáhají přivádět nové návštěvníky přes organické vyhledávání."
        eyebrow="Blog"
        title="Články, recepty a tipy pro zdravější život"
      />
    </>
  );
}
