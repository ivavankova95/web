import type { Metadata } from "next";
import { HybridStaticRoutePage } from "@/components/hybrid-static-route-page";
import { getSanityRouteMetadata } from "@/lib/sanity/loaders";

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({ kind: "servicePage", routePath: "/konzultace-zdarma" });
}

export default function FreeConsultationPage() {
  return (
    <HybridStaticRoutePage
      documentKind="servicePage"
      fallbackLayout="MarketingLayout"
      fallbackNotes={[
        "Service route uz renderuje snapshot fallback i detekovany formular.",
        "Pred ostrym napojenim stale plati potreba potvrdit MailerLite group mismatch pro konzultace zdarma."
      ]}
      fallbackRouteType="servicePage"
      routePath="/konzultace-zdarma"
    />
  );
}
