import type { Metadata } from "next";
import { OfferPageTemplate } from "@/components/offer-page-template";
import { SnapshotContentPage } from "@/components/snapshot-content-page";
import { getOfferPageBySlug, getSanityRouteMetadata } from "@/lib/sanity/loaders";

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({ kind: "offerPage", routePath: "/zhubni-bez-pocitani-kalorii" });
}

export default async function ZhubniPage() {
  const page = await getOfferPageBySlug("zhubni-bez-pocitani-kalorii");

  if (page?._id) {
    return <OfferPageTemplate page={page} routePath="/zhubni-bez-pocitani-kalorii" />;
  }

  return (
    <SnapshotContentPage
      routePath="/zhubni-bez-pocitani-kalorii"
      layout="StandaloneLayout"
      routeType="offerPage"
    />
  );
}
