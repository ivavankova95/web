import type { Metadata } from "next";
import Image from "next/image";
import { getSanityRouteMetadata } from "@/lib/sanity/loaders";
import { IndividualniContactForm } from "./IndividualniContactForm";
import styles from "./individualni.module.css";

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({
    kind: "servicePage",
    routePath: "/individualni-treninky-benatky-nad-jizerou-a-okoli",
  });
}

export default function IndividualniPage() {
  return (
    <main>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroInner}>
            <div>
              <p className={styles.heroEyebrow}>Individuální tréninky</p>
              <h1 className={styles.heroTitle}>Individuální tréninky (Benátky nad Jizerou a okolí)</h1>
            </div>
            <div className={styles.heroMedia}>
              <Image
                src="/lekce/individualni.jpg"
                alt="Individuální tréninky v Benátkách nad Jizerou"
                width={500}
                height={560}
                className={styles.heroPhoto}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className={styles.about}>
        <div className="container">
          <div className={styles.aboutInner}>
            <Image
              src="/lekce/iva.png"
              alt="Iva Vaňková, certifikovaná kondiční trenérka"
              width={420}
              height={520}
              className={styles.aboutPhoto}
            />
            <div>
              <h2 className={`section-title ${styles.aboutTitle}`}>S kým si zacvičíš?</h2>
              <div className={styles.aboutBody}>
                <p>
                  Jmenuji se Iva Vaňková, jsem certifikovaná kondiční trenérka a poradkyně pro
                  výživu a suplementaci. Zdravým životním stylem se zabývám víc než 10 let.
                  Moje klientky oceňují hlavně mou empatii a celostní zaměření.
                </p>
                <p>
                  Kladu důraz na přirozený pohyb během dne a na správnou techniku cvičení.
                  Výsledkem je nejen postava, se kterou budeš spokojená, ale také silné a
                  funkční tělo, které ti umožní žít každý den naplno.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact form ── */}
      <section className={styles.contact}>
        <div className="container--narrow">
          <h2 className={styles.contactTitle}>Napiš mi</h2>
          <p className={styles.contactIntro}>
            Vyplň formulář a já se ti ozvu na email. Pozor, moje odpověď možná skončí ve složce
            spam/hromadné.
          </p>
          <IndividualniContactForm />
        </div>
      </section>
    </main>
  );
}
