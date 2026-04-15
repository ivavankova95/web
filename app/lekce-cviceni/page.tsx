import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/service-page-template";
import { SnapshotContentPage } from "@/components/snapshot-content-page";
import { getServicePageBySlug, getSanityRouteMetadata } from "@/lib/sanity/loaders";

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({ kind: "servicePage", routePath: "/lekce-cviceni" });
}

export default async function LekceCviceniPage() {
  const page = await getServicePageBySlug("lekce-cviceni");

  if (page?._id) {
    return <ServicePageTemplate page={page} />;
  }

  return (
    <SnapshotContentPage
      routePath="/lekce-cviceni"
      layout="StandaloneLayout"
      routeType="servicePage"
    />
  );
}
