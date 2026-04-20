import Image from "next/image";
import Link from "next/link";
import { getSanityBlogPosts } from "@/lib/sanity/loaders";
import { getSnapshotBlogArticles } from "@/lib/content/snapshot";
import { BeholdWidget } from "./behold-widget";
import styles from "./homepage-sections.module.css";

const SERVICES = [
  {
    key: "konzultace",
    title: "Osobní konzultace",
    href: "/osobni-konzultace",
    ctaLabel: "Chci konzultaci",
    imageUrl:
      "https://cdn.prod.website-files.com/63ff2d0a40f8ce45bb82885b/6469260c09f96ad7708ad841_Pruvodce_vyzivou_mini(1).png",
    imageAlt: "Osobní konzultace",
    description:
      "Potřebuješ poradit ohledně výživy, pohybu a zdravého životního stylu? Řešíš konkrétní problém, nebo chceš nasměrovat a podpořit? Zamluv si osobní konzultaci.",
    bulletsHeading: "Jak konzultace probíhá?",
    bullets: [
      "Vyplníš kontaktní formulář a já se ti ozvu.",
      "Domluvíme termín konzultace a způsob, kterým se spojíme.",
      "Na konzultaci si vyhraď přibližně 60 minut.",
      "Probereme tvůj aktuální stav a cíle.",
      "Dostaneš ode mě individuální doporučení přesně pro tvou situaci.",
    ],
  },
  {
    key: "kurz",
    title: "Online kurz",
    href: "/zhubni-bez-pocitani-kalorii",
    ctaLabel: "Zajímá mě to",
    imageUrl:
      "https://cdn.prod.website-files.com/63ff2d0a40f8ce45bb82885b/66e07031ac5d639195ac2bdb_Online_kurz_mockup.png",
    imageAlt: "Online kurz mockup",
    description: "Mám pro tebe komplexní online kurz, díky kterému konečně zhubneš:",
    tagline: "Získej ještě lepší postavu než před dětmi a udrž si ji už navždy",
    description2: "Získáš přístup do členské sekce, kde najdeš informace, konkrétní postupy a motivaci.",
    bulletsHeading: "Co je součástí kurzu?",
    bullets: [
      "Unikátní metoda, díky které zhubneš bez počítání kalorií.",
      "Inspirativní jídelníček na 7 dní, který doopravdy využiješ v praxi. Včetně nákupního seznamu a receptů.",
      "Video tréninky od jógy po intervalový HIIT.",
      "Plánovač cílů a priorit na celý rok.",
      "… a spoustu dalšího!",
    ],
  },
  {
    key: "ebook",
    title: "E-book",
    href: "/e-book-jak-sestavit-jidelnicek",
    ctaLabel: "To je přesně pro mě",
    imageUrl:
      "https://cdn.prod.website-files.com/63ff2d0a40f8ce45bb82885b/66dff65b0990f6008059890b_E-book%20mockup%20kniha%201(1).png",
    imageAlt: "E-book — Jak sestavit jídelníček",
    tagline: "Manuál pro mámy",
    description: "Představ si e-book, který změní tvůj pohled na jídlo a zjistíš díky němu, jak sestavit jídelníček za každé situace.",
    bulletsHeading: "Na co se v e-booku můžeš těšit?",
    bullets: [
      "Provede tě krok za krokem k jídelníčku, který ti pomůže k vysněné postavě.",
      "Osvojíš si zdravé návyky, které využiješ každý den, ať jsi kdekoli a děláš cokoli.",
      "Žádné počítání kalorií, zakázané potraviny a diety.",
      "Naučíš se unikátní metodou sestavit jídelníček přesně podle tvých cílů.",
      "Zjistíš, že jíst zdravě je jednoduché. Jde to, i když vaříš pro rodinu nebo jíš v práci.",
    ],
  },
  {
    key: "lekce",
    title: "Lekce cvičení",
    href: "/lekce-cviceni",
    ctaLabel: "Chci vědět víc",
    imageUrl:
      "https://cdn.prod.website-files.com/63ff2d0a40f8ce45bb82885b/646925913039900ad6431d69_Treninky_cviceni_mini(1).png",
    imageAlt: "Lekce cvičení",
    description: "Přijď na skupinovou lekci nebo si domluv osobní trénink.",
    bulletsHeading: "Kde si spolu zacvičíme naživo?",
    bullets: [
      "Skupinové lekce pro sílu a kondici.",
      "Individuální lekce podle tvých potřeb.",
      "Lekce pro tebe a kamarádku, partnera nebo malou skupinu.",
      "Diagnostika pohybového aparátu.",
    ],
  },
];

export async function HomepageSections() {
  const sanityPosts = await getSanityBlogPosts();
  const snapshotPosts = sanityPosts?.length ? null : await getSnapshotBlogArticles();
  const blogPosts = (sanityPosts ?? snapshotPosts ?? []).slice(0, 3);

  return (
    <>
      {/* ─── Hero ───────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <p className="eyebrow">Zdraví mě baví</p>
            <h1 className={styles.heroTitle}>
              Provedu tě na cestě za zdravým a&nbsp;funkčním tělem
            </h1>
            <p className={styles.heroSub}>díky propojení pohybu a výživy</p>
            <p className={styles.heroBody}>
              Jsem certifikovaná kondiční trenérka a výživářka pro ženy.
            </p>
            <div className={styles.heroCta}>
              <Link href="/o-mne" className="btn btn-primary">
                Více o mně
              </Link>
            </div>
          </div>

          <div className={styles.heroMedia}>
            <Image
              src="/hero-iva.png"
              alt="Iva — zakladatelka projektu Zdraví mě baví"
              width={480}
              height={600}
              priority
              className={styles.heroPhoto}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/podpis.png"
              alt="Podpis Iva"
              className={styles.heroPodpis}
            />
          </div>
        </div>
      </section>

      {/* ─── News strip ─────────────────────────────────────── */}
      <section className={styles.newsStrip}>
        <div className={styles.newsStripInner}>
          <p className={styles.newsStripEyebrow}>Co pro tebe mám nového?</p>
          <h2 className={styles.newsStripTitle}>
            Workshop pro mámy: Jak nastartovat hubnutí po dětech
          </h2>
          <a
            href="https://webinar.zdravimebavi.cz"
            target="_blank"
            rel="noreferrer"
            className="btn btn-white"
          >
            Chci vědět více
          </a>
        </div>
      </section>

      {/* ─── About ──────────────────────────────────────────── */}
      <section className={styles.about}>
        <div className={`container ${styles.aboutInner}`}>
          <div className={styles.aboutMedia}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://cdn.prod.website-files.com/63ff2d0a40f8ce45bb82885b/64609aab46818cacc5c61e27_DSC02394.jpg"
              alt="Ahoj, jmenuji se Iva"
              className={styles.aboutPhoto}
              loading="lazy"
            />
          </div>

          <div className={styles.aboutContent}>
            <p className="eyebrow">S čím ti pomohu</p>
            <h2 className={styles.aboutTitle}>
              Naučím tě, jak skloubit zdravé jídlo, pohyb a&nbsp;péči o&nbsp;sebe
            </h2>
            <p className={styles.aboutBody}>
              s prací, rodinou a volným časem. Zdravý životní styl nemusí být komplikovaný.
            </p>
            <p className={styles.aboutSubheading}>Můžeš se na mě obrátit, jestli:</p>
            <ul className={styles.aboutList}>
              <li>jsi na začátku cesty za zdravým životním stylem</li>
              <li>už zkušenosti máš, ale potřebuješ cokoli změnit nebo doladit</li>
              <li>se ve výživě a pohybu orientuješ a máš specifické požadavky</li>
              <li>se stravuješ klasicky, jsi vegetariánka, veganka nebo máš výživové omezení</li>
              <li>pravidelně necvičíš, nebo jsi naopak sportovně založená</li>
            </ul>
            <Link href="/o-mne" className="btn btn-outline" style={{ marginTop: "0.5rem", alignSelf: "flex-start" }}>
              Přečti si o mně víc
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Services ───────────────────────────────────────── */}
      <section className={styles.services}>
        <div className="container">
          <h2 className={`section-title ${styles.sectionHeading}`}>Co ti můžu nabídnout?</h2>
          <div className={styles.servicesGrid}>
            {SERVICES.map((service) => (
              <div key={service.key} className={styles.serviceCard}>
                <div className={styles.serviceCardImage}>
                  <Image
                    src={service.imageUrl}
                    alt={service.imageAlt}
                    fill
                    unoptimized
                    style={{ objectFit: "contain", padding: "1.25rem" }}
                    loading="lazy"
                  />
                </div>
                <div className={styles.serviceCardBody}>
                  <h3 className={styles.serviceCardTitle}>{service.title}</h3>
                  {"description" in service && service.description && (
                    <p className={styles.serviceCardDesc}>{service.description}</p>
                  )}
                  {"tagline" in service && service.tagline && (
                    <p className={styles.serviceCardTagline}>{service.tagline}</p>
                  )}
                  {"description2" in service && service.description2 && (
                    <p className={styles.serviceCardDesc}>{service.description2}</p>
                  )}
                  {"bulletsHeading" in service && service.bulletsHeading && (
                    <p className={styles.serviceCardBulletsHeading}>{service.bulletsHeading}</p>
                  )}
                  <ul className={styles.serviceCardList}>
                    {service.bullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                  <Link
                    href={service.href}
                    className="btn btn-primary"
                    style={{ alignSelf: "center", marginTop: "auto" }}
                  >
                    {service.ctaLabel}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


{/* ─── Blog preview ───────────────────────────────────── */}
      {blogPosts.length > 0 && (
        <section className={styles.blogPreview}>
          <div className="container">
            <div className={styles.blogHeader}>
              <h2 className="section-title">Co je nového na blogu?</h2>
              <Link href="/blog" className="btn btn-outline">
                Zobrazit všechny
              </Link>
            </div>
            <div className={styles.blogGrid}>
              {blogPosts.map((post) => (
                <article className="article-card" key={post.slug}>
                  {post.imageUrl && (
                    <Link href={post.href} className="article-card__image-link">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.imageUrl}
                        alt={post.imageAlt ?? post.title}
                        loading="lazy"
                        style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }}
                      />
                    </Link>
                  )}
                  <div className="article-card__body">
                    <Link href={post.href}>
                      <h3 className="article-card__title">{post.title}</h3>
                    </Link>
                    {post.description && (
                      <p className="article-card__excerpt">{post.description}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* ─── Instagram feed ─────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <h2 className="section-title section-title--center" style={{ marginBottom: "2rem" }}>Sleduj mě na Instagramu</h2>
          <BeholdWidget />
        </div>
      </section>
    </>
  );
}
