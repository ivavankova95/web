import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { StructuredData } from "@/components/structured-data";
import { getSanityRouteMetadata } from "@/lib/sanity/loaders";
import { CviceniContactForm } from "./CviceniContactForm";
import styles from "./skupinove.module.css";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({ kind: "servicePage", routePath: "/cviceni-v-benatkach-nad-jizerou" });
}

export default function CviceniPage() {
  const faqItems = [
    ["Kdy se cvičí?", "Lekce jsou ve čtvrtek od 18:00 do 19:00."],
    ["Kde se cvičí?", "Cvičíme v benátské sokolovně na adrese Ladislava Vágnera 87/17. Od jara do podzimu cvičíme za hezkého počasí venku."],
    ["Jaká je cena za lekci?", "Jedna lekce stojí 120 Kč a platí se hotově na místě nebo přes QR kód."],
    ["Jak probíhá přihlašování na lekce?", "V den lekce dopoledne vkládám do WhatsApp skupiny anketu. Pokud se do 15 hodin přihlásí alespoň 5 zájemců, lekce se koná."],
    ["Kolik lidí se musí přihlásit, aby se lekce konala?", "Lekce se koná, pokud se přihlásí alespoň 5 lidí."],
    ["Jak přesně probíhá lekce?", "Začínáme zahřátím a mobilitou, pokračujeme aktivací středu těla a poté intervalovým tréninkem 45 vteřin cvičení a 15 vteřin odpočinku."]
  ] as const;

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Domů", item: "https://www.zdravimebavi.cz/" },
        { "@type": "ListItem", position: 2, name: "Lekce cvičení", item: "https://www.zdravimebavi.cz/lekce-cviceni" },
        { "@type": "ListItem", position: 3, name: "Cvičení v Benátkách nad Jizerou", item: "https://www.zdravimebavi.cz/cviceni-v-benatkach-nad-jizerou" }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Cvičení v Benátkách nad Jizerou",
      url: "https://www.zdravimebavi.cz/cviceni-v-benatkach-nad-jizerou",
      description: "Skupinové lekce pro sílu a kondici pod vedením Ivy Vaňkové v Benátkách nad Jizerou.",
      provider: {
        "@type": "Organization",
        name: "Zdraví mě baví",
        url: "https://www.zdravimebavi.cz"
      },
      areaServed: "Benátky nad Jizerou",
      offers: {
        "@type": "Offer",
        url: "https://www.zdravimebavi.cz/cviceni-v-benatkach-nad-jizerou"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer
        }
      }))
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
              <p className={styles.heroEyebrow}>Skupinové lekce</p>
              <h1 className={styles.heroTitle}>Cvičení v Benátkách nad Jizerou</h1>
              <p className={styles.heroSubtitle}>skupinové lekce pro sílu a kondici</p>
              <ul className={styles.heroMeta}>
                <li className={styles.heroMetaItem}>
                  <span className={styles.heroMetaIcon}>✓</span>
                  <span>Čtvrtek 18:00 – 19:00</span>
                </li>
                <li className={styles.heroMetaItem}>
                  <span className={styles.heroMetaIcon}>✓</span>
                  <span>TJ Sokol Benátky nad Jizerou, Ladislava Vágnera 87/17</span>
                </li>
                <li className={styles.heroMetaItem}>
                  <span className={styles.heroMetaIcon}>✓</span>
                  <span>Od jara do podzimu cvičíme za hezkého počasí venku</span>
                </li>
                <li className={styles.heroMetaItem}>
                  <span className={styles.heroMetaIcon}>✓</span>
                  <span>Cena lekce je 120 Kč</span>
                </li>
              </ul>
              <Link href="#contact-form" className="btn btn-primary">
                Chci si zacvičit se skvělou partou
              </Link>
            </div>
            <div className={styles.heroMedia}>
              <Image
                src="/skupinove/hero.jpg"
                alt="Skupinové cvičení v Benátkách nad Jizerou"
                width={500}
                height={560}
                className={styles.heroPhoto}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Pain points ── */}
      <section className={styles.painPoints}>
        <div className="container">
          <ul className={styles.painList}>
            <li className={styles.painItem}>
              <span className={styles.painIconWrap}>❤️</span>
              <span>Chceš pracovat na svojí <strong>kondici</strong>?</span>
            </li>
            <li className={styles.painItem}>
              <span className={styles.painIconWrap}>❤️</span>
              <span>Baví tě <strong>posilování</strong> s vlastní vahou i s pomůckami?</span>
            </li>
            <li className={styles.painItem}>
              <span className={styles.painIconWrap}>❤️</span>
              <span>Potřebuješ si být jistá <strong>správným provedením</strong> cviků?</span>
            </li>
            <li className={styles.painItem}>
              <span className={styles.painIconWrap}>❤️</span>
              <span>Hledáš profesionální vedení a milou <strong>podporu</strong>?</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ── Description ── */}
      <section className={styles.description}>
        <div className="container">
          <div className={styles.descriptionInner}>
            <div>
              <h2 className={`section-title ${styles.descriptionTitle}`}>
                Přijď na lekci intervalového tréninku!
              </h2>
              <div className={styles.descriptionBody}>
                <p>Vystřídáš cviky pro zlepšení kondice a posilování s vlastní vahou i s pomůckami.</p>
                <p>
                  Čeká tě cvičení v časových intervalech (45 vteřin cvičení, 15 vteřin pauza).
                  Je jen na tobě, kolik opakování stihneš nebo jak intenzivně budeš cvičit.
                </p>
                <p>
                  Každý cvik ti ukážu ve více variantách podle obtížnosti, takže si skvěle
                  zacvičíš, ať jsi úplný začátečník, nebo pokročilý sportovec.
                </p>
                <p>
                  Navíc si užiješ pozitivní energii, týmovou motivaci a úžasný pocit, že jsi
                  60 minut věnovala jen sobě.
                </p>
              </div>
            </div>
            <Image
              src="/lekce/skupinove.jpg"
              alt="Skupinové lekce cvičení"
              width={480}
              height={400}
              className={styles.descriptionPhoto}
            />
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className={styles.benefits}>
        <div className="container">
          <h2 className={`section-title section-title--center ${styles.benefitsTitle}`}>
            Co tě čeká?
          </h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <span className={styles.benefitIcon}>❤️</span>
              <p className={styles.benefitText}>Perfektní kombinace pomalejšího a rychlejšího cvičení</p>
            </div>
            <div className={styles.benefitCard}>
              <span className={styles.benefitIcon}>❤️</span>
              <p className={styles.benefitText}>Druhý den tě nebudou bolet bedra ani kolena</p>
            </div>
            <div className={styles.benefitCard}>
              <span className={styles.benefitIcon}>❤️</span>
              <p className={styles.benefitText}>Vybereš si obtížnost cviků podle tvých možností</p>
            </div>
            <div className={styles.benefitCard}>
              <span className={styles.benefitIcon}>❤️</span>
              <p className={styles.benefitText}>Se skvělou partou a profesionálním vedením si trénink naplno užiješ</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className={styles.about}>
        <div className="container">
          <div className={styles.aboutInner}>
            <Image
              src="/skupinove/iva.png"
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
                  výživu a suplementaci.
                </p>
                <p>
                  Při vedení skupinových lekcí je pro mě zásadní, aby měl každý příležitost dát
                  do cvičení maximum ze svých možností a zároveň se na tréninku cítil dobře.
                  Ukazuju, kontroluju, rovnám, povzbuzuju, … prostě dělám všechno pro to, abych
                  do skupinových lekcí přinesla individuální přístup.
                </p>
                <p>
                  Moje klientky oceňují hlavně mou empatii a celostní zaměření. Učím, jak cvičit
                  efektivně a s respektem ke svému tělu. Razím heslo, že kvalita je víc než
                  kvantita.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className={styles.faq}>
        <div className="container--narrow">
          <h2 className={`section-title section-title--center ${styles.faqTitle}`}>
            Často kladené otázky
          </h2>
          <div className={styles.faqList}>
            <details className={styles.faqItem}>
              <summary>Kdy se cvičí?</summary>
              <div className={styles.faqAnswer}><p>Lekce jsou ve čtvrtek od 18:00 do 19:00.</p></div>
            </details>
            <details className={styles.faqItem}>
              <summary>Kde se cvičí?</summary>
              <div className={styles.faqAnswer}>
                <p>Cvičíme v benátské sokolovně (Ladislava Vágnera 87/17) v menším sále v 1. patře. Od jara do podzimu cvičíme za hezkého počasí venku (areál fotbalového stadionu).</p>
              </div>
            </details>
            <details className={styles.faqItem}>
              <summary>Jaká je cena za lekci?</summary>
              <div className={styles.faqAnswer}><p>Jedna lekce stojí 120 Kč a platí se hotově na místě nebo přes QR kód.</p></div>
            </details>
            <details className={styles.faqItem}>
              <summary>Jak probíhá přihlašování na lekce?</summary>
              <div className={styles.faqAnswer}>
                <p>V den lekce dopoledne vkládám do WhatsApp skupiny anketu. Stačí označit „ano", když se chystáš přijít. Pokud se do 15 hod. přihlásí 5 zájemců, lekce se koná.</p>
              </div>
            </details>
            <details className={styles.faqItem}>
              <summary>Co když se přihlásím, ale nakonec zjistím, že nemůžu přijít?</summary>
              <div className={styles.faqAnswer}>
                <p>Nic se neděje, jen dej co nejdřív vědět ve WhatsApp skupině. Pokud se neodhlásíš do 3 hodin před začátkem lekce a nedorazíš, je potřeba zaplatit i tak.</p>
              </div>
            </details>
            <details className={styles.faqItem}>
              <summary>Kolik lidí se musí přihlásit, aby se lekce konala?</summary>
              <div className={styles.faqAnswer}><p>Cvičíme, pokud se přihlásí aspoň 5 lidí.</p></div>
            </details>
            <details className={styles.faqItem}>
              <summary>Co si mám vzít na cvičení s sebou?</summary>
              <div className={styles.faqAnswer}>
                <p>S sebou je fajn mít pití, podložku nebo ručník a kdo chce, může si přinést ještě činky 1–2 kg. V sokolovně je k zapůjčení podložka a činky o váze 1 kg.</p>
              </div>
            </details>
            <details className={styles.faqItem}>
              <summary>Jak přesně probíhá lekce?</summary>
              <div className={styles.faqAnswer}>
                <p>Začínáme zahřátím a mobilitou, následuje aktivace středu těla a pak už se vrhneme na intervaly. Cvičíme 45 vteřin a 15 vteřin odpočíváme. Po zvládnutí jedné sady cviků máme minutovou pauzu. Na konci lekce je čas na krátké protažení.</p>
              </div>
            </details>
            <details className={styles.faqItem}>
              <summary>Co když cvičení nebudu zvládat?</summary>
              <div className={styles.faqAnswer}>
                <p>To se určitě nestane, budeš mít na výběr z více variant cviků podle obtížnosti. Zacvičíš si podle svých možností, i když jsi úplný začátečník.</p>
              </div>
            </details>
            <details className={styles.faqItem}>
              <summary>Mám skvělou kondici. Jsou tréninky i pro mě?</summary>
              <div className={styles.faqAnswer}><p>Ano, bude to výzva i pro tebe!</p></div>
            </details>
            <details className={styles.faqItem}>
              <summary>Jsou tréninky jen pro ženy?</summary>
              <div className={styles.faqAnswer}>
                <p>Mohou přijít i muži. Zatím se to mockrát nestalo, ale jestli jsi muž a chceš si zacvičit, pojď do toho!</p>
              </div>
            </details>
            <details className={styles.faqItem}>
              <summary>Co když chci přijít, ale nemám hlídání pro děti?</summary>
              <div className={styles.faqAnswer}><p>Vezmi děti s sebou, malí trenéři jsou vítáni.</p></div>
            </details>
          </div>
        </div>
      </section>

      {/* ── Testimonial ── */}
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
                cvičení. Lekce je pokaždé trochu jiná a proto mě vždycky baví. Také je super
                tvůj pozitivní přístup, který vždycky namotivuje k lepším výkonům.
              </p>
              <cite className={styles.testimonialCite}>Ivana Staňková, maminka na mateřské dovolené</cite>
            </div>
          </div>
        </div>
      </section>

      {/* ── References ── */}
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
              <Image key={img.src} src={img.src} alt={img.alt} width={600} height={400} className={styles.referenceImg} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact form ── */}
      <section className={styles.contact}>
        <div className="container--narrow">
          <h2 className={styles.contactTitle}>Dej mi vědět, že chceš na lekci přijít</h2>
          <p className={styles.contactIntro}>
            <strong>Máš ještě nějaké otázky? Vyplň formulář</strong> a já se ti ozvu na{" "}
            <strong>e-mail</strong>.<br />
            Pozor, moje odpověď možná skončí ve složce spam/hromadné.
          </p>
          <p className={styles.contactIntro}>
            Nebo se rovnou přidej do <strong>WhatsApp skupiny</strong>, kde ve čtvrtek ráno
            probíhá přihlašování. Odkaz pro vstup do skupiny je{" "}
            <a href="https://chat.whatsapp.com/J50NK0OcDW734gpbwEYfkT" target="_blank" rel="noopener noreferrer">
              tady
            </a>
            .
          </p>
          <CviceniContactForm />
        </div>
      </section>
      </main>
    </>
  );
}
