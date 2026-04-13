import type { Metadata } from "next";
import { HybridStaticRoutePage } from "@/components/hybrid-static-route-page";
import { getSanityRouteMetadata } from "@/lib/sanity/loaders";

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({ kind: "page", routePath: "/o-mne" });
}

export default function AboutMePage() {
  return (
    <HybridStaticRoutePage
      documentKind="page"
      fallbackLayout="MarketingLayout"
      fallbackNotes={[
        "Obsah profilove stranky se ted bere ze snapshotu.",
        "Pozdeji bude nahrazen page dokumentem s page builderem v Sanity."
      ]}
      fallbackRouteType="page"
      routePath="/o-mne"
    />
  );
}
