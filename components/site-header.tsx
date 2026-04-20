import Image from "next/image";
import Link from "next/link";
import { getSiteShellData } from "@/lib/sanity/loaders";
import { NavMenu } from "@/components/nav-menu";

export async function SiteHeader() {
  const shell = await getSiteShellData();
  return (
    <>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link href="/" className="site-header__brand" aria-label={shell.brand.name}>
            <Image
              src="/logo.png"
              alt={`Logo ${shell.brand.name}`}
              width={70}
              height={70}
              priority
            />
          </Link>

          <NavMenu primaryNav={shell.primaryNav} />
        </div>
      </header>

      <style>{`
        .site-header {
          background: var(--color-surface);
        }
        .site-header__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
        }
        .site-header__brand {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .site-header__brand img {
          width: 70px;
          height: 70px;
          object-fit: contain;
        }
      `}</style>
    </>
  );
}
