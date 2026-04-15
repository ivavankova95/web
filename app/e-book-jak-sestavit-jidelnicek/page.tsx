import type { Metadata } from "next";
import { OfferPageTemplate } from "@/components/offer-page-template";
import { SnapshotContentPage } from "@/components/snapshot-content-page";
import { getOfferPageBySlug, getSanityRouteMetadata } from "@/lib/sanity/loaders";

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({ kind: "offerPage", routePath: "/e-book-jak-sestavit-jidelnicek" });
}

export default async function EbookPage() {
  const page = await getOfferPageBySlug("e-book-jak-sestavit-jidelnicek");

  if (page?._id) {
    return <OfferPageTemplate page={page} routePath="/e-book-jak-sestavit-jidelnicek" />;
  }

  return (
    <SnapshotContentPage
      routePath="/e-book-jak-sestavit-jidelnicek"
      layout="StandaloneLayout"
      routeType="offerPage"
    />
  );
}
