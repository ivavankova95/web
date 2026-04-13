import type { Metadata } from "next";
import { HybridStaticRoutePage } from "@/components/hybrid-static-route-page";
import { getSanityRouteMetadata } from "@/lib/sanity/loaders";

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({ kind: "servicePage", routePath: "/cviceni-v-benatkach-nad-jizerou" });
}

export default function BenatkyExercisePage() {
  return (
    <HybridStaticRoutePage
      documentKind="servicePage"
      fallbackLayout="MarketingLayout"
      fallbackNotes={[
        "Service page je ted napojena na snapshot obsah a detekovany formular.",
        "Pozdeji se nahradi servicePage dokumentem a page builder bloky ze Sanity."
      ]}
      fallbackRouteType="servicePage"
      routePath="/cviceni-v-benatkach-nad-jizerou"
    />
  );
}
