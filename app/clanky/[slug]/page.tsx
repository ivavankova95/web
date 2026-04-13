import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SnapshotContentPage } from "@/components/snapshot-content-page";
import { SanityArticlePage } from "@/components/sanity-article-page";
import { StructuredData } from "@/components/structured-data";
import {
  getSnapshotArticleSlugs,
  getSnapshotRecipeData,
  getSnapshotFaqData,
  getSnapshotArticleSummary,
  getSnapshotCategorySummaries,
  getSnapshotMetadata
} from "@/lib/content/snapshot";
import { getSanityBlogPostBySlug, getSanityBlogPostSlugs } from "@/lib/sanity/loaders";
import { urlForImage } from "@/lib/sanity/image";

export async function generateStaticParams() {
  const [snapshotSlugs, sanitySlugs] = await Promise.all([
    getSnapshotArticleSlugs(),
    getSanityBlogPostSlugs()
  ]);
  const merged = [...new Set([...snapshotSlugs, ...sanitySlugs])];
  return merged.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sanityPost = await getSanityBlogPostBySlug(slug);
  if (sanityPost) {
    const title = sanityPost.seo?.metaTitle || sanityPost.title || slug;
    const description = sanityPost.seo?.metaDescription || sanityPost.excerpt || "";
    const canonical = sanityPost.seo?.canonicalUrl || `https://www.zdravimebavi.cz/clanky/${slug}`;
    const imageUrl = urlForImage(sanityPost.mainImage);
    const imageAlt = sanityPost.mainImage?.alt || sanityPost.title || slug;
    const noIndex = sanityPost.seo?.noIndex ?? false;

    return {
      title,
      description,
      alternates: {
        canonical
      },
      robots: {
        index: !noIndex,
        follow: !noIndex
      },
      openGraph: {
        title,
        description,
        url: canonical,
        siteName: "Zdraví mě baví",
        locale: "cs_CZ",
        type: "article",
        images: imageUrl
          ? [
              {
                url: imageUrl,
                alt: imageAlt
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
  return getSnapshotMetadata(`/clanky/${slug}`);
}

export default async function ArticlePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [sanityPost, article, categories, recipe, faqs] = await Promise.all([
    getSanityBlogPostBySlug(slug),
    getSnapshotArticleSummary(slug),
    getSnapshotCategorySummaries(),
    getSnapshotRecipeData(slug),
    getSnapshotFaqData(slug)
  ]);

  // Sanity-backed rendering: post exists and has content
  if (sanityPost && sanityPost.content && sanityPost.content.length > 0) {
    const sanityCategories = sanityPost.categories ?? [];
    const categoryTitles = sanityCategories.map((cat) => cat.title).filter((t): t is string => Boolean(t));
    const canonical = sanityPost.seo?.canonicalUrl || `https://www.zdravimebavi.cz/clanky/${slug}`;
    const imageUrl = urlForImage(sanityPost.mainImage);
    const sanityStructuredData = [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Blog", item: "https://www.zdravimebavi.cz/blog" },
          ...sanityCategories.slice(0, 1).flatMap((cat, index) =>
            cat.slug?.current
              ? [{ "@type": "ListItem", position: index + 2, name: cat.title, item: `https://www.zdravimebavi.cz/kategorie/${cat.slug.current}` }]
              : []
          ),
          { "@type": "ListItem", position: sanityCategories.length ? 3 : 2, name: sanityPost.title, item: canonical }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: sanityPost.title,
        description: sanityPost.excerpt,
        mainEntityOfPage: canonical,
        image: imageUrl ? [imageUrl] : undefined,
        datePublished: sanityPost.publishedAt,
        articleSection: categoryTitles.length ? categoryTitles : undefined,
        publisher: { "@type": "Organization", name: "Zdraví mě baví", url: "https://www.zdravimebavi.cz" }
      }
    ];
    const contextLinks = [
      { href: "/blog", label: "Všechny články" },
      ...sanityCategories
        .filter((cat) => cat.slug?.current)
        .map((cat) => ({ href: `/kategorie/${cat.slug!.current}`, label: cat.title ?? cat.slug!.current! }))
    ];
    return (
      <>
        <StructuredData data={sanityStructuredData} />
        <SanityArticlePage contextLinks={contextLinks} post={sanityPost} />
      </>
    );
  }

  // Snapshot fallback
  if (!article) {
    notFound();
  }

  const categoryTitleBySlug = new Map(categories.map((category) => [category.slug, category.title]));
  const categoryTitles = article.categorySlugs
    .map((categorySlug) => categoryTitleBySlug.get(categorySlug))
    .filter((value): value is string => Boolean(value));
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
        ...categoryTitles.slice(0, 1).map((categoryTitle, index) => ({
          "@type": "ListItem",
          position: index + 2,
          name: categoryTitle,
          item: `https://www.zdravimebavi.cz/kategorie/${article.categorySlugs[index]}`
        })),
        {
          "@type": "ListItem",
          position: categoryTitles.length ? 3 : 2,
          name: article.title,
          item: article.canonical
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: article.title,
      description: article.description,
      mainEntityOfPage: article.canonical,
      image: article.imageUrl ? [article.imageUrl] : undefined,
      articleSection: categoryTitles.length ? categoryTitles : undefined,
      publisher: {
        "@type": "Organization",
        name: "Zdraví mě baví",
        url: "https://www.zdravimebavi.cz"
      }
    },
    ...(recipe
      ? [
          {
            "@context": "https://schema.org",
            "@type": "Recipe",
            name: recipe.name,
            description: recipe.description,
            image: recipe.imageUrls.length ? recipe.imageUrls : undefined,
            recipeIngredient: recipe.ingredients,
            recipeInstructions: recipe.instructions.map((step) => ({
              "@type": "HowToStep",
              text: step
            })),
            mainEntityOfPage: article.canonical,
            author: {
              "@type": "Organization",
              name: "Zdraví mě baví"
            },
            publisher: {
              "@type": "Organization",
              name: "Zdraví mě baví",
              url: "https://www.zdravimebavi.cz"
            }
          }
        ]
      : []),
    ...(faqs.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer
              }
            }))
          }
        ]
      : [])
  ];
  const contextLinks = [
    { href: "/blog", label: "Všechny články" },
    ...article.categorySlugs.map((categorySlug) => ({
      href: `/kategorie/${categorySlug}`,
      label: categoryTitleBySlug.get(categorySlug) ?? categorySlug
    }))
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <SnapshotContentPage
        contextLinks={contextLinks}
        layout="ContentLayout"
        routePath={`/clanky/${slug}`}
        routeType="blogPost"
      />
    </>
  );
}
