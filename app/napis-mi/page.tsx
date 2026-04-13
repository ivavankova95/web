import type { Metadata } from "next";
import { HybridStaticRoutePage } from "@/components/hybrid-static-route-page";
import { getSanityRouteMetadata } from "@/lib/sanity/loaders";

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({
    kind: "page",
    routePath: "/napis-mi",
    fallbackDescription: "Kontakt na Zdraví mě baví a kontaktní formulář."
  });
}

export default function ContactPage() {
  return (
    <HybridStaticRoutePage
      documentKind="page"
      fallbackLayout="MarketingLayout"
      fallbackNotes={[
        "Kontaktni route je ted napojena na snapshot a renderuje i detekovany formular.",
        "Finalni verze se prepne na page + formBlock data ze Sanity."
      ]}
      fallbackRouteType="page + formBlock"
      routePath="/napis-mi"
    />
  );
}
