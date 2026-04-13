import Image from "next/image";
import Link from "next/link";
import { getSiteShellData } from "@/lib/sanity/loaders";
import { NavMenu } from "@/components/nav-menu";

export async function SiteHeader() {
  const shell = await getSiteShellData();
  const ctaHref = shell.externalNav[0]?.href ?? "https://app.zdravimebavi.cz/";

  return (
    <>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link href="/" className="site-header__brand" aria-label={shell.brand.name}>
            <Image
              src="/logo.png"
              alt={`Logo ${shell.brand.name}`}
              width={60}
              height={60}
              priority
            />
          </Link>

          <NavMenu
            primaryNav={shell.primaryNav}
            ctaHref={ctaHref}
            ctaLabel="Otevřít app"
          />
        </div>
      </header>

      <style>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--color-white);
          border-bottom: 1px solid var(--color-border);
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }
        .site-header__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
        }
        .site-header__brand {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .site-header__brand img {
          width: 60px;
          height: 60px;
          object-fit: contain;
        }
      `}</style>
    </>
  );
}
