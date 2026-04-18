import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = {
  title: "Zdraví mě baví - Kontakt",
  description: "Napiš mi — kontaktní formulář Zdraví mě baví.",
};

export default function ContactPage() {
  return (
    <section className="page-section">
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "start",
          }}
          className="contact-grid"
        >
          {/* Levý sloupec — kontaktní info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div>
              <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Iva Vaňková</p>
              <p className="muted" style={{ lineHeight: 1.6 }}>
                Dr. Nováka 496<br />
                Benátky nad Jizerou<br />
                294 71
              </p>
            </div>
            <div>
              <p className="eyebrow" style={{ marginBottom: "0.5rem" }}>Kontakt</p>
              <a href="mailto:info@zdravimebavi.cz" style={{ display: "block", marginBottom: "0.25rem" }}>
                info@zdravimebavi.cz
              </a>
              <p className="muted">Tel.: +420 608 283 477</p>
            </div>
            <div>
              <p className="eyebrow" style={{ marginBottom: "0.5rem" }}>Ostatní informace</p>
              <p className="muted" style={{ marginBottom: "0.5rem" }}>IČO: 19197110</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <a href="/obchodni-podminky" target="_blank" rel="noreferrer">Obchodní podmínky</a>
                <a href="/gdpr" target="_blank" rel="noreferrer">Podmínky ochrany osobních údajů</a>
                <a href="/cookies" target="_blank" rel="noreferrer">Soubory Cookie</a>
                <a href="/odpovednost" target="_blank" rel="noreferrer">Odpovědnost</a>
              </div>
            </div>
          </div>

          {/* Pravý sloupec — formulář */}
          <div>
            <h1 style={{ marginBottom: "1rem" }}>Napiš mi</h1>
            <p className="page-lead" style={{ marginBottom: "2rem" }}>
              Potřebuješ se na cokoli zeptat nebo mi chceš něco sdělit? Využij následující
              formulář. Napsat mi můžeš taky na{" "}
              <a href="https://www.facebook.com/zdravimebavi.fb" target="_blank" rel="noreferrer">
                Facebooku
              </a>{" "}
              nebo{" "}
              <a href="https://www.instagram.com/zdravi_me_bavi/" target="_blank" rel="noreferrer">
                Instagramu
              </a>
              . Moc ráda ti odpovím.
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
