import type { Metadata } from "next";
import Image from "next/image";
import { StructuredData } from "@/components/structured-data";
import {
  MEMBERSHIP_PATH,
  MEMBERSHIP_PRICE,
  MEMBERSHIP_SIGNUP_URL,
  MEMBERSHIP_TITLE
} from "@/lib/content/membership";
import styles from "./membership.module.css";

const siteUrl = "https://www.zdravimebavi.cz";
const canonical = siteUrl + MEMBERSHIP_PATH;
const title = `${MEMBERSHIP_TITLE} | Zdraví mě baví`;
const description = "Máma ve formě, e-book Manuál pro mámy, jídelníček s recepty a krátké tréninky v jedné aplikaci za 100 Kč měsíčně.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical },
  openGraph: {
    title,
    description,
    url: canonical,
    images: [{ url: siteUrl + "/kurz/mockup.png", alt: "Materiály programu Máma ve formě" }]
  }
};

const painPoints = [
  "Chci se v jídle vyznat i bez počítání kalorií.",
  "Nevím, jak sestavit jídelníček, který mi sedne.",
  "Po práci a péči o rodinu mi na cvičení moc času nezbývá."
];

const courseMaterials = [
  "Průvodce výživou, pohybem a péčí o sebe, ke kterému se můžeš vracet vlastním tempem.",
  "Ukázkový jídelníček na 7 dní s nákupním seznamem a recepty.",
  "Tréninky do 20 minut. Vyber si jógu, posilování nebo kondiční cvičení.",
  "Video se správnou technikou běžných cviků a návod na sestavení tréninkového plánu.",
  "Praktické bonusy včetně plánovače pohybu, cílů a priorit."
];

const ebookMaterials = [
  "Jak poskládat vyváženou snídani, oběd, večeři i svačinu.",
  "Jakou roli mají jednotlivé složky jídla a z jakých potravin vybírat.",
  "Jak upravit porce a složení jídel podle toho, jestli chceš hubnout, udržet váhu nebo přibrat.",
  "Co jíst před a po sportu a jak se vyhnout častým chybám."
];

const referenceGroups = [
  {
    title: "Máma ve formě",
    images: ["/kurz/recenze1v2.png", "/kurz/recenze2.png", "/kurz/recenze3.png",
      "/kurz/recenze3b.png", "/kurz/recenze4.png", "/kurz/recenze5.png"]
  },
  {
    title: "E-book Manuál pro mámy",
    images: ["/ebook/recenze1.jpg", "/ebook/recenze2.jpg", "/ebook/recenze3.jpg"]
  }
];

const questions = [
  {
    question: "Jak získám přístup?",
    answer: "Nejdřív si vytvoříš účet v aplikaci. Po přihlášení si v aplikaci můžeš aktivovat měsíční členství."
  },
  {
    question: "Musím jíst podle přesně daného jídelníčku?",
    answer: "Sedmidenní jídelníček slouží pro inspiraci. Podle Manuálu pro mámy se naučíš odhadnout porce a poskládat si jídlo podle toho, co máš po ruce a čeho chceš dosáhnout."
  },
  {
    question: "Zvládnu tréninky, když se cvičením začínám?",
    answer: "Začni videem o technice. Iva ti ukáže, jak si běžné cviky upravit a vybrat pohyb, který zapadne do tvého týdne."
  },
  {
    question: "Kde najdu pomoc, když si s něčím nevím rady?",
    answer: <>Pokud máš otázku k materiálům nebo tě zajímá individuální spolupráce, napiš mi na <a href="mailto:info@zdravimebavi.cz">info@zdravimebavi.cz</a>.</>
  }
];

function SignupLink({ className = "" }: { className?: string }) {
  return <a href={MEMBERSHIP_SIGNUP_URL} className={`btn btn-primary ${className}`}>Vytvořit účet v aplikaci</a>;
}

function MaterialsList({ items }: { items: string[] }) {
  return (
    <ul className={styles.includedList}>
      {items.map((item) => (
        <li key={item} className={styles.includedItem}>
          <span aria-hidden="true" className={styles.includedCheck}>✓</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function MembershipPage() {
  return (
    <>
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Domů", item: siteUrl + "/" },
          { "@type": "ListItem", position: 2, name: MEMBERSHIP_TITLE, item: canonical }
        ]
      }} />
      <main>
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroInner}>
              <div>
                <h1 className={styles.heroTitle}>{MEMBERSHIP_TITLE}</h1>
                <p className={styles.heroLead}>
                  Skládej si jídlo bez počítání kalorií a najdi si pohyb, který se vejde do tvého dne.
                  V aplikaci najdeš program Máma ve formě i e-book Manuál pro mámy.
                </p>
                <SignupLink />
              </div>
              <div className={styles.heroMedia}>
                <Image src="/kurz/mockup.png" alt="Ukázka materiálů programu Máma ve formě"
                  width={480} height={560} className={styles.heroMockup} priority />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.painPoints}>
          <div className="container">
            <h2 className={`section-title section-title--center ${styles.painPointsTitle}`}>Poznáváš se v těchto myšlenkách?</h2>
            <div className={styles.painGrid}>
              {painPoints.map((text) => (
                <div className={styles.painCard} key={text}>
                  <span aria-hidden="true" className={styles.painIcon}>❓</span>
                  <p className={styles.painText}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.courseContent} aria-labelledby="mama-ve-forme">
          <div className="container">
            <div className={styles.courseContentInner}>
              <div>
                <h2 id="mama-ve-forme" className={`section-title ${styles.courseContentTitle}`}>Máma ve formě</h2>
                <p>Praktický program pro ženy, které chtějí zdravé jídlo a pohyb sladit s rodinou a prací.</p>
                <MaterialsList items={courseMaterials} />
              </div>
              <div className={styles.courseMedia}>
                <Image src="/kurz/materialy.png" alt="Jídelníček a další materiály programu Máma ve formě"
                  width={440} height={440} className={styles.coursePhoto} />
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.courseContent} ${styles.ebook}`} aria-labelledby="manual-pro-mamy">
          <div className="container">
            <div className={styles.courseContentInner}>
              <div>
                <h2 id="manual-pro-mamy" className={`section-title ${styles.courseContentTitle}`}>E-book Manuál pro mámy</h2>
                <p>Krok za krokem tě provedu sestavením jídelníčku, který využiješ doma, v práci i ve dnech, kdy máš na vaření jen chvilku.</p>
                <MaterialsList items={ebookMaterials} />
              </div>
              <div className={styles.courseMedia}>
                <Image src="/ebook/mockup-kniha.png" alt="Ukázka e-booku Manuál pro mámy"
                  width={440} height={540} className={styles.coursePhoto} />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.pricingCta} aria-labelledby="cena-clenstvi">
          <div className={`container--narrow ${styles.pricingCtaBox}`}>
            <h2 id="cena-clenstvi" className={styles.pricingCtaName}>{MEMBERSHIP_TITLE}</h2>
            <p className={styles.pricingCtaPrice}>{MEMBERSHIP_PRICE}</p>
            <p className={styles.pricingCtaLabel}>Jedno předplatné ti otevře celý obsah aplikace.</p>
            <SignupLink className={styles.pricingCtaBtn} />
          </div>
        </section>

        <section className={styles.about}>
          <div className={`container ${styles.aboutInner}`}>
            <Image src="/kurz/iva.png" alt="Iva Vaňková, trenérka a nutriční specialistka"
              width={440} height={520} className={styles.aboutPhoto} />
            <div>
              <h2 className={`section-title ${styles.aboutTitle}`}>Proč do toho jít se mnou?</h2>
              <div className={styles.aboutBody}>
                <p>Jmenuji se Iva Vaňková. Jsem certifikovaná trenérka, nutriční specialistka a máma dvou dětí. Vím, jaké to je hledat čas na sebe mezi rodinou a prací.</p>
                <p>Při konzultacích a trénincích pomáhám ženám najít způsob, jak se pravidelně hýbat a dobře jíst i v nabitém týdnu. V aplikaci tě tím provedu krok za krokem.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.benefits}>
          <div className="container">
            <h2 className={`section-title section-title--center ${styles.referencesTitle}`}>Proměny mých klientek</h2>
            <div className={styles.promenyGrid}>
              {[1, 2, 3].map((n) => (
                <Image key={n} src={`/kurz/klientka${n}.jpg`} alt={`Proměna klientky ${n}`}
                  width={400} height={300} className={styles.promenyPhoto} />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.references}>
          <div className="container">
            <h2 className={`section-title section-title--center ${styles.referencesTitle}`}>Co říkají klientky</h2>
            {referenceGroups.map((group) => (
              <div key={group.title} className={styles.referenceGroup}>
                <h3>{group.title}</h3>
                <div className={styles.referencesGrid}>
                  {group.images.map((src, index) => (
                    <Image key={src} src={src} alt={`Reference ${index + 1} – ${group.title}`}
                      width={360} height={280} className={styles.referenceImg} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.faq}>
          <div className="container--narrow">
            <h2 className={`section-title section-title--center ${styles.faqTitle}`}>Máš ještě nějaké otázky?</h2>
            <div className={styles.faqList}>
              {questions.map(({ question, answer }) => (
                <details className={styles.faqItem} key={question}>
                  <summary>{question}</summary>
                  <p className={styles.faqAnswer}>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
