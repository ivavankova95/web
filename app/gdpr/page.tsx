import type { Metadata } from "next";
import { HybridStaticRoutePage } from "@/components/hybrid-static-route-page";
import { getSanityRouteMetadata } from "@/lib/sanity/loaders";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({ kind: "legalPage", routePath: "/gdpr" });
}

export default function GdprPage() {
  return (
    <HybridStaticRoutePage
      documentKind="legalPage"
      fallbackLayout="MarketingLayout"
      fallbackNotes={[
        "Snapshot fallback vrstva uz pokryva i GDPR route.",
        "Finalni verze bude migrovana do legalPage dokumentu."
      ]}
      fallbackRouteType="legalPage"
      routePath="/gdpr"
    />
  );
}
