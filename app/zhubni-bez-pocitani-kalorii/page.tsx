import type { Metadata } from "next";
import Image from "next/image";
import { StructuredData } from "@/components/structured-data";
import { getSanityRouteMetadata } from "@/lib/sanity/loaders";
import styles from "./kurz.module.css";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({ kind: "offerPage", routePath: "/zhubni-bez-pocitani-kalorii" });
}

export default function ZhubniPage() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Domů", item: "https://www.zdravimebavi.cz/" },
        { "@type": "ListItem", position: 2, name: "Máma ve formě", item: "https://www.zdravimebavi.cz/zhubni-bez-pocitani-kalorii" }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Course",
      name: "Máma ve formě",
      description: "Online kurz výživy a pohybu pro zaneprázdněné ženy, které chtějí zhubnout bez počítání kalorií.",
      provider: {
        "@type": "Organization",
        name: "Zdraví mě baví",
        url: "https://www.zdravimebavi.cz"
      },
      image: "https://www.zdravimebavi.cz/kurz/mockup.png",
      url: "https://www.zdravimebavi.cz/zhubni-bez-pocitani-kalorii",
      offers: {
        "@type": "Offer",
        url: "https://www.zdravimebavi.cz/zhubni-bez-pocitani-kalorii",
        category: "Online kurz"
      }
    }
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <main>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroInner}>
            <div>
              <p className={styles.heroEyebrow}>ONline kurz</p>
              <h1 className={styles.heroTitle}>MÁMA VE FORMĚ</h1>
              <p className={styles.heroLead}>
                Průvodce výživou a pohybem pro zaneprázdněné ženy - metoda bez diet na celý život
              </p>
              <a href="https://buy.stripe.com/7sY9AT1picjvdNN90heIw07" target="_blank" rel="noreferrer" className="btn btn-primary">
                CHCI ZHUBNOUT!
              </a>
            </div>
            <div className={styles.heroMedia}>
              <Image
                src="/kurz/mockup.png"
                alt="Ukázka online kurzu Máma ve formě"
                width={480}
                height={560}
                className={styles.heroMockup}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.painPoints}>
        <div className="container">
          <h2 className={`section-title section-title--center ${styles.painPointsTitle}`}>
            Poznáváš se v těchto myšlenkách?
          </h2>
          <div className={styles.painGrid}>
            <div className={styles.painCard}>
              <div className={styles.painIcon}>❓</div>
              <p className={styles.painText}>
                Ve všem oblečení <strong>vypadám strašně</strong>.
              </p>
            </div>
            <div className={styles.painCard}>
              <div className={styles.painIcon}>❓</div>
              <p className={styles.painText}>
                Do bazénu nejdu, <strong>všichni by na mě koukali</strong>.
              </p>
            </div>
            <div className={styles.painCard}>
              <div className={styles.painIcon}>❓</div>
              <p className={styles.painText}>
                Dietu vždycky <strong>po pár dnech poruším</strong>, jsem nemožná.
              </p>
            </div>
            <div className={styles.painCard}>
              <div className={styles.painIcon}>❓</div>
              <p className={styles.painText}>
                Tak moc se snažím zhubnout a <strong>výsledky nikde</strong>!
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

      <section className={styles.promise}>
        <div className="container--narrow">
          <p className={styles.promiseText}>
            Mám pro tebe komplexní online kurz, díky kterému <strong>konečně zhubneš</strong>. Už
            na to <strong>nikdy nebudeš sama</strong>. Získáš přístup do členské sekce, kde najdeš{" "}
            <strong>informace, konkrétní postupy a motivaci</strong>.
          </p>
        </div>
      </section>

      <section className={styles.benefits}>
        <div className="container">
          <div className={styles.benefitsInner}>
            <ul className={styles.benefitsList}>
              <li className={styles.benefitsItem}>
                <span className={styles.benefitsIcon}>❤️</span>
                <span>
                  <strong>Zhubneš</strong> bez počítání kalorií, zdravě a udržitelně.
                </span>
              </li>
              <li className={styles.benefitsItem}>
                <span className={styles.benefitsIcon}>❤️</span>
                <span>
                  Už nikdy <strong>nebudeš otrokem</strong> diet a cvičení.
                </span>
              </li>
              <li className={styles.benefitsItem}>
                <span className={styles.benefitsIcon}>❤️</span>
                <span>
                  Osvojíš si <strong>zdravé návyky</strong>, které využiješ každý den, ať jsi
                  kdekoli a děláš cokoli.
                </span>
              </li>
              <li className={styles.benefitsItem}>
                <span className={styles.benefitsIcon}>❤️</span>
                <span>
                  Pochopíš, že <strong>život není o zákazech, ale o radosti</strong> z jídla i
                  pohybu.
                </span>
              </li>
              <li className={styles.benefitsItem}>
                <span className={styles.benefitsIcon}>❤️</span>
                <span>
                  Zvládneš to, i když <strong>nemáš čas</strong>.
                </span>
              </li>
            </ul>

            <div className={styles.benefitsRight}>
              <h2 className={styles.benefitsSubTitle}>
                Podívej se na proměny mých klientek
              </h2>
              <div className={styles.promenyGrid}>
                <Image
                  src="/kurz/klientka1.jpg"
                  alt="Proměna klientky 1"
                  width={400}
                  height={300}
                  className={styles.promenyPhoto}
                />
                <Image
                  src="/kurz/klientka2.jpg"
                  alt="Proměna klientky 2"
                  width={400}
                  height={300}
                  className={styles.promenyPhoto}
                />
                <Image
                  src="/kurz/klientka3.jpg"
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

      <section className={styles.courseContent}>
        <div className="container">
          <div className={styles.courseContentInner}>
            <div>
              <h2 className={`section-title ${styles.courseContentTitle}`}>
                Zjisti, jak na jídlo, pohyb a péči o sebe
              </h2>
              <div className={styles.courseCards}>
                <div className={styles.courseCard}>
                  <span className={styles.courseCardIcon}>🧁</span>
                  <p className={styles.courseCardBody}>
                    Osvojíš si <strong>metodu, která funguje</strong> desítkám mých klientek. Po
                    všech neúspěšných pokusech <strong>konečně zhubneš</strong> a přestaneš se
                    kvůli jídlu stresovat. <strong>Ukázkové jídelníčky s recepty</strong> tě
                    navedou na správnou cestu.
                  </p>
                </div>
                <div className={styles.courseCard}>
                  <span className={styles.courseCardIcon}>🏋️</span>
                  <p className={styles.courseCardBody}>
                    Pochopíš, <strong>kolik pohybu</strong> potřebuješ a naučíš se{" "}
                    <strong>cvičit správně</strong>. Zjistíš,{" "}
                    <strong>jak se hýbat pro maximální výsledky</strong>. Pomohou ti{" "}
                    <strong>video lekce</strong> s krátkými, ale{" "}
                    <strong>efektivními tréninky</strong>.
                  </p>
                </div>
                <div className={styles.courseCard}>
                  <span className={styles.courseCardIcon}>⚙️</span>
                  <p className={styles.courseCardBody}>
                    Celkově vyladíš svůj <strong>životní styl</strong>. Budeš vědět, co dalšího
                    pro sebe udělat, aby ses cítila skvěle. A samozřejmě zjistíš,{" "}
                    <strong>jak všechno v pohodě stíhat</strong>.
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.courseMedia}>
              <Image
                src="/kurz/clovek.png"
                alt="Průvodce kurzem Máma ve formě"
                width={440}
                height={540}
                className={styles.coursePhoto}
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.included}>
        <div className="container">
          <div className={styles.includedInner}>
            <h2 className={`section-title ${styles.includedTitle}`}>Co je součástí kurzu?</h2>
            <ul className={styles.includedList}>
              <li className={styles.includedItem}>
                <span className={styles.includedCheck}>✓</span>
                <span>
                  <strong>Video</strong>, díky kterému začneš <strong>cvičit</strong> podle videí
                  na YouTube <strong>správně</strong>.
                </span>
              </li>
              <li className={styles.includedItem}>
                <span className={styles.includedCheck}>✓</span>
                <span>
                  <strong>Tématické kapitoly,</strong> díky kterým konečně zhubneš. Nečekej žádné
                  výplňové obrázky, každá strana je nabitá hodnotnými informacemi.
                </span>
              </li>
              <li className={styles.includedItem}>
                <span className={styles.includedCheck}>✓</span>
                <span>
                  Inspirativní <strong>jídelníček na 7 dní,</strong> který doopravdy využiješ v
                  praxi. Včetně <strong>nákupního seznamu</strong> a <strong>receptů</strong>.
                </span>
              </li>
              <li className={styles.includedItem}>
                <span className={styles.includedCheck}>✓</span>
                <span>
                  <strong>VIDEO TRÉNINKY</strong>: Maximálně{" "}
                  <strong>efektivní lekce cvičení</strong>, které zvládneš{" "}
                  <strong>do 20 minut</strong>. Čeká tě jóga, posilování i kondiční cvičení.
                </span>
              </li>
              <li className={styles.includedItem}>
                <span className={styles.includedCheck}>✓</span>
                <span>
                  <strong>PRAKTICKÉ BONUSY</strong>: Mimo jiné třeba návod na sestavení
                  tréninkového plánu, inspirativní rozhovor o detoxech, jarní únavě a zdravému
                  přístupu k jídlu.
                </span>
              </li>
            </ul>
            <p className={styles.includedBonus}>
              ... a taky plánovač pohybu, cílů a priorit na celý rok
            </p>
            <Image
              src="/kurz/materialy.png"
              alt="Materiály kurzu Máma ve formě"
              width={880}
              height={500}
              className={styles.includedPhoto}
            />
          </div>
        </div>
      </section>

      <section className={styles.pricingCta}>
        <div className="container--narrow">
          <div className={styles.pricingCtaBox}>
            <p className={styles.pricingCtaEyebrow}>Pořiď si online kurz</p>
            <h2 className={styles.pricingCtaName}>JAK ZHUBNOUT PO DĚTECH BEZ DIET</h2>
            <p className={styles.pricingCtaLabel}>Přístup do členské sekce získáš za</p>
            <p className={styles.pricingCtaPrice}>9 987 Kč</p>
            <Image
              src="/kurz/garance.png"
              alt="Garance vrácení peněz"
              width={180}
              height={180}
              className={styles.pricingCtaGarance}
            />
            <p className={styles.pricingCtaGuarantee}>
              Jestli projdeš celou členskou sekci, postupy aplikuješ do svého života a nenastane u
              tebe žádná změna, napiš mi a já ti vrátím peníze.
            </p>
            <a
              href="https://buy.stripe.com/7sY9AT1picjvdNN90heIw07"
              target="_blank"
              rel="noreferrer"
              className={`btn ${styles.pricingCtaBtn}`}
            >
              CHCI ZHUBNOUT!
            </a>
          </div>
        </div>
      </section>

      <section className={styles.about}>
        <div className="container">
          <div className={styles.aboutInner}>
            <Image
              src="/kurz/iva.png"
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
                  v tmhle kolotoči můžeš dobře jíst, hýbat se a být se sebou spokojená.
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

      <section className={styles.references}>
        <div className="container">
          <h2 className={`section-title section-title--center ${styles.referencesTitle}`}>
            Přečti si reference na kurz
          </h2>
          <div className={styles.referencesGrid}>
            {(
              [
                { src: "/kurz/recenze1v2.png", alt: "Reference na kurz 1" },
                { src: "/kurz/recenze2.png", alt: "Reference na kurz 2" },
                { src: "/kurz/recenze3.png", alt: "Reference na kurz 3" },
                { src: "/kurz/recenze3b.png", alt: "Reference na kurz 4" },
                { src: "/kurz/recenze4.png", alt: "Reference na kurz 5" },
                { src: "/kurz/recenze5.png", alt: "Reference na kurz 6" },
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

      <section className={styles.bottomPricing}>
        <div className="container">
          <div className={styles.bottomPricingInner}>
            <div className={styles.bottomPricingImages}>
              <Image
                src="/kurz/mockup.png"
                alt="Ukázka kurzu Máma ve formě"
                width={260}
                height={300}
                className={styles.bottomPricingImg}
              />
            </div>
            <div className={styles.bottomPricingCenter}>
              <h2 className={styles.bottomPricingLabel}>
                Cena celého kurzu včetně bonusů je
              </h2>
              <p className={styles.bottomPricingPrice}>9 987 Kč</p>
              <Image
                src="/kurz/garance.png"
                alt="Garance vrácení peněz"
                width={120}
                height={120}
                className={styles.bottomPricingGarance}
              />
              <p className={styles.bottomPricingGuarantee}>
                Jestli projdeš celou členskou sekci, postupy aplikuješ do svého života a nenastane
                u tebe žádná změna, napiš mi a já ti vrátím peníze.
              </p>
              <a href="https://buy.stripe.com/7sY9AT1picjvdNN90heIw07" target="_blank" rel="noreferrer" className="btn btn-primary">
                To zní skvěle!
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.faq}>
        <div className="container--narrow">
          <h2 className={`section-title section-title--center ${styles.faqTitle}`}>
            Máš ještě nějaké otázky?
          </h2>
          <div className={styles.faqList}>
            <details className={styles.faqItem}>
              <summary>Jaké materiály dostanu?</summary>
              <div className={styles.faqAnswer}>
                <p>
                  Pošlu ti přístupové údaje do členské sekce, kde najdeš všechny materiály z
                  Průvodce. Většina je ve formátu PDF. Můžeš si je prohlížet online nebo stáhnout.
                  Samozřejmě si je můžeš i vytisknout a mít je tak vždycky při ruce. Videa si
                  přehraješ přímo ve členské sekci. Kdykoli do Průvodce něco přidám nebo ho
                  aktualizuji, dám ti vědět na e-mail, aby ti nic neuteklo. :-)
                </p>
              </div>
            </details>
            <details className={styles.faqItem}>
              <summary>Je součástí Průvodce tvá osobní podpora?</summary>
              <div className={styles.faqAnswer}>
                <p>
                  Kdybys cokoli z Průvodce potřebovala dovysvětlit, ráda ti poradím. Stačí napsat
                  na info@zdravimebavi.cz nebo mě kontaktuj na sociálních sítích.
                </p>
              </div>
            </details>
            <details className={styles.faqItem}>
              <summary>Dostanu přesný jídelníček?</summary>
              <div className={styles.faqAnswer}>
                <p>
                  Pro inspiraci pro tebe mám připravené ukázkové celodenní jídelníčky. Ty se ale
                  naučíš sestavovat vyvážený jídelníček, odhadovat velikost porcí a vhodně
                  kombinovat potraviny. Díky tomu si dokážeš připravit nebo vybrat vhodné jídlo
                  kdykoli a kdekoli. Žádný přesně předepsaný jídelníček s gramáží už nebudeš
                  potřebovat.
                </p>
              </div>
            </details>
            <details className={styles.faqItem}>
              <summary>Jak konkrétně mi poradíš s pohybem?</summary>
              <div className={styles.faqAnswer}>
                <p>
                  Ve videu ti ukážu, jak si upravit nejčastější cviky z online tréninků. Mám pro
                  tebe i video lekce s tréninky pro sílu, budování kondice a jógu. Taky ti
                  vysvětlím, na co se při cvičení zaměřit a kolik pohybu potřebuješ, abys viděla
                  výsledky. Poradím ti, jak si najít vhodný pohyb přesně pro tebe a jak to udělat,
                  aby se stal přirozenou součástí tvého života.
                </p>
              </div>
            </details>
            <details className={styles.faqItem}>
              <summary>Zaručuješ, že budu mít výsledky?</summary>
              <div className={styles.faqAnswer}>
                <p>
                  Já ti v Průvodci poskytnu moje znalosti a dostaneš tak návod, jak všechno
                  poskládat do tvého života. Výsledky se ale dostaví jen, když se do své části
                  práce pořádně opřeš i ty a budeš doporučení dodržovat.
                </p>
              </div>
            </details>
            <details className={styles.faqItem}>
              <summary>
                Co když budu chtít na Průvodce navázat individuální spoluprací?
              </summary>
              <div className={styles.faqAnswer}>
                <p>Ano, je to možné. Moc ráda se s tebou potkám na osobní konzultaci.</p>
              </div>
            </details>
            <details className={styles.faqItem}>
              <summary>Zajímá tě cokoli dalšího?</summary>
              <div className={styles.faqAnswer}>
                <p>Napiš mi na info@zdravimebavi.cz. :-)</p>
              </div>
            </details>
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className="container">
          <div className={styles.finalCtaInner}>
            <p className={styles.finalCtaText}>Připravena začít?</p>
            <a
              href="https://buy.stripe.com/7sY9AT1picjvdNN90heIw07"
              target="_blank"
              rel="noreferrer"
              className={`btn ${styles.finalCtaBtn}`}
            >
              CHCI KURZ!
            </a>
          </div>
        </div>
      </section>
      </main>
    </>
  );
}
