import type { Metadata } from "next";
import { HybridStaticRoutePage } from "@/components/hybrid-static-route-page";
import { getSanityRouteMetadata } from "@/lib/sanity/loaders";

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({ kind: "servicePage", routePath: "/lekce-cviceni" });
}

export default function ExerciseLessonsPage() {
  return (
    <HybridStaticRoutePage
      documentKind="servicePage"
      fallbackLayout="MarketingLayout"
      fallbackNotes={[
        "Service page je ted napojena na snapshot fallback vrstvu.",
        "Finalni Sanity model pozdeji rozhodne, jestli zustane MarketingLayout nebo se upravi podle obsahu."
      ]}
      fallbackRouteType="servicePage"
      routePath="/lekce-cviceni"
    />
  );
}
