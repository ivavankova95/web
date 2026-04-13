import type { Metadata } from "next";
import "@/app/globals.css";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { getRootMetadata } from "@/lib/sanity/loaders";

export async function generateMetadata(): Promise<Metadata> {
  return getRootMetadata();
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
