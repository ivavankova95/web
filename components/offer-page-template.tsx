import Image from "next/image";
import { LeadForm } from "@/components/forms/lead-form";
import { CheckoutPanel } from "@/components/checkout/checkout-panel";
import { urlForImageSized } from "@/lib/sanity/image";
import type { SanityOfferPage } from "@/lib/sanity/loaders";
import styles from "./offer-page-template.module.css";

export function OfferPageTemplate({ page, routePath }: { page: SanityOfferPage; routePath: string }) {
  const heroImageUrl = page.heroImage
    ? urlForImageSized(page.heroImage, 700, 800, "crop") ?? null
    : null;

  const hasCheckout = page.checkoutMode === "stripeRedirect" || page.checkoutMode === "stripeEmbedded";

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>{page.title}</h1>
            {page.excerpt && <p className={styles.heroLead}>{page.excerpt}</p>}
            {page.productPrice && (
              <p className={styles.heroPrice}>{page.productPrice}</p>
            )}
            <a href="#objednavka" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
              {hasCheckout ? "Chci to koupit" : "Chci se přihlásit"}
            </a>
          </div>
          {heroImageUrl && (
            <div className={styles.heroMedia}>
              <Image
                src={heroImageUrl}
                alt={page.heroImage?.alt ?? page.title ?? ""}
                width={700}
                height={800}
                priority
                className={styles.heroPhoto}
              />
            </div>
          )}
        </div>
      </section>

      {/* What you get */}
      {page.whatYouGet && page.whatYouGet.length > 0 && (
        <section className={styles.whatYouGet}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Co dostaneš?</h2>
            <ul className={styles.featureList}>
              {page.whatYouGet.map((item) => (
                <li key={item._key} className={styles.featureItem}>
                  <span className={styles.checkmark} aria-hidden="true">✓</span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* For whom */}
      {page.forWhom && page.forWhom.length > 0 && (
        <section className={styles.forWhom}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Pro koho je to určeno?</h2>
            <ul className={styles.featureList}>
              {page.forWhom.map((item) => (
                <li key={item._key} className={styles.featureItem}>
                  <span className={styles.bullet} aria-hidden="true">→</span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Reference images */}
      {page.referenceImages && page.referenceImages.length > 0 && (
        <section className={styles.referenceImages}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Reference</h2>
            <div className={styles.referenceGrid}>
              {page.referenceImages.map((img) => {
                const url = urlForImageSized(img, 600, 600, "max");
                if (!url) return null;
                return (
                  <div key={img._key} className={styles.referenceItem}>
                    <Image
                      src={url}
                      alt={img.alt ?? "Reference"}
                      width={600}
                      height={600}
                      className={styles.referencePhoto}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Checkout / Lead form */}
      <section className={styles.orderSection} id="objednavka">
        <div className="container" style={{ maxWidth: 640 }}>
          {hasCheckout && page.productKey ? (
            <CheckoutPanel
              productKey={page.productKey}
              sourcePage={routePath}
              title={page.title ?? "Objednat"}
              description={page.excerpt ?? ""}
            />
          ) : (
            <LeadForm
              formKey={page.productKey ?? "kontakt"}
              title="Zaujalo tě to?"
              description="Zanech mi kontakt a ozvu se ti."
            />
          )}
        </div>
      </section>
    </>
  );
}
