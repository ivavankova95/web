import type { Metadata } from "next";
import { HybridStaticRoutePage } from "@/components/hybrid-static-route-page";
import { getSanityRouteMetadata } from "@/lib/sanity/loaders";

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({
    kind: "offerPage",
    routePath: "/formular---pruvodce-vyzivou-a-pohybem"
  });
}

export default function GuideIntakePage() {
  return (
    <HybridStaticRoutePage
      documentKind="offerPage"
      fallbackLayout="CheckoutLayout"
      fallbackNotes={[
        "Checkout route uz renderuje snapshot obsah a Stripe checkout panel.",
        "Dalsi krok je propojit finalni checkout metadata s Make routovanim."
      ]}
      fallbackRouteType="offerPage"
      routePath="/formular---pruvodce-vyzivou-a-pohybem"
    />
  );
}
