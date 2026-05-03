import { PageBuilder } from "@/components/page-builder";
import { RouteScaffoldPage } from "@/components/route-scaffold-page";
import { styleguideSampleBlocks } from "@/lib/styleguide-sample";

export const dynamic = "force-static";

export const metadata = {
  title: "Styleguide scaffold",
  description: "Interní styleguide route.",
  alternates: {
    canonical: "https://www.zdravimebavi.cz/styleguide"
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function StyleguidePage() {
  return (
    <RouteScaffoldPage
      title="Styleguide scaffold"
      routePath="/styleguide"
      routeType="page"
      layout="StandaloneLayout"
      notes={[
        "Tato route muze slouzit jako verejna nebo interní showcase design systemu.",
        "Pozdeji sem muzeme doplnit komponentovy katalog a testovaci content bloky."
      ]}
    >
      <PageBuilder blocks={[...styleguideSampleBlocks]} pagePath="/styleguide" pageTitle="Styleguide" />
    </RouteScaffoldPage>
  );
}
