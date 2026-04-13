import Link from "next/link";
import Image from "next/image";
import { getSiteShellData } from "@/lib/sanity/loaders";

export async function Footer() {
  const shell = await getSiteShellData();

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <Image src="/logo.png" alt={`Logo ${shell.brand.name}`} width={52} height={52} />
          <div>
            <div className="site-footer__name">{shell.brand.name}</div>
            {shell.brand.description && (
              <div className="site-footer__tagline">{shell.brand.description}</div>
            )}
          </div>
        </div>

        <div className="site-footer__cols">
          {shell.footerNav.length > 0 && (
            <div className="site-footer__col">
              <div className="site-footer__col-title">Rychlé odkazy</div>
              {shell.footerNav.map((item) => (
                <Link key={item.href} href={item.href} className="site-footer__link">
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {shell.legalNav.length > 0 && (
            <div className="site-footer__col">
              <div className="site-footer__col-title">Právní info</div>
              {shell.legalNav.map((item) => (
                <Link key={item.href} href={item.href} className="site-footer__link">
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {shell.externalNav.length > 0 && (
            <div className="site-footer__col">
              <div className="site-footer__col-title">Moje aplikace</div>
              {shell.externalNav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="site-footer__link"
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="site-footer__bottom">
          <span>© {new Date().getFullYear()} {shell.brand.name}</span>
        </div>
      </div>

      <style>{`
        .site-footer {
          background: var(--color-white);
          border-top: 1px solid var(--color-border);
          padding: 3rem 0 2rem;
          margin-top: 4rem;
        }
        .site-footer__inner {
          display: grid;
          gap: 2.5rem;
        }
        .site-footer__brand {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .site-footer__name {
          font-size: 1rem;
          font-weight: 800;
          color: var(--color-text);
        }
        .site-footer__tagline {
          font-size: 0.82rem;
          color: var(--color-text-muted);
          margin-top: 0.2rem;
          max-width: 30ch;
          line-height: 1.5;
        }
        .site-footer__cols {
          display: grid;
          gap: 2rem;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        }
        .site-footer__col {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .site-footer__col-title {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-brand);
          margin-bottom: 0.25rem;
        }
        .site-footer__link {
          font-size: 0.88rem;
          color: var(--color-text-muted);
          transition: color 0.15s;
        }
        .site-footer__link:hover {
          color: var(--color-brand);
        }
        .site-footer__bottom {
          border-top: 1px solid var(--color-border);
          padding-top: 1.25rem;
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }
      `}</style>
    </footer>
  );
}
