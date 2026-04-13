import type { Metadata } from "next";
import { HybridStaticRoutePage } from "@/components/hybrid-static-route-page";
import { getSanityRouteMetadata } from "@/lib/sanity/loaders";

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({
    kind: "servicePage",
    routePath: "/skupinove-lekce-benatky-nad-jizerou"
  });
}

export default function GroupLessonsPage() {
  return (
    <HybridStaticRoutePage
      documentKind="servicePage"
      fallbackLayout="MarketingLayout"
      fallbackNotes={[
        "Service page uz renderuje snapshot fallback a detekovany lead formular.",
        "Pozdeji se prepne na servicePage dokument a page builder bloky."
      ]}
      fallbackRouteType="servicePage"
      routePath="/skupinove-lekce-benatky-nad-jizerou"
    />
  );
}
