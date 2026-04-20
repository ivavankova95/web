import type { Metadata } from "next";
import Image from "next/image";
import { StructuredData } from "@/components/structured-data";
import styles from "./about-me-sections.module.css";
import { getSanityRouteMetadata } from "@/lib/sanity/loaders";

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({ kind: "page", routePath: "/o-mne" });
}

export default function AboutMePage() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Domů", item: "https://www.zdravimebavi.cz/" },
        { "@type": "ListItem", position: 2, name: "O mně", item: "https://www.zdravimebavi.cz/o-mne" }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Iva Vaňková",
      url: "https://www.zdravimebavi.cz/o-mne",
      image: "https://www.zdravimebavi.cz/hero-iva-new.png",
      jobTitle: "Kondiční trenérka a poradkyně pro výživu",
      worksFor: {
        "@type": "Organization",
        name: "Zdraví mě baví",
        url: "https://www.zdravimebavi.cz"
      },
      sameAs: [
        "https://www.facebook.com/zdravimebavi.fb",
        "https://www.instagram.com/zdravi_me_bavi/"
      ]
    }
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <div className="about-me-page">
      {/* ─── Hero Section ────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <p className="eyebrow">Kdo jsem?</p>
            <h1 className={styles.heroTitle}>Ahoj, jmenuji se Iva</h1>
            <div className={styles.heroBody}>
              <p>
                Jmenuji se <strong>Iva Vaňková</strong>, jsem certifikovaná kondiční{" "}
                <strong>trenérka</strong> a <strong>poradkyně pro výživu</strong> a suplementaci.
                Zdravým životním stylem se zabývám víc než <strong>10 let</strong>.
              </p>
              <p style={{ marginTop: "1rem" }}>
                Naučím tě, jak poskládat <strong>pohyb</strong>, <strong>výživu</strong> a celkovou{" "}
                <strong>péči o sebe</strong> tak, aby to zapadalo do tvého každodenního života.
              </p>
              <p style={{ marginTop: "1rem" }}>
                I ty můžeš mít <strong>silné a funkční tělo</strong>, ve kterém se budeš{" "}
                <strong>cítit skvěle</strong>. Stačí vědět, jak na to. Ráda ti to ukážu a předám ti
                mé znalosti a zkušenosti.
              </p>
            </div>
          </div>

          <div className={styles.heroMedia}>
            <Image
              src="/hero-iva-new.png"
              alt="Iva Vaňková"
              width={480}
              height={600}
              className={styles.heroPhoto}
              priority
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/podpis.png" alt="Podpis Iva" className={styles.heroPodpis} />
          </div>
        </div>
      </section>

      {/* ─── Principles Section ─────────────────────────────── */}
      <section className={styles.principles}>
        <div className="container">
          <div className={styles.principlesTitle}>
            <p className="eyebrow">Moje vize</p>
            <h2 className="section-title">5 zásad mé práce</h2>
          </div>
          <div className={styles.principlesGrid}>
            <div className={styles.principleCard}>
              <span className={styles.principleNumber}>01</span>
              <h3 className={styles.principleTitle}>Individualita</h3>
              <p className={styles.principleBody}>
                Dostaneš doporučení, která ti <strong>dokonale sednou</strong>. Žádný univerzální
                jídelníček a předepsaný pohyb podle tabulek.
              </p>
            </div>
            <div className={styles.principleCard}>
              <span className={styles.principleNumber}>02</span>
              <h3 className={styles.principleTitle}>Udržitelnost</h3>
              <p className={styles.principleBody}>
                Tvůj nový životní styl bude <strong>dlouhodobě realizovatelný</strong>. Nechci po
                tobě extrémní výkony ani vyřazení určitých potravin.
              </p>
            </div>
            <div className={styles.principleCard}>
              <span className={styles.principleNumber}>03</span>
              <h3 className={styles.principleTitle}>Dostupnost</h3>
              <p className={styles.principleBody}>
                Žít zdravě můžeš bez speciálních výživových doplňků i bez členství ve fitku.
                Využiješ jen <strong>to, co máš k dispozici</strong>.
              </p>
            </div>
            <div className={styles.principleCard}>
              <span className={styles.principleNumber}>04</span>
              <h3 className={styles.principleTitle}>Komplexnost</h3>
              <p className={styles.principleBody}>
                Kromě zajištění <strong>dostatku všech živin</strong> se zaměříme na tvou{" "}
                <strong>hormonální rovnováhu</strong>, <strong>spánek</strong> a celkovou{" "}
                <strong>pohodu</strong>.
              </p>
            </div>
            <div className={styles.principleCard}>
              <span className={styles.principleNumber}>05</span>
              <h3 className={styles.principleTitle}>Nezávislost</h3>
              <p className={styles.principleBody}>
                Osvojíš si <strong>návyky</strong>, které ti pomohou{" "}
                <strong>pokračovat</strong> po cestě zdravého životního stylu i po skončení naší
                spolupráce.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How I Work Section ────────────────────────────── */}
      <section className="section">
        <div className="container--narrow prose">
          <h2 className="section-title section-title--center">Jakým způsobem pracuji?</h2>
          <p>
            Vyzkoušela jsem si několik výživových směrů a přístupů k pohybu. Postupně jsem zjistila,
            že nejlepší je vzít si z každého jen tu část, která mi sedí. A přesně to bych přála každé
            ženě – <strong>najít svou vlastní nejlepší cestu</strong>, která vede do cíle. Každá
            potřebujeme něco jiného, a já to ve své práci naprosto respektuji. Nebudu se tě snažit
            napasovat do univerzálních pohybových doporučení nebo tlačit do určitého výživového
            směru. Společně sestavíme tvůj <strong>jedinečný zdravý životní styl</strong>, který ti
            bude každý den dělat <strong>radost</strong>. Zdravý životní styl vnímám jako skládačku.
            Naše zdraví je ovlivněno nejen jídlem a pohybem, ale také kvalitním spánkem, dostatečným
            odpočinkem, životním nastavením, blízkými lidmi kolem nás a mnoha dalšími faktory.{" "}
            <strong>Všechno souvisí se vším</strong> a jednotlivé části skládačky do sebe musí
            zapadat.
          </p>
          <p>
            V oblasti výživy nejsem zastánce zákazů a omezování. Naopak se podíváme, co můžeš do
            svého jídelníčku přidat, abys měla <strong>dostatek</strong> všeho potřebného pro{" "}
            <strong>zdraví a celkovou pohodu</strong>. Ať už chceš zhubnout, přibrat, osvojit si
            zdravé návyky nebo máš jakýkoli jiný cíl, vždy je pro mě důležité, aby ti na tvé cestě
            bylo dobře.
          </p>
          <p>
            Má trenérská praxe stojí na <strong>pevném středu těla</strong>, ze kterého vychází
            celková síla. Je pro mě zásadní, aby pohyb přispíval ke zdraví a nestal se jen nástrojem
            ke spalování kalorií a růstu svalů. Kladu důraz na <strong>přirozený pohyb</strong>{" "}
            během dne a <strong>správnou techniku</strong> při cvičení. Výsledkem je nejen{" "}
            <strong>krásná postava</strong>, ale také silné a <strong>funkční tělo</strong>, které ti
            umožní <strong>žít každý den naplno</strong>.
          </p>
        </div>
      </section>

      {/* ─── Certifications Section ────────────────────────── */}
      <section className={styles.certs}>
        <div className="container">
          <h2 className={`section-title ${styles.certsTitle}`}>Moje certifikace</h2>
          <p className={styles.certsIntro}>
            Jsem nadšená studentka. <strong>Neustále hledám</strong> nové vědecké poznatky ze světa
            výživy a pohybu, <strong>čtu studie</strong> a <strong>sleduji autority</strong> v oboru.
            Informace vkládám do <strong>kontextu ženského zdraví</strong> a předávám tobě tak, abys
            už nic hledat nemusela. <strong>Certifikace instruktora fittness</strong> a{" "}
            <strong>poradce pro výživu a suplementaci</strong> je pro mě pevným základem, na kterém
            každý den stavím a přidávám nové vědomosti.
          </p>
          <div className={styles.certsGrid}>
            <div className={styles.certItem}>
              <div className={styles.certImageWrap}>
                <Image
                  src="/cert-vyziva.png"
                  alt="Certifikát poradce pro výživu"
                  width={600}
                  height={420}
                  className={styles.certImage}
                />
              </div>
              <p className={styles.certText}>
                Absolvovala jsem půlroční intenzivní výživový kurz se zaměřením na celostní přístup
                ke stravování.
              </p>
            </div>
            <div className={styles.certItem}>
              <div className={styles.certImageWrap}>
                <Image
                  src="/cert-fitness.jpg"
                  alt="Certifikát instruktor fitness"
                  width={600}
                  height={420}
                  className={styles.certImage}
                />
              </div>
              <p className={styles.certText}>
                Trenérský kurz akreditovaný MŠMT jsem zakončila závěrečnou prací na téma cvičení v
                těhotenství.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Fun Facts Section ─────────────────────────────── */}
      <section className="section" style={{ background: "var(--color-surface-alt)" }}>
        <div className="container--narrow">
          <h2 className="section-title">Co by tě ještě mohlo zajímat?</h2>
          <ul className={styles.funFacts}>
            <li>
              Vystudovala jsem ekonomii a projekt Zdraví mě baví vznikl jako podklad pro mou
              diplomovou práci.
            </li>
            <li>
              Zjistila jsem, že mě víc baví počítat odcvičené dřepy než zisky firem. A proto jsem
              teď tady.
            </li>
            <li>Já i můj manžel jsme věřící.</li>
            <li>
              Mám malou dceru Amálku. Vím, jak náročné je žít zdravě, když není čas a energie
              nazbyt. Ale ukážu ti, že to jde.
            </li>
            <li>Jsem hrdou členkou Sokola jako instruktorka intervalového tréninku.</li>
            <li>Spoustu let jsem hrála na příčnou flétnu a tančila.</li>
            <li>Miluju hořkou čokoládu. Tak moc, že už se to o mně docela ví.</li>
          </ul>
        </div>
      </section>

      </div>
    </>
  );
}
