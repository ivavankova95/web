import type { Metadata } from "next";
import { HybridStaticRoutePage } from "@/components/hybrid-static-route-page";
import { getSanityRouteMetadata } from "@/lib/sanity/loaders";

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({ kind: "offerPage", routePath: "/osobni-konzultace-objednavka" });
}

export default function PersonalConsultationOrderPage() {
  return (
    <HybridStaticRoutePage
      documentKind="offerPage"
      fallbackLayout="CheckoutLayout"
      fallbackNotes={[
        "Objednavkova route uz renderuje snapshot fallback a checkout panel.",
        "Finalni behavior se dokonci po doplneni price IDs a potvrzeni Stripe -> Make flow."
      ]}
      fallbackRouteType="offerPage"
      routePath="/osobni-konzultace-objednavka"
    />
  );
}
