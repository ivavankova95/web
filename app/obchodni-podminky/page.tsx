import type { Metadata } from "next";
import { HybridStaticRoutePage } from "@/components/hybrid-static-route-page";
import { getSanityRouteMetadata } from "@/lib/sanity/loaders";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({ kind: "legalPage", routePath: "/obchodni-podminky" });
}

export default function TermsPage() {
  return (
    <HybridStaticRoutePage
      documentKind="legalPage"
      fallbackLayout="MarketingLayout"
      fallbackNotes={[
        "Legal obsah je renderovany ze snapshotu.",
        "Pred publikaci bude potreba pravni text zkontrolovat a ulozit do legalPage."
      ]}
      fallbackRouteType="legalPage"
      routePath="/obchodni-podminky"
    />
  );
}
