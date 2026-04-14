import Image from "next/image";
import Link from "next/link";
import { getSanityBlogPosts } from "@/lib/sanity/loaders";
import { getSnapshotBlogArticles } from "@/lib/content/snapshot";
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
    bullets: [
      "Vyplníš kontaktní formulář a ozvu se ti.",
      "Domluvíme termín konzultace (cca 60 minut).",
      "Probereme tvůj aktuální stav a cíle.",
      "Dostaneš individuální doporučení přesně pro tvou situaci.",
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
    bullets: [
      "Zhubni bez počítání kalorií — unikátní metoda.",
      "Jídelníček na 7 dní + nákupní seznam a recepty.",
      "Video tréninky od jógy po intervalový HIIT.",
      "Plánovač cílů a priorit na celý rok.",
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
    bullets: [
      "Krok za krokem k jídelníčku pro vysněnou postavu.",
      "Zdravé návyky, které využiješ každý den.",
      "Žádné počítání kalorií ani zakázané potraviny.",
      "Jíst zdravě je jednoduché.",
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
    bullets: [
      "Skupinové lekce pro sílu a kondici.",
      "Individuální lekce podle tvých potřeb.",
      "Lekce pro tebe a kamarádku nebo skupinu.",
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
              <Link href="/konzultace-zdarma" className="btn btn-primary">
                Konzultace zdarma
              </Link>
              <Link href="/o-mne" className="btn btn-outline">
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
                  <ul className={styles.serviceCardList}>
                    {service.bullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                  <Link
                    href={service.href}
                    className="btn btn-primary"
                    style={{ alignSelf: "flex-start", marginTop: "auto" }}
                  >
                    {service.ctaLabel}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Free consultation CTA strip ────────────────────── */}
      <section className={styles.ctaStrip}>
        <div className="container">
          <h2 className={styles.ctaStripTitle}>Bezplatná konzultace — 30 minut zdarma</h2>
          <p className={styles.ctaStripBody}>
            Probereme tvůj aktuální stav a cíle. Po konzultaci dostaneš shrnutí a praktické návrhy,
            co konkrétně dělat.
          </p>
          <Link href="/konzultace-zdarma" className="btn btn-white">
            Chci konzultaci zdarma
          </Link>
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
    </>
  );
}
