import Image from "next/image";
import type { Metadata } from "next";
import { NewsletterForm } from "./newsletter-form";
import styles from "./newsletter.module.css";

export const metadata: Metadata = {
  title: "Novinky od Ivy | Zdraví mě baví",
  description: "Tipy na pohyb, nápady do kuchyně a novinky od Ivy přímo do e-mailu.",
  alternates: { canonical: "https://www.zdravimebavi.cz/odber-novinek" },
};

export default function NewsletterPage() {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.layout}`}>
        <div className={styles.content}>
          <h1>Novinky od Ivy</h1>
          <p className="page-lead">
            Pohyb, který tě baví, a jídlo, které ti chutná. Občas ti pošlu tipy na cvičení,
            nápady do kuchyně a novinky ze Zdraví mě baví.
          </p>
          <NewsletterForm preview={process.env.CONTEXT === "deploy-preview"} />
        </div>
        <div className={styles.portrait}>
          <Image
            src="/hero-iva-new.png"
            alt="Iva Vaňková"
            fill
            loading="eager"
            sizes="(max-width: 680px) 90vw, 464px"
            className={styles.photo}
          />
        </div>
      </div>
    </section>
  );
}
