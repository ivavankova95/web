import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { StructuredData } from "@/components/structured-data";
import { getSanityRouteMetadata } from "@/lib/sanity/loaders";
import styles from "./lekce.module.css";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({ kind: "servicePage", routePath: "/lekce-cviceni" });
}

export default function LekceCviceniPage() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Domů", item: "https://www.zdravimebavi.cz/" },
        { "@type": "ListItem", position: 2, name: "Lekce cvičení", item: "https://www.zdravimebavi.cz/lekce-cviceni" }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Tréninky a lekce cvičení",
      url: "https://www.zdravimebavi.cz/lekce-cviceni",
      provider: {
        "@type": "Organization",
        name: "Zdraví mě baví",
        url: "https://www.zdravimebavi.cz"
      },
      serviceType: "Kondiční trénink a lekce cvičení",
      areaServed: "Benátky nad Jizerou",
      offers: [
        {
          "@type": "Offer",
          url: "https://www.zdravimebavi.cz/cviceni-v-benatkach-nad-jizerou",
          name: "Skupinové lekce"
        },
        {
          "@type": "Offer",
          url: "https://www.zdravimebavi.cz/individualni-treninky-benatky-nad-jizerou-a-okoli",
          name: "Individuální tréninky"
        }
      ]
    }
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <main>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroInner}>
            <div>
              <p className={styles.heroEyebrow}>Pohyb a cvičení</p>
              <h1 className={styles.heroTitle}>Tréninky a lekce cvičení</h1>
              <p className={styles.heroLead}>
                Zacvič se mnou naživo nebo online. Provedu tě kondičním tréninkem a pomohu ti
                vybudovat svaly i vytvarovat postavu.
              </p>
              <ul className={styles.heroBenefits}>
                <li className={styles.heroBenefitsItem}>
                  <span className={styles.heroBenefitsIcon}>❤️</span>
                  <span>Cvičení pod mým vedením ti pomůže nejen ke krásné postavě, ale také k silnému a funkčnímu tělu.</span>
                </li>
                <li className={styles.heroBenefitsItem}>
                  <span className={styles.heroBenefitsIcon}>❤️</span>
                  <span>Naučíš se správnou techniku cvičení a zpevníš střed těla, ze kterého vychází celková síla.</span>
                </li>
                <li className={styles.heroBenefitsItem}>
                  <span className={styles.heroBenefitsIcon}>❤️</span>
                  <span>Z lekce odejdeš s dobrou náladou. Užiješ si milou atmosféru a poskytnu ti maximální podporu.</span>
                </li>
              </ul>
            </div>
            <div className={styles.heroMedia}>
              <Image
                src="/lekce/hero.jpg"
                alt="Lekce cvičení s Ivou Vaňkovou"
                width={480}
                height={560}
                className={styles.heroPhoto}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className={styles.services}>
        <div className="container">
          <h2 className={`section-title section-title--center ${styles.servicesTitle}`}>
            Kdy a kde cvičíme?
          </h2>
          <div className={styles.servicesGrid}>
            {/* Skupinové lekce */}
            <div className={styles.serviceCard}>
              <Image
                src="/lekce/skupinove.jpg"
                alt="Skupinové lekce cvičení Benátky nad Jizerou"
                width={600}
                height={400}
                className={styles.serviceCardImg}
              />
              <div className={styles.serviceCardBody}>
                <h3 className={styles.serviceCardTitle}>Skupinové lekce (Benátky nad Jizerou)</h3>
                <p className={styles.serviceCardDesc}>
                  Na lekcích intervalového tréninku střídáme cviky pro zlepšení kondice
                  a posilování s vlastní vahou i s pomůckami. Každý cvik ti ukážu ve více
                  variantách podle obtížnosti.
                  <br /><br />
                  Čeká tě perfektní kombinace pomalejšího a rychlejšího cvičení, kde si najdeš
                  to svoje.
                </p>
                <ul className={styles.serviceCardMeta}>
                  <li className={styles.serviceCardMetaItem}>
                    <span className={styles.serviceCardMetaIcon}>✓</span>
                    <span>Čtvrtek 18:00 – 19:00</span>
                  </li>
                  <li className={styles.serviceCardMetaItem}>
                    <span className={styles.serviceCardMetaIcon}>✓</span>
                    <span>TJ Sokol Benátky nad Jizerou, Ladislava Vágnera 87/17</span>
                  </li>
                  <li className={styles.serviceCardMetaItem}>
                    <span className={styles.serviceCardMetaIcon}>✓</span>
                    <span>V hezkém počasí cvičíme venku</span>
                  </li>
                </ul>
                <p className={styles.serviceCardPrice}>120 Kč / lekce</p>
                <div className={styles.serviceCardCta}>
                  <Link
                    href="/cviceni-v-benatkach-nad-jizerou"
                    className="btn btn-primary"
                  >
                    Chci si zacvičit se skvělou partou
                  </Link>
                </div>
              </div>
            </div>

            {/* Individuální tréninky */}
            <div className={styles.serviceCard}>
              <Image
                src="/lekce/individualni.jpg"
                alt="Individuální tréninky s Ivou Vaňkovou"
                width={600}
                height={400}
                className={styles.serviceCardImg}
              />
              <div className={styles.serviceCardBody}>
                <h3 className={styles.serviceCardTitle}>Individuální tréninky (Benátky nad Jizerou a okolí)</h3>
                <p className={styles.serviceCardDesc}>
                  Nemáš čas chodit na skupinovky nebo radši cvičíš v soukromí? Ráda pro tebe
                  připravím individuální lekci na míru.
                  <br /><br />
                  Můžeme se sejít u tebe doma, venku nebo v sokolovně v Benátkách a ukážu ti,
                  jak si můžeš parádně zacvičit s vybavením, které máš k dispozici u sebe doma.
                  I kdyby to byla jen židle a ručník :).
                </p>
                <ul className={styles.serviceCardMeta}>
                  <li className={styles.serviceCardMetaItem}>
                    <span className={styles.serviceCardMetaIcon}>✓</span>
                    <span>Vysvětlení vhodných cviků a správné techniky</span>
                  </li>
                  <li className={styles.serviceCardMetaItem}>
                    <span className={styles.serviceCardMetaIcon}>✓</span>
                    <span>Diagnostika pohybového aparátu</span>
                  </li>
                  <li className={styles.serviceCardMetaItem}>
                    <span className={styles.serviceCardMetaIcon}>✓</span>
                    <span>Délka lekce 60 minut</span>
                  </li>
                  <li className={styles.serviceCardMetaItem}>
                    <span className={styles.serviceCardMetaIcon}>✓</span>
                    <span>Možnost sdílení nákladů s kamarádkou</span>
                  </li>
                </ul>
                <p className={styles.serviceCardPrice}>890 Kč / lekce</p>
                <div className={styles.serviceCardCta}>
                  <Link
                    href="/individualni-treninky-benatky-nad-jizerou-a-okoli"
                    className="btn btn-primary"
                  >
                    Potřebuji individuální lekci
                  </Link>
                </div>
              </div>
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
              <h2 className={`section-title ${styles.aboutTitle}`}>
                S kým si zacvičíš?
              </h2>
              <div className={styles.aboutBody}>
                <p>
                  Jmenuji se Iva Vaňková, jsem certifikovaná kondiční trenérka a poradkyně pro
                  výživu a suplementaci. Zdravým životním stylem se zabývám víc než 10 let. Moje
                  klientky oceňují hlavně mou empatii a celostní zaměření.
                </p>
                <p>
                  Kladu důraz na přirozený pohyb během dne a na správnou techniku cvičení.
                  Výsledkem je nejen postava, se kterou budeš spokojená, ale také silné a funkční
                  tělo, které ti umožní žít každý den naplno.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured testimonial ── */}
      <section className={styles.testimonial}>
        <div className="container--narrow">
          <div className={styles.testimonialInner}>
            <h2 className={`section-title ${styles.testimonialTitle}`}>
              Přečti si referenci na tréninky pod mým vedením
            </h2>
            <div className={styles.testimonialCard}>
              <Image
                src="/lekce/recenze-ivana.png"
                alt="Ivana Staňková"
                width={120}
                height={120}
                className={styles.testimonialPhoto}
              />
              <p className={styles.testimonialQuote}>
                Na tréninky chodím pravidelně. Líbí se mi kombinace silového a kondičního
                cvičení. Lekce je pokaždé jiná, proto mě vždycky baví. Super je také tvůj
                pozitivní přístup, který motivuje.
              </p>
              <cite className={styles.testimonialCite}>Ivana Staňková</cite>
            </div>
          </div>
        </div>
      </section>

      {/* ── More references ── */}
      <section className={styles.references}>
        <div className="container">
          <h2 className={`section-title section-title--center ${styles.referencesTitle}`}>
            Další reference
          </h2>
          <div className={styles.referencesGrid}>
            {(
              [
                { src: "/lekce/recenze1.jpg", alt: "Reference na lekce cvičení 1" },
                { src: "/lekce/recenze2.jpg", alt: "Reference na lekce cvičení 2" },
              ] as const
            ).map((img) => (
              <Image
                key={img.src}
                src={img.src}
                alt={img.alt}
                width={600}
                height={400}
                className={styles.referenceImg}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className={styles.finalCta}>
        <div className="container">
          <div className={styles.finalCtaInner}>
            <p className={styles.finalCtaText}>Připravena začít cvičit?</p>
            <div className={styles.finalCtaButtons}>
              <Link
                href="/cviceni-v-benatkach-nad-jizerou"
                className={styles.finalCtaBtnWhite}
              >
                Skupinové lekce
              </Link>
              <Link
                href="/individualni-treninky-benatky-nad-jizerou-a-okoli"
                className={styles.finalCtaBtnWhite}
              >
                Individuální tréninky
              </Link>
            </div>
          </div>
        </div>
      </section>
      </main>
    </>
  );
}
