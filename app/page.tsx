import type { Metadata } from "next";
import { HomepageSections } from "@/components/homepage-sections";
import { StructuredData } from "@/components/structured-data";
import { getSnapshotMetadata } from "@/lib/content/snapshot";
import { getHomePageData } from "@/lib/sanity/loaders";

export async function generateMetadata(): Promise<Metadata> {
  const homePage = await getHomePageData();
  const fallback = await getSnapshotMetadata("/");

  if (!homePage?.seo) {
    return fallback;
  }

  return {
    ...fallback,
    title: homePage.seo.metaTitle || homePage.title,
    description: homePage.seo.metaDescription || homePage.excerpt,
    alternates: {
      canonical: homePage.seo.canonicalUrl || "https://www.zdravimebavi.cz/"
    },
    robots: {
      index: !(homePage.seo.noIndex ?? false),
      follow: !(homePage.seo.noIndex ?? false)
    },
    openGraph: {
      ...(fallback.openGraph ?? {}),
      title: homePage.seo.metaTitle || homePage.title,
      description: homePage.seo.metaDescription || homePage.excerpt,
      url: homePage.seo.canonicalUrl || "https://www.zdravimebavi.cz/",
      siteName: "Zdraví mě baví",
      locale: "cs_CZ",
      type: "website"
    },
    twitter: {
      ...(fallback.twitter ?? {}),
      title: homePage.seo.metaTitle || homePage.title,
      description: homePage.seo.metaDescription || homePage.excerpt
    }
  };
}

export default async function HomePage() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Zdraví mě baví",
      url: "https://www.zdravimebavi.cz",
      logo: "https://www.zdravimebavi.cz/logo.png",
      sameAs: [
        "https://www.facebook.com/zdravimebavi.fb",
        "https://www.instagram.com/zdravi_me_bavi/"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Zdraví mě baví",
      url: "https://www.zdravimebavi.cz",
      inLanguage: "cs-CZ",
      publisher: {
        "@type": "Organization",
        name: "Zdraví mě baví",
        url: "https://www.zdravimebavi.cz"
      }
    }
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <HomepageSections />
    </>
  );
}
