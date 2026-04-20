export const metadata = {
  title: "Stránka nenalezena | Zdraví mě baví",
  description: "Požadovaná stránka nebyla nalezena.",
  alternates: {
    canonical: "https://www.zdravimebavi.cz/404"
  },
  robots: {
    index: false,
    follow: false
  }
};

import Link from "next/link";

export default function NotFound() {
  return (
    <section style={{ background: "var(--color-surface-alt)", padding: "5rem 0", minHeight: "calc(100vh - 200px)", display: "flex", alignItems: "center" }}>
      <div className="container--narrow" style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "var(--color-text)", lineHeight: 1.2, marginBottom: "1.5rem" }}>
          Stránka nenalezena 🧐
        </h1>
        <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "var(--color-text)", marginBottom: "2rem", maxWidth: "52ch", margin: "0 auto 2rem" }}>
          Web je nově rozšířený o nabídku mých služeb a má jiný design.
          <br /><br />
          Pokud hledáš článek nebo recept, klikni v hlavičce na BLOG. Pokud chceš na hlavní stránku webu, klikni na tlačítko níže.
        </p>
        <Link href="/" className="btn btn-primary">
          Zpět na hlavní stránku
        </Link>
      </div>
    </section>
  );
}
