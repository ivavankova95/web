import type { Metadata } from "next";
import { HybridStaticRoutePage } from "@/components/hybrid-static-route-page";
import webLegal from "@/lib/content/web-legal.json";
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
      fallbackDocument={webLegal["obchodni-podminky"]}
      fallbackRouteType="legalPage"
      routePath="/obchodni-podminky"
    />
  );
}
