import Image from "next/image";
import { LeadForm } from "@/components/forms/lead-form";
import { urlForImageSized } from "@/lib/sanity/image";
import type { SanityServicePage } from "@/lib/sanity/loaders";
import styles from "./service-page-template.module.css";

export function ServicePageTemplate({ page }: { page: SanityServicePage }) {
  const heroImageUrl = page.heroImage
    ? urlForImageSized(page.heroImage, 800, 900, "crop") ?? null
    : null;

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>{page.title}</h1>
            {page.excerpt && <p className={styles.heroLead}>{page.excerpt}</p>}
            {page.leadFormKey && (
              <a href="#formular" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
                Chci se přihlásit
              </a>
            )}
          </div>
          {heroImageUrl && (
            <div className={styles.heroMedia}>
              <Image
                src={heroImageUrl}
                alt={page.heroImage?.alt ?? page.title ?? ""}
                width={800}
                height={900}
                priority
                className={styles.heroPhoto}
              />
            </div>
          )}
        </div>
      </section>

      {/* Benefits */}
      {page.benefits && page.benefits.length > 0 && (
        <section className={styles.benefits}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Proč si vybrat tuto službu?</h2>
            <ul className={styles.benefitsList}>
              {page.benefits.map((b) => (
                <li key={b._key} className={styles.benefitsItem}>
                  <span className={styles.checkmark} aria-hidden="true">✓</span>
                  {b.text}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Steps */}
      {page.steps && page.steps.length > 0 && (
        <section className={styles.steps}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Jak to funguje?</h2>
            <ol className={styles.stepsList}>
              {page.steps.map((step, i) => (
                <li key={step._key} className={styles.stepsItem}>
                  <span className={styles.stepNumber}>{String(i + 1).padStart(2, "0")}</span>
                  <div className={styles.stepBody}>
                    <strong className={styles.stepTitle}>{step.title}</strong>
                    {step.description && <p className={styles.stepDesc}>{step.description}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {page.testimonials && page.testimonials.length > 0 && (
        <section className={styles.testimonials}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Co říkají klientky?</h2>
            <div className={styles.testimonialsGrid}>
              {page.testimonials.map((t) => (
                <blockquote key={t._key} className={styles.testimonialCard}>
                  <p className={styles.testimonialQuote}>&ldquo;{t.quote}&rdquo;</p>
                  {t.author && <footer className={styles.testimonialAuthor}>— {t.author}</footer>}
                </blockquote>
              ))}
            </div>
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

      {/* Lead form */}
      {page.leadFormKey && (
        <section className={styles.formSection} id="formular">
          <div className="container" style={{ maxWidth: 640 }}>
            <LeadForm
              formKey={page.leadFormKey}
              title="Zaujalo tě to?"
              description="Zanech mi kontakt a ozvu se ti."
            />
          </div>
        </section>
      )}
    </>
  );
}
