import type { Metadata } from "next";
import Image from "next/image";
import { StructuredData } from "@/components/structured-data";
import styles from "./osobni-konzultace.module.css";
import { getSanityRouteMetadata } from "@/lib/sanity/loaders";
import { OsobniKonzultaceForm } from "./OsobniKonzultaceForm";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return getSanityRouteMetadata({ kind: "servicePage", routePath: "/osobni-konzultace" });
}

export default function OsobniKonzultacePage() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Domů", item: "https://www.zdravimebavi.cz/" },
        { "@type": "ListItem", position: 2, name: "Osobní konzultace", item: "https://www.zdravimebavi.cz/osobni-konzultace" }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Osobní konzultace výživy a pohybu",
      url: "https://www.zdravimebavi.cz/osobni-konzultace",
      description: "Online osobní konzultace výživy a pohybu přesně na míru s Ivou Vaňkovou.",
      provider: {
        "@type": "Organization",
        name: "Zdraví mě baví",
        url: "https://www.zdravimebavi.cz"
      },
      areaServed: "Czech Republic"
    }
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <div>
      {/* ─── Hero / Form ─────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div>
            <h1 className={styles.heroTitle}>Zamluv si svou osobní konzultaci</h1>
            <div className={styles.heroText}>
              <p>
                Do formuláře vyplň své jméno a e-mail. Pošlu ti nabídku nejbližších volných termínů,
                ze kterých si vybereš.
              </p>
              <p>
                Do políčka „Téma konzultace" prosím co nejpřesněji popiš, čemu se chceš na
                konzultaci věnovat.
              </p>
              <p>Už se moc těším na naše setkání!</p>
            </div>

            <OsobniKonzultaceForm />
          </div>

          <div className={styles.imageSide}>
            <Image
              src="/osobni-konzultace-iva.png"
              alt="Iva Vaňková"
              width={320}
              height={320}
              className={styles.heroPhoto}
              priority
            />
            <div className={styles.certSection}>
              <p className={styles.certLabel}>Moje certifikace</p>
              <div className={styles.certImages}>
                <Image
                  src="/cert-vyziva.png"
                  alt="Certifikát poradce pro výživu"
                  width={300}
                  height={210}
                  className={styles.certImg}
                />
                <Image
                  src="/cert-fitness.jpg"
                  alt="Certifikát instruktor fitness"
                  width={300}
                  height={210}
                  className={styles.certImg}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Featured testimonial ─────────────────────────── */}
      <section className="section" style={{ background: "var(--color-surface-alt)" }}>
        <div className="container--narrow">
          <h2 className={styles.testimonialHeading}>
            Přečti si jednu z referencí na konzultaci
          </h2>
          <div className={styles.featuredTestimonial}>
            <div className={styles.testimonialPhotoWrap}>
              <Image
                src="/peta-kralikova.jpg"
                alt="Petra Králíková"
                width={140}
                height={140}
                className={styles.testimonialPhoto}
              />
            </div>
            <blockquote className={styles.testimonialQuote}>
              <p>
                „Z konzultace jsem si odnesla hlavně <strong>praktické informace</strong>, jak si
                mám poskládat jídlo, když nejím maso. Věděla jsem, že jím málo bílkovin a Iva mi
                poradila i kombinace jejich rostlinných zdrojů. Taky teď vím, že bych měla celkově
                jíst víc."
              </p>
              <cite>Petra Králíková, maminka 2 kluků</cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ─── Další reference ──────────────────────────────── */}
      <section className="section">
        <div className="container">
          <h2 className="section-title section-title--center">Další reference</h2>
          <div className={styles.reviewsGrid}>
            <div className={styles.reviewCard}>
              Píšu až teď, ale zase jsem aspoň měla čas zkouše 😊 Na nákupu jsem se podívala po
              těch nových věcech, jak jsme se bavily a je pravda, že není potřeba kupovat nic
              speciálního. Protože já teď už po týdnu vidím, že když si hlídám, jak je jídlo
              sestavené, vůbec pak nepotřebuji jíst ty věci navíc. Fakt se cítím skvěle, budu
              pokračovat 👌👌👌
            </div>
            <div className={styles.reviewCard}>
              Napíšu ještě čerstvé dojmy 🌻 Tolik informací, za to děkuji. A jsem ráda, že mě
              chápeš s tím jídlem v práci. Ale určitě teď už vím, jak vybírat a že jen saláty atd.
              nejdou dost. Je pravda, že stejně to pak doháním večer 🙈😅 Všechno jsi mi krásně
              vysvětlila a určitě ty obědy zkusím vymyslet líp, at nejsem zbytečně unavená... Moc
              děkuji! 🍀
            </div>
            <div className={styles.reviewCard}>
              Ahoj Ivi, konzultaci jsem si moc užila 😊 Byl to vlastně takový kamarádský rozhovor,
              ale profesionální. Dodala jsi mi motivaci, jak využít léto, abych se cítila lépe 🌻
              Tušila jsem to, ale stejně mě překvapilo, jak moc jsi milá 😊 Určitě pak ještě
              napíšu, co z těch doporučení se mi podařilo zařadit, ale chtěla bych všechny 😁
            </div>
            <div className={styles.reviewCard}>
              Ahoj Ivi, z konzultace si odnáším několik &quot;AHA&quot; momentů. Když jsme se
              postupně dostávaly k dalším tématům, začalo mi to do sebe zapadat. Já už jsem prostě
              nevěděla, co mám dělat, všude čtu úplně protichůdné informace. Tvůj široký rozhled mi
              pomohl se v tom zorientovat a hlavně jsem teď klidnější. 😊 Moc si vážím i toho času
              navíc, který jsi mi věnovala. Děkuji 💗
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
