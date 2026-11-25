import type { Metadata } from "next";
import { HybridStaticRoutePage } from "@/components/hybrid-static-route-page";
import webLegal from "@/lib/content/web-legal.json";
import { getSanityRouteMetadata } from "@/lib/sanity/loaders";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({ kind: "legalPage", routePath: "/gdpr" });
}

export default function GdprPage() {
  return (
    <>
      <HybridStaticRoutePage
        documentKind="legalPage"
        fallbackLayout="MarketingLayout"
        fallbackDocument={webLegal["gdpr"]}
        fallbackRouteType="legalPage"
        routePath="/gdpr"
      />
      <section className="page-section" id="odber-novinek" aria-labelledby="newsletter-privacy-heading">
        <div className="container">
          <div className="surface-card prose-content stack" style={{ padding: "2rem" }}>
            <h2 id="newsletter-privacy-heading">Odběr novinek od Ivy</h2>
            <p>
              Iva Vaňková používá e-mailovou adresu k zasílání tipů, novinek a nabídek Zdraví mě
              baví na základě vašeho souhlasu. Odběr se potvrzuje odkazem zaslaným na zadanou
              adresu. Potvrzovací e-mail doručuje Resend, formulář chrání Cloudflare Turnstile
              a rozesílku potvrzeným odběratelům zajišťuje Sender.
            </p>
            <p>
              Potvrzení a verzi znění souhlasu evidujeme s časem jeho udělení. Platnost odkazu je
              24 hodin. Po uplynutí platnosti nepotvrzené žádosti průběžně mažeme. Zprávy
              zasíláme do odvolání souhlasu, které můžete provést odkazem v každém newsletteru
              nebo zprávou na <a href="mailto:info@zdravimebavi.cz">info@zdravimebavi.cz</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
