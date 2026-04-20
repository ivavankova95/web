import type { Metadata } from "next";
import Image from "next/image";
import { StructuredData } from "@/components/structured-data";
import { getSanityRouteMetadata } from "@/lib/sanity/loaders";
import { EbookBuyButton } from "./EbookBuyButton";
import styles from "./ebook.module.css";

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({ kind: "offerPage", routePath: "/e-book-jak-sestavit-jidelnicek" });
}

export default function EbookPage() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Domů", item: "https://www.zdravimebavi.cz/" },
        { "@type": "ListItem", position: 2, name: "E-book Manuál pro mámy", item: "https://www.zdravimebavi.cz/e-book-jak-sestavit-jidelnicek" }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "E-book Manuál pro mámy",
      description: "Praktický e-book, který pomáhá sestavit jídelníček bez diet a zbytečného stresu.",
      image: [
        "https://www.zdravimebavi.cz/ebook/mockup.png",
        "https://www.zdravimebavi.cz/ebook/mockup-kniha.png"
      ],
      brand: {
        "@type": "Brand",
        name: "Zdraví mě baví"
      },
      offers: {
        "@type": "Offer",
        price: "1485",
        priceCurrency: "CZK",
        availability: "https://schema.org/InStock",
        url: "https://www.zdravimebavi.cz/e-book-jak-sestavit-jidelnicek"
      }
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
              <p className={styles.heroEyebrow}>E-book</p>
              <h1 className={styles.heroTitle}>MANUÁL PRO MÁMY</h1>
              <p className={styles.heroLead}>
                Jak sestavit jídelníček, který zvládneš dodržet za každé situace.
              </p>
              <EbookBuyButton className="btn btn-primary" label="CHCI E-BOOK!" />
            </div>
            <div className={styles.heroMedia}>
              <Image
                src="/ebook/mockup.png"
                alt="E-book Manuál pro mámy – jak sestavit jídelníček"
                width={420}
                height={500}
                className={styles.heroMockup}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Pain points ── */}
      <section className={styles.painPoints}>
        <div className="container">
          <h2 className={`section-title section-title--center ${styles.painPointsTitle}`}>
            Poznáváš se v těchto myšlenkách?
          </h2>
          <div className={styles.painGrid}>
            <div className={styles.painCard}>
              <div className={styles.painIcon}>❓</div>
              <p className={styles.painText}>
                Všude je tolik informací o výživě, je to tak <strong>složité</strong>.
              </p>
            </div>
            <div className={styles.painCard}>
              <div className={styles.painIcon}>❓</div>
              <p className={styles.painText}>
                Jak jíst zdravě a <strong>neřešit jen jídlo</strong> většinu dne?
              </p>
            </div>
            <div className={styles.painCard}>
              <div className={styles.painIcon}>❓</div>
              <p className={styles.painText}>
                Chci zhubnout, ale <strong>diety mi nefungují</strong>.
              </p>
            </div>
            <div className={styles.painCard}>
              <div className={styles.painIcon}>❓</div>
              <p className={styles.painText}>
                Potřebuji <strong>jednoduchý návod</strong>, jak na zdravý jídelníček.
              </p>
            </div>
            <div className={styles.painCard}>
              <div className={styles.painIcon}>❓</div>
              <p className={styles.painText}>
                <strong>Nemám čas</strong> žít zdravě.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Promise ── */}
      <section className={styles.promise}>
        <div className="container--narrow">
          <p className={styles.promiseText}>
            Provede tě krok za krokem k jídelníčku, který ti{" "}
            <strong>dodá energii</strong>, podpoří tvé zdraví a pomůže ti k{" "}
            <strong>vysněné postavě</strong>. Vyřeš svůj jídelníček{" "}
            <strong>jednou provždy</strong>.
          </p>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className={styles.benefits}>
        <div className="container">
          <div className={styles.benefitsInner}>
            <ul className={styles.benefitsList}>
              <li className={styles.benefitsItem}>
                <span className={styles.benefitsIcon}>❤️</span>
                <span>
                  Osvojíš si <strong>zdravé návyky</strong>, které využiješ každý den.
                </span>
              </li>
              <li className={styles.benefitsItem}>
                <span className={styles.benefitsIcon}>❤️</span>
                <span>
                  Budeš <strong>jíst normálně</strong> – žádné počítání kalorií ani zakázané
                  potraviny.
                </span>
              </li>
              <li className={styles.benefitsItem}>
                <span className={styles.benefitsIcon}>❤️</span>
                <span>
                  Zvládneš to, i když <strong>nemáš čas</strong>.
                </span>
              </li>
              <li className={styles.benefitsItem}>
                <span className={styles.benefitsIcon}>❤️</span>
                <span>
                  Naučíš se unikátní metodou sestavit jídelníček{" "}
                  <strong>podle tvých cílů</strong>.
                </span>
              </li>
              <li className={styles.benefitsItem}>
                <span className={styles.benefitsIcon}>❤️</span>
                <span>
                  Zjistíš, že <strong>jíst zdravě je jednoduché</strong>.
                </span>
              </li>
            </ul>

            <div className={styles.benefitsRight}>
              <h2 className={styles.benefitsSubTitle}>
                Podívej se na proměny mých klientek
              </h2>
              <div className={styles.promenyGrid}>
                <Image
                  src="/ebook/klientka1.jpg"
                  alt="Proměna klientky 1"
                  width={400}
                  height={300}
                  className={styles.promenyPhoto}
                />
                <Image
                  src="/ebook/klientka2.jpg"
                  alt="Proměna klientky 2"
                  width={400}
                  height={300}
                  className={styles.promenyPhoto}
                />
                <Image
                  src="/ebook/klientka3.jpg"
                  alt="Proměna klientky 3"
                  width={400}
                  height={300}
                  className={styles.promenyPhoto}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className={styles.features}>
        <div className="container">
          <div className={styles.featuresInner}>
            <div>
              <h2 className={`section-title ${styles.featuresTitle}`}>
                Zjisti, jak na výživu i pohyb kolem sportu
              </h2>
              <div className={styles.featureCards}>
                <div className={styles.featureCard}>
                  <span className={styles.featureCardIcon}>🧁</span>
                  <p className={styles.featureCardBody}>
                    V e-booku najdeš <strong>přesný návod, co jíst</strong> podle tvého konkrétního
                    cíle. V jídle budeš mít <strong>navždy svobodu</strong> a přestaneš se kvůli
                    jídelníčku stresovat.
                  </p>
                </div>
                <div className={styles.featureCard}>
                  <span className={styles.featureCardIcon}>🏋️</span>
                  <p className={styles.featureCardBody}>
                    Zjistíš, jak <strong>upravit jídlo před a po sportu</strong>. Podpoříš tím svůj{" "}
                    <strong>výkon i regeneraci</strong>. Během tréninku se budeš cítit skvěle.
                  </p>
                </div>
                <div className={styles.featureCard}>
                  <span className={styles.featureCardIcon}>⚙️</span>
                  <p className={styles.featureCardBody}>
                    Získáš <strong>ucelený pohled na jídelníček</strong> a pochopíš souvislosti.
                    Poradíš si <strong>v každé situaci</strong> bez ohledu na omezený výběr potravin.
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.featuresMedia}>
              <Image
                src="/ebook/mockup-kniha.png"
                alt="E-book Manuál pro mámy – ukázka obsahu"
                width={440}
                height={540}
                className={styles.featuresPhoto}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Included ── */}
      <section className={styles.included}>
        <div className="container">
          <div className={styles.includedInner}>
            <h2 className={`section-title ${styles.includedTitle}`}>Co je součástí e-booku?</h2>
            <ul className={styles.includedList}>
              <li className={styles.includedItem}>
                <span className={styles.includedCheck}>✓</span>
                <span>
                  Vysvětlení <strong>významu jednotlivých složek jídla</strong> a konkrétní
                  potraviny, které do jídelníčku zařadit.
                </span>
              </li>
              <li className={styles.includedItem}>
                <span className={styles.includedCheck}>✓</span>
                <span>
                  <strong>34 stran</strong> plných hodnotných informací – nečekej žádné výplňové
                  obrázky, každá strana se počítá.
                </span>
              </li>
              <li className={styles.includedItem}>
                <span className={styles.includedCheck}>✓</span>
                <span>
                  Upozornění na <strong>nejčastější chyby</strong> a praktické{" "}
                  <strong>tipy na úspěch</strong>.
                </span>
              </li>
              <li className={styles.includedItem}>
                <span className={styles.includedCheck}>✓</span>
                <span>
                  Přehledný <strong>návod, jak sestavit každé jídlo</strong> – snídani, oběd,
                  večeři i svačiny.
                </span>
              </li>
              <li className={styles.includedItem}>
                <span className={styles.includedCheck}>✓</span>
                <span>
                  Úpravy jídelníčku pro <strong>hubnutí, udržování, přibírání i sport</strong> –
                  vše na jednom místě.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Pricing CTA ── */}
      <section className={styles.pricingCta}>
        <div className="container--narrow">
          <div className={styles.pricingCtaBox}>
            <p className={styles.pricingCtaEyebrow}>Pořiď si e-book</p>
            <h2 className={styles.pricingCtaName}>MANUÁL PRO MÁMY</h2>
            <p className={styles.pricingCtaLabel}>E-book získáš za</p>
            <p className={styles.pricingCtaPrice}>1 485 Kč</p>
            <EbookBuyButton className={styles.pricingCtaBtn} label="CHCI E-BOOK!" />
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className={styles.about}>
        <div className="container">
          <div className={styles.aboutInner}>
            <Image
              src="/ebook/iva.png"
              alt="Iva Vaňková, certifikovaná trenérka a nutriční specialistka"
              width={440}
              height={520}
              className={styles.aboutPhoto}
            />
            <div>
              <h2 className={`section-title ${styles.aboutTitle}`}>
                Proč do toho jít zrovna se mnou?
              </h2>
              <div className={styles.aboutBody}>
                <p>
                  Jmenuji se Iva Vaňková, jsem certifikovaná trenérka a nutriční specialistka.
                  Aktuálně jsem ale hlavně máma tříleté Amálky a miminka Apolenky. Přesně vím,
                  jaké to je balancovat mezi rodinou, prací a péčí o sebe. Ukážu ti, že to jde. I
                  v tomhle kolotoči můžeš dobře jíst a být se sebou spokojená.
                </p>
                <p>
                  Moje klientky řeší stejné problémy jako ty a úspěšně hubnou, získávají zpět
                  ztracenou energii a sebevědomí.
                </p>
                <p>
                  Sestavuji výživové a pohybové plány, konzultuji, vedu individuální i skupinové
                  tréninky a mám svůj unikátní online kurz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── References ── */}
      <section className={styles.references}>
        <div className="container">
          <h2 className={`section-title section-title--center ${styles.referencesTitle}`}>
            Přečti si reference na e-book
          </h2>
          <div className={styles.referencesGrid}>
            {(
              [
                { src: "/ebook/recenze1.jpg", alt: "Reference na e-book 1" },
                { src: "/ebook/recenze2.jpg", alt: "Reference na e-book 2" },
                { src: "/ebook/recenze3.jpg", alt: "Reference na e-book 3" },
              ] as const
            ).map((img) => (
              <Image
                key={img.src}
                src={img.src}
                alt={img.alt}
                width={360}
                height={280}
                className={styles.referenceImg}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom pricing ── */}
      <section className={styles.bottomPricing}>
        <div className="container">
          <div className={styles.bottomPricingInner}>
            <div className={styles.bottomPricingImages}>
              <Image
                src="/ebook/mockup-kniha.png"
                alt="E-book Manuál pro mámy"
                width={260}
                height={300}
                className={styles.bottomPricingImg}
              />
            </div>
            <div className={styles.bottomPricingCenter}>
              <h2 className={styles.bottomPricingLabel}>Cena e-booku, který vyřeší tvůj jídelníček, je jen</h2>
              <p className={styles.bottomPricingPrice}>1 485 Kč</p>
              <EbookBuyButton className={styles.bottomPricingBtn} label="To zní skvěle!" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className={styles.finalCta}>
        <div className="container">
          <div className={styles.finalCtaInner}>
            <p className={styles.finalCtaText}>Připravena začít?</p>
            <EbookBuyButton className={styles.finalCtaBtn} label="CHCI E-BOOK!" />
          </div>
        </div>
      </section>
      </main>
    </>
  );
}
