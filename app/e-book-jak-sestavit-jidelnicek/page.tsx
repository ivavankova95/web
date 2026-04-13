import type { Metadata } from "next";
import { HybridStaticRoutePage } from "@/components/hybrid-static-route-page";
import { getSanityRouteMetadata } from "@/lib/sanity/loaders";

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({ kind: "offerPage", routePath: "/e-book-jak-sestavit-jidelnicek" });
}

export default function EbookPage() {
  return (
    <HybridStaticRoutePage
      documentKind="offerPage"
      fallbackLayout="StandaloneLayout"
      fallbackNotes={[
        "E-book landing uz renderuje realny snapshot obsah a checkout panel.",
        "Finalni checkout se dokonci po doplneni ostrych Stripe price IDs."
      ]}
      fallbackRouteType="offerPage"
      routePath="/e-book-jak-sestavit-jidelnicek"
    />
  );
}
