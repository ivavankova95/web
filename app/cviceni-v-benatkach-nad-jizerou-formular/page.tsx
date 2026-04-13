import type { Metadata } from "next";
import { HybridStaticRoutePage } from "@/components/hybrid-static-route-page";
import { getSanityRouteMetadata } from "@/lib/sanity/loaders";

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({
    kind: "offerPage",
    routePath: "/cviceni-v-benatkach-nad-jizerou-formular"
  });
}

export default function BenatkyExerciseFormPage() {
  return (
    <HybridStaticRoutePage
      documentKind="offerPage"
      fallbackLayout="CheckoutLayout"
      fallbackNotes={[
        "Conversion page je ted snapshot-backed route.",
        "Pokud tady zustane lead form nebo checkout, rozhodneme podle finalniho obchodniho flow."
      ]}
      fallbackRouteType="offerPage"
      routePath="/cviceni-v-benatkach-nad-jizerou-formular"
    />
  );
}
