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
          <div className="site-footer__social">
            <a
              href="https://www.facebook.com/zdravimebavi.fb"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="site-footer__social-link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
              </svg>
            </a>
            <a
              href="https://www.instagram.com/zdravi_me_bavi/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="site-footer__social-link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .site-footer {
          background: var(--color-white);
          border-top: 1px solid var(--color-border);
          padding: 3rem 0 2rem;
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
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .site-footer__social {
          display: flex;
          gap: 0.75rem;
        }
        .site-footer__social-link {
          color: var(--color-text-muted);
          transition: color 0.15s;
          display: flex;
        }
        .site-footer__social-link:hover {
          color: var(--color-brand);
        }
      `}</style>
    </footer>
  );
}
