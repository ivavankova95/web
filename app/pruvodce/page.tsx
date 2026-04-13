import type { Metadata } from "next";
import { HybridStaticRoutePage } from "@/components/hybrid-static-route-page";
import { getSanityRouteMetadata } from "@/lib/sanity/loaders";

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({ kind: "offerPage", routePath: "/pruvodce" });
}

export default function GuidePage() {
  return (
    <HybridStaticRoutePage
      documentKind="offerPage"
      fallbackLayout="StandaloneLayout"
      fallbackNotes={[
        "Sales landing uz renderuje snapshot fallback obsah.",
        "Pred ostrym checkout napojenim je potreba potvrdit finalni product_key a Stripe flow."
      ]}
      fallbackRouteType="offerPage"
      routePath="/pruvodce"
    />
  );
}
