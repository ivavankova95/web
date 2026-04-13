import type { Metadata } from "next";
import { HybridStaticRoutePage } from "@/components/hybrid-static-route-page";
import { getSanityRouteMetadata } from "@/lib/sanity/loaders";

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({ kind: "servicePage", routePath: "/osobni-konzultace" });
}

export default function PersonalConsultationPage() {
  return (
    <HybridStaticRoutePage
      documentKind="servicePage"
      fallbackLayout="StandaloneLayout"
      fallbackNotes={[
        "Osobni konzultace uz renderuje snapshot obsah i detekovany lead formular.",
        "Pozdeji sem doplnime finalni napojeni servicePage dokumentu a CTA logiku."
      ]}
      fallbackRouteType="servicePage"
      routePath="/osobni-konzultace"
    />
  );
}
