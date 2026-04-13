import type { Metadata } from "next";
import { PageBuilder } from "@/components/page-builder";
import { SnapshotContentPage } from "@/components/snapshot-content-page";
import { getSnapshotMetadata } from "@/lib/content/snapshot";
import { getHomePageData } from "@/lib/sanity/loaders";

export async function generateMetadata(): Promise<Metadata> {
  const homePage = await getHomePageData();
  if (!homePage?.seo) {
    return getSnapshotMetadata("/");
  }

  return {
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
      title: homePage.seo.metaTitle || homePage.title,
      description: homePage.seo.metaDescription || homePage.excerpt,
      url: homePage.seo.canonicalUrl || "https://www.zdravimebavi.cz/",
      siteName: "Zdraví mě baví",
      locale: "cs_CZ",
      type: "website"
    },
    twitter: {
      card: "summary",
      title: homePage.seo.metaTitle || homePage.title,
      description: homePage.seo.metaDescription || homePage.excerpt
    }
  };
}

export default async function HomePage() {
  const homePage = await getHomePageData();

  if (homePage?.pageBuilder?.length) {
    return (
      <section className="page-section">
        <div className="container">
          <PageBuilder
            blocks={homePage.pageBuilder}
            pagePath="/"
            pageTitle={homePage.title || "Domovská stránka"}
          />
        </div>
      </section>
    );
  }

  return (
    <SnapshotContentPage
      layout="MarketingLayout"
      notes={[
        "Tato route je uz napojena na lokalni snapshot jako fallback zdroj obsahu.",
        "Legacy query parametr d2e85baa_page zustane podporovany pro homepage listing."
      ]}
      routePath="/"
      routeType="page"
    />
  );
}
