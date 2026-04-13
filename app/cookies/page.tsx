import type { Metadata } from "next";
import { HybridStaticRoutePage } from "@/components/hybrid-static-route-page";
import { getSanityRouteMetadata } from "@/lib/sanity/loaders";

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({ kind: "legalPage", routePath: "/cookies" });
}

export default function CookiesPage() {
  return (
    <HybridStaticRoutePage
      documentKind="legalPage"
      fallbackLayout="MarketingLayout"
      fallbackNotes={[
        "Legal obsah je ted nacitany ze snapshotu jako fallback vrstva.",
        "Pozdeji bude nahrazen dokumentem legalPage ze Sanity."
      ]}
      fallbackRouteType="legalPage"
      routePath="/cookies"
    />
  );
}
