import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-section">
      <div className="container surface-card" style={{ padding: "2rem" }}>
        <p className="eyebrow">404</p>
        <h1>Stránka nebyla nalezena</h1>
        <p className="page-lead">
          Tohle je zatim scaffold custom 404 stranky. Finalni verze bude prepsana
          podle vizualni parity stareho webu.
        </p>
        <Link className="button-primary" href="/">
          Zpět na homepage
        </Link>
      </div>
    </section>
  );
}

