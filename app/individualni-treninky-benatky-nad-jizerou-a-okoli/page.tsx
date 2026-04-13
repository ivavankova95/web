import type { Metadata } from "next";
import { HybridStaticRoutePage } from "@/components/hybrid-static-route-page";
import { getSanityRouteMetadata } from "@/lib/sanity/loaders";

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({
    kind: "servicePage",
    routePath: "/individualni-treninky-benatky-nad-jizerou-a-okoli"
  });
}

export default function IndividualTrainingPage() {
  return (
    <HybridStaticRoutePage
      documentKind="servicePage"
      fallbackLayout="MarketingLayout"
      fallbackNotes={[
        "Service page uz renderuje snapshot fallback a navazny formular.",
        "Form key se bude pozdeji tahat z content modelu misto detekce."
      ]}
      fallbackRouteType="servicePage"
      routePath="/individualni-treninky-benatky-nad-jizerou-a-okoli"
    />
  );
}
