import type { Metadata } from "next";
import { HybridStaticRoutePage } from "@/components/hybrid-static-route-page";
import webLegal from "@/lib/content/web-legal.json";
import { getSanityRouteMetadata } from "@/lib/sanity/loaders";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({ kind: "legalPage", routePath: "/cookies" });
}

export default function CookiesPage() {
  return (
    <HybridStaticRoutePage
      documentKind="legalPage"
      fallbackLayout="MarketingLayout"
      fallbackDocument={webLegal["cookies"]}
      fallbackRouteType="legalPage"
      routePath="/cookies"
    />
  );
}
