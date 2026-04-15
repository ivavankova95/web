import type { Metadata } from "next";
import { ServicePageTemplate } from "@/components/service-page-template";
import { SnapshotContentPage } from "@/components/snapshot-content-page";
import { getServicePageBySlug, getSanityRouteMetadata } from "@/lib/sanity/loaders";

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({ kind: "servicePage", routePath: "/osobni-konzultace" });
}

export default async function PersonalConsultationPage() {
  const page = await getServicePageBySlug("osobni-konzultace");

  if (page?._id) {
    return <ServicePageTemplate page={page} />;
  }

  return (
    <SnapshotContentPage
      routePath="/osobni-konzultace"
      layout="StandaloneLayout"
      routeType="servicePage"
    />
  );
}
