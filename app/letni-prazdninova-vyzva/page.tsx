import type { Metadata } from "next";
import { HybridStaticRoutePage } from "@/components/hybrid-static-route-page";
import { getSanityRouteMetadata } from "@/lib/sanity/loaders";

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({ kind: "offerPage", routePath: "/letni-prazdninova-vyzva" });
}

export default function SummerChallengePage() {
  return (
    <HybridStaticRoutePage
      documentKind="offerPage"
      fallbackLayout="StandaloneLayout"
      fallbackNotes={[
        "Tato route renderuje snapshot-backed obsah vcetne video/CTA sekci.",
        "Pozdeji sem doplnime strukturovany embedBlock renderer nad Sanity daty."
      ]}
      fallbackRouteType="offerPage"
      routePath="/letni-prazdninova-vyzva"
    />
  );
}
