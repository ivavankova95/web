import type { Metadata } from "next";
import "@/app/fonts/fonts.css";
import "@/app/globals.css";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { getRootMetadata } from "@/lib/sanity/loaders";

export async function generateMetadata(): Promise<Metadata> {
  const metadata = await getRootMetadata();

  return {
    ...metadata,
    verification: {
      ...metadata.verification,
      other: {
        ...metadata.verification?.other,
        "facebook-domain-verification": "din2notsknfgr948qai7ax7ffduwo6"
      }
    }
  };
}

export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="cs">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
