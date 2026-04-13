import Link from "next/link";
import { getSiteShellData } from "@/lib/sanity/loaders";

export async function Footer() {
  const shell = await getSiteShellData();

  return (
    <footer style={{ borderTop: "1px solid var(--color-border)", padding: "2rem 0", background: "var(--color-white)" }}>
      <div className="container" style={{ display: "grid", gap: "1.5rem" }}>
        <div className="stack" style={{ gap: "0.5rem" }}>
          <strong>{shell.brand.name}</strong>
          <p className="muted">{shell.brand.description}</p>
        </div>

        <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
          <div className="stack" style={{ gap: "0.75rem" }}>
            <strong>Rychlé odkazy</strong>
            {shell.footerNav.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="stack" style={{ gap: "0.75rem" }}>
            <strong>Právní informace</strong>
            {shell.legalNav.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="stack" style={{ gap: "0.75rem" }}>
            <strong>Další kroky</strong>
            {shell.primaryNav.slice(0, 3).map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
            {shell.externalNav.map((item) => (
              <a href={item.href} key={item.href} rel="noreferrer" target="_blank">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
