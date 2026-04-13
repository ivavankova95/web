import type { Metadata } from "next";
import { HybridStaticRoutePage } from "@/components/hybrid-static-route-page";
import { getSanityRouteMetadata } from "@/lib/sanity/loaders";

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({ kind: "offerPage", routePath: "/kalendar" });
}

export default function CalendarPage() {
  return (
    <HybridStaticRoutePage
      documentKind="offerPage"
      fallbackLayout="StandaloneLayout"
      fallbackNotes={[
        "Kalendar route je ted renderovana ze snapshot fallback zdroje.",
        "Pri migraci do Sanity se sem doplni finalni formBlock konfigurace."
      ]}
      fallbackRouteType="offerPage + formBlock"
      routePath="/kalendar"
    />
  );
}
