import Link from "next/link";
import { getSiteShellData } from "@/lib/sanity/loaders";

export async function SiteHeader() {
  const shell = await getSiteShellData();

  return (
    <header style={{ borderBottom: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          minHeight: "80px"
        }}
      >
        <Link href="/" style={{ fontWeight: 800 }}>
          {shell.brand.name}
        </Link>
        <nav style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          {shell.primaryNav.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
          <a
            className="button-primary"
            href={shell.externalNav[0]?.href ?? "https://app.zdravimebavi.cz/"}
            rel="noreferrer"
            target="_blank"
          >
            Otevřít app
          </a>
        </nav>
      </div>
    </header>
  );
}
