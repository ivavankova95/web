import type { Metadata } from "next";
import { HybridStaticRoutePage } from "@/components/hybrid-static-route-page";
import { getSanityRouteMetadata } from "@/lib/sanity/loaders";

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({ kind: "offerPage", routePath: "/zhubni-bez-pocitani-kalorii" });
}

export default function WeightLossPage() {
  return (
    <HybridStaticRoutePage
      documentKind="offerPage"
      fallbackLayout="StandaloneLayout"
      fallbackNotes={[
        "Landing page je ted napojena na snapshot fallback vrstvu.",
        "Dalsi krok bude potvrdit, zda zustane lead-only nebo dostane vlastni checkout flow."
      ]}
      fallbackRouteType="offerPage"
      routePath="/zhubni-bez-pocitani-kalorii"
    />
  );
}
