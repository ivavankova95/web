import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
  "Všude čtu něco jiného o výživě. Čím mám vlastně začít?",
  "Ráda bych po dětech zhubla, ale po pár dnech mě každá dieta přestane bavit.",
  "Snažím se jíst zdravě, jenže kvůli tomu řeším jídlo skoro celý den.",
  "Chtěla bych se ve svém těle zase cítit dobře, ale moje snaha zatím nepřináší výsledky.",
  "Mezi prací, rodinou a domácností mi na sebe nezbývá moc času."
];

const benefits = [
  {
    icon: "🧁",
    title: "Jídlo, které se vejde do běžného dne",
    text: "Ukážu ti, jak si vybírat a kombinovat potraviny bez počítání kalorií a seznamu zakázaných jídel. Naučíš se sestavit vyvážený talíř tak, aby sis poradila při vaření pro rodinu, s obědem v práci i tehdy, když máš po ruce jen pár surovin."
  },
  {
    icon: "🏋️",
    title: "Pohyb, který ti sedne",
    text: "Zjistíš, jak vybrat druh pohybu podle svého cíle, kolik ho zařadit do týdne a na co se při cvičení soustředit. Až budeš chtít přidat na síle nebo kondici, budeš vědět, jak si trénink postupně upravit."
  },
  {
    icon: "❤️",
    title: "Návyky, ke kterým se můžeš vracet",
    text: "Dostaneš prostor vyzkoušet si změny postupně a najít si vlastní tempo. Podíváme se i na to, jak si stanovit priority a jak se vrátit k pohybu a péči o sebe po týdnu, kdy na ně nezbyl čas."
  }
];

const courseMaterials = [
  {
    title: "Průvodce výživou, pohybem a péčí o sebe",
    text: "Tematické kapitoly ti pomůžou pochopit, co má smysl měnit, pokud chceš zhubnout udržitelně. Získáš postup, jak doporučení zkoušet v běžném životě a postupně si z nich udělat vlastní rutinu."
  },
  {
    title: "Ukázkový jídelníček na 7 dní",
    text: "Uvidíš, jak může vypadat celý den jídla v praxi. Součástí jsou recepty a nákupní seznam, takže si můžeš rovnou vybrat jídla na příští týden a připravit si nákup."
  },
  {
    title: "Video se správnou technikou cviků",
    text: "Ukážu ti, na co si dát pozor u běžných cviků a jak si je zjednodušit podle své kondice. Využiješ to i při cvičení podle videí na YouTube."
  },
  {
    title: "Video tréninky do 20 minut",
    text: "Vyber si jógu, posilování nebo kondiční cvičení podle toho, na co máš zrovna chuť a kolik máš času. Krátké lekce zvládneš doma i mezi dalšími povinnostmi."
  },
  {
    title: "Bonusy a plánovač na celý rok",
    text: "Najdeš tu návod na sestavení vlastního tréninkového plánu, rozhovor o detoxech, jarní únavě a zdravém přístupu k jídlu i plánovač pohybu, cílů a priorit. Vybrané pracovní materiály si můžeš stáhnout a vytisknout."
  }
];

const ebookMaterials = [
  {
    title: "Porozumíš tomu, co máš na talíři",
    text: "Vysvětlím ti, k čemu tělo využívá jednotlivé složky jídla a ze kterých běžných potravin je získáš. Díky konkrétním příkladům budeš vědět, čím jídlo doplnit a jak vybírat při nákupu."
  },
  {
    title: "Sestavíš si snídani, oběd, večeři i svačinu",
    text: "U každého jídla tě provedu tím, jak ho poskládat a jak odhadnout porci. Dozvíš se, jaké chyby se při sestavování jídel opakují a co můžeš ve svém jídelníčku zkusit jinak."
  },
  {
    title: "Přizpůsobíš jídelníček svému cíli",
    text: "Ukážu ti, co se ve skladbě jídel a velikosti porcí mění, když chceš hubnout, váhu si udržet nebo přibrat. Stejný postup můžeš využít, i když se časem změní tvoje cíle nebo množství pohybu."
  },
  {
    title: "Zjistíš, co jíst před a po sportu",
    text: "Dozvíš se, jak načasovat jídlo kolem tréninku, abys při něm měla energii, a co si dát po cvičení pro doplnění živin a regeneraci."
  }
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
    answer: "Vytvoř si účet pomocí e-mailu a potvrď ho odkazem, který ti přijde do schránky. Po přihlášení si přímo v aplikaci můžeš aktivovat měsíční členství."
  },
  {
    question: "Jak si materiály prohlédnu?",
    answer: "Průvodce a e-book si můžeš číst přímo v aplikaci. Videa si přehraješ ve stejné aplikaci a k jednotlivým částem se můžeš kdykoli během členství vrátit. Novinky najdeš po přihlášení."
  },
  {
    question: "Dostanu přesně předepsaný jídelníček?",
    answer: "Sedmidenní jídelníček je ukázka, se kterou můžeš začít. Když ti některé jídlo nesedne nebo zrovna nemáš potřebné suroviny, v e-booku najdeš postup, podle kterého si vybereš náhradu. Díky tomu se postupně obejdeš bez rozpisu na gramy."
  },
  {
    question: "Můžu začít, i když jsem dlouho necvičila?",
    answer: "Ano. Začni s variantami cviků, u kterých se cítíš jistě, a přidávej zátěž postupně. Klidně si nejdřív vyber jednu krátkou lekci a vyzkoušej, jak ti sedne."
  },
  {
    question: "Co můžu od členství čekat?",
    answer: "Získáš návody a materiály, se kterými si můžeš krok za krokem upravit jídlo a pohyb. Výsledky jsou individuální a záleží na tom, co se ti podaří dlouhodobě zařadit do svého života."
  },
  {
    question: "Můžu se tě zeptat na něco k materiálům?",
    answer: <>Jestli potřebuješ některou část dovysvětlit, napiš mi na <a href="mailto:info@zdravimebavi.cz">info@zdravimebavi.cz</a> nebo se mi ozvi na sociálních sítích.</>
  },
  {
    question: "Můžu na členství navázat individuální spoluprací?",
    answer: <>Ano, můžeme se potkat na <Link href="/osobni-konzultace">osobní konzultaci</Link> a probrat, co by ti pomohlo právě teď.</>
  }
];

function SignupLink({ className = "" }: { className?: string }) {
  return <a href={MEMBERSHIP_SIGNUP_URL} className={`btn btn-primary ${className}`}>Vytvořit účet v aplikaci</a>;
}

function MaterialsList({ items }: { items: { title: string; text: string }[] }) {
  return (
    <ul className={styles.includedList}>
      {items.map(({ title, text }) => (
        <li key={title} className={styles.includedItem}>
          <span aria-hidden="true" className={styles.includedCheck}>✓</span>
          <div>
            <h3 className={styles.materialTitle}>{title}</h3>
            <p>{text}</p>
          </div>
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
                  Průvodce výživou a pohybem pro ženy, které chtějí zhubnout bez diet a najít si čas na sebe i v nabitém týdnu.
                  V aplikaci tě čeká program Máma ve formě a e-book Manuál pro mámy.
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

        <section className={styles.benefitSection} aria-labelledby="jidlo-pohyb-navyky">
          <div className={`container ${styles.courseContentInner}`}>
            <div>
              <h2 id="jidlo-pohyb-navyky" className={`section-title ${styles.courseContentTitle}`}>
                Jak na jídlo, pohyb a péči o sebe
              </h2>
              <div className={styles.benefitList}>
                {benefits.map(({ icon, title, text }) => (
                  <div key={title} className={styles.painCard}>
                    <span aria-hidden="true" className={styles.painIcon}>{icon}</span>
                    <div>
                      <h3 className={styles.materialTitle}>{title}</h3>
                      <p className={styles.painText}>{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.courseMedia}>
              <Image src="/kurz/clovek.png" alt="Ukázka průvodce Máma ve formě"
                width={440} height={782} className={styles.guidePhoto} />
            </div>
          </div>
        </section>

        <section className={styles.courseContent} aria-labelledby="mama-ve-forme">
          <div className="container">
            <div className={styles.courseContentInner}>
              <div>
                <h2 id="mama-ve-forme" className={`section-title ${styles.courseContentTitle}`}>Máma ve formě</h2>
                <p>Pokud po dětech hledáš způsob, jak začít jíst lépe, pravidelně se hýbat a zase se cítit dobře ve svém těle, tady máš konkrétní plán, od kterého se odrazit. Podívej se, co najdeš uvnitř programu.</p>
                <MaterialsList items={courseMaterials} />
              </div>
              <div className={styles.courseMedia}>
                <Image src="/kurz/materialy.png" alt="Jídelníček a další materiály programu Máma ve formě"
                  width={440} height={190} className={styles.coursePhoto} />
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.courseContent} ${styles.ebook}`} aria-labelledby="manual-pro-mamy">
          <div className="container">
            <div className={styles.courseContentInner}>
              <div>
                <h2 id="manual-pro-mamy" className={`section-title ${styles.courseContentTitle}`}>E-book Manuál pro mámy</h2>
                <p>Tenhle manuál jsem napsala pro chvíle, kdy víš, že chceš jíst vyváženě, ale v množství rad se ztrácíš. Provedu tě každým jídlem dne a ukážu ti, jak si jídelníček upravit podle toho, co ti chutná, kolik máš času a čeho chceš dosáhnout.</p>
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
                <p>Vedu skupinové i individuální tréninky, sestavuji pohybové a výživové plány a věnuji se osobním konzultacím. Potkávám při nich ženy, které chtějí zhubnout, mít víc energie a znovu se ve svém těle cítit dobře.</p>
                <p>Do programu i e-booku jsem promítla otázky, se kterými za mnou klientky nejčastěji přicházejí. Najdeš v nich moje vysvětlení i postupy, které můžeš rovnou zkusit u sebe doma.</p>
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
