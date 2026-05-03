import type { Metadata } from "next";
import { HybridStaticRoutePage } from "@/components/hybrid-static-route-page";
import { getSanityRouteMetadata } from "@/lib/sanity/loaders";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({ kind: "legalPage", routePath: "/odpovednost" });
}

export default function ResponsibilityPage() {
  return (
    <HybridStaticRoutePage
      documentKind="legalPage"
      fallbackLayout="MarketingLayout"
      fallbackNotes={[
        "Disclaimer route je ted napojena na snapshot fallback.",
        "Finalni zdroj pravdy bude legalPage dokument v Sanity."
      ]}
      fallbackRouteType="legalPage"
      routePath="/odpovednost"
    />
  );
}
