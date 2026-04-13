import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { CheckoutPanel } from "@/components/checkout/checkout-panel";
import { LeadForm } from "@/components/forms/lead-form";
import { urlForImage } from "@/lib/sanity/image";

export type PageBuilderBlock =
  | {
      _type?: "heroBlock";
      heading?: string;
      subheading?: string;
      eyebrow?: string;
      primaryLabel?: string;
      primaryHref?: string;
      secondaryLabel?: string;
      secondaryHref?: string;
      image?: {
        asset?: { url?: string; _ref?: string; _type?: string };
        alt?: string;
      };
    }
  | {
      _type?: "richTextBlock";
      title?: string;
      content?: readonly unknown[];
    }
  | {
      _type?: "ctaBlock";
      heading?: string;
      body?: string;
      eyebrow?: string;
      primaryLabel?: string;
      primaryHref?: string;
      secondaryLabel?: string;
      secondaryHref?: string;
    }
  | {
      _type?: "imageBlock";
      image?: {
        asset?: { url?: string; _ref?: string; _type?: string };
        alt?: string;
      };
      caption?: string;
    }
  | {
      _type?: "formBlock";
      title?: string;
      description?: string;
      formKey?: string;
    }
  | {
      _type?: "embedBlock";
      title?: string;
      provider?: string;
      embedUrl?: string;
      embedCode?: string;
    }
  | {
      _type?: "testimonialBlock";
      title?: string;
      items?: Array<{ quote?: string; author?: string; context?: string }>;
    }
  | {
      _type?: "faqBlock";
      title?: string;
      items?: Array<{ question?: string; answer?: string }>;
    };

type PageBuilderProps = {
  blocks?: readonly PageBuilderBlock[];
  pageTitle?: string;
  pagePath?: string;
  checkoutProductKey?: string;
};

function renderLinks({
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref
}: {
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  if (!primaryLabel && !secondaryLabel) {
    return null;
  }

  return (
    <div className="button-row">
      {primaryLabel && primaryHref ? (
        <a className="button-primary" href={primaryHref}>
          {primaryLabel}
        </a>
      ) : null}
      {secondaryLabel && secondaryHref ? (
        <a className="button-secondary" href={secondaryHref}>
          {secondaryLabel}
        </a>
      ) : null}
    </div>
  );
}

function getImageUrl(image?: { asset?: { url?: string; _ref?: string; _type?: string } }) {
  return image?.asset?.url || urlForImage(image);
}

export function PageBuilder({
  blocks = [],
  pageTitle,
  pagePath = "/",
  checkoutProductKey
}: PageBuilderProps) {
  return (
    <div className="stack" style={{ gap: "1.5rem" }}>
      {blocks.map((block, index) => {
        const key = `${block._type ?? "block"}-${index}`;

	      if (block._type === "heroBlock") {
          const imageUrl = getImageUrl(block.image);
          return (
            <section className="surface-card page-builder-hero" key={key}>
              <div className="stack">
                {block.eyebrow ? <p className="eyebrow">{block.eyebrow}</p> : null}
                <h2>{block.heading || pageTitle || "Hero block"}</h2>
                {block.subheading ? <p className="page-lead">{block.subheading}</p> : null}
                {renderLinks(block)}
              </div>
              {imageUrl ? (
                <div className="builder-image-wrap">
                  <Image
                    alt={block.image?.alt || block.heading || "Hero image"}
                    className="builder-image"
                    height={720}
                    src={imageUrl}
                    unoptimized
                    width={960}
                  />
                </div>
              ) : null}
            </section>
          );
        }

        if (block._type === "richTextBlock") {
          return (
            <section className="surface-card stack" key={key} style={{ padding: "2rem" }}>
              {block.title ? <h2>{block.title}</h2> : null}
              <div className="portable-text">
                <PortableText
                  components={{
                    types: {
                      image: ({ value }) => {
                        const imageUrl = getImageUrl(value);
                        if (!imageUrl) {
                          return null;
                        }

                        return (
                          <figure className="snapshot-figure">
                            <Image
                              alt={value.alt || block.title || pageTitle || "Obsahový obrázek"}
                              className="builder-image"
                              height={900}
                              src={imageUrl}
                              unoptimized
                              width={1200}
                            />
                            {value.alt ? <figcaption className="muted">{value.alt}</figcaption> : null}
                          </figure>
                        );
                      }
                    }
                  }}
                  value={(block.content ?? []) as any}
                />
              </div>
            </section>
          );
        }

        if (block._type === "ctaBlock") {
          return (
            <section className="surface-card stack" key={key} style={{ padding: "2rem" }}>
              {block.eyebrow ? <p className="eyebrow">{block.eyebrow}</p> : null}
              <h2>{block.heading || "CTA block"}</h2>
              {block.body ? <p className="page-lead">{block.body}</p> : null}
              {renderLinks(block)}
            </section>
          );
        }

        if (block._type === "imageBlock") {
          const imageUrl = getImageUrl(block.image);
          return (
            <figure className="surface-card stack" key={key} style={{ padding: "1rem" }}>
              {imageUrl ? (
                <Image
                  alt={block.image?.alt || block.caption || "Content image"}
                  className="builder-image"
                  height={720}
                  src={imageUrl}
                  unoptimized
                  width={1200}
                />
              ) : null}
              {block.caption ? <figcaption className="muted">{block.caption}</figcaption> : null}
            </figure>
          );
        }

        if (block._type === "formBlock") {
          if (checkoutProductKey && block.formKey?.includes("checkout")) {
            return (
              <CheckoutPanel
                description={block.description || "Stripe checkout flow scaffold."}
                key={key}
                productKey={checkoutProductKey}
                sourcePage={pagePath}
                title={block.title || "Checkout"}
              />
            );
          }

          return (
            <LeadForm
              description={block.description || "Nativni Next.js formular napojeny na API route."}
              formKey={block.formKey || "kontakt"}
              key={key}
              title={block.title || "Formulář"}
            />
          );
        }

        if (block._type === "embedBlock") {
          return (
            <section className="surface-card stack" key={key} style={{ padding: "2rem" }}>
              <p className="eyebrow">Embed</p>
              <h2>{block.title || block.provider || "Embed block"}</h2>
              {block.embedUrl ? (
                <a href={block.embedUrl} rel="noreferrer" target="_blank">
                  Otevřít embed zdroj
                </a>
              ) : null}
              {block.embedCode ? <pre className="code-block">{block.embedCode}</pre> : null}
            </section>
          );
        }

        if (block._type === "testimonialBlock") {
          return (
            <section className="stack" key={key}>
              {block.title ? <h2>{block.title}</h2> : null}
              <div className="card-grid">
                {(block.items || []).map((item, itemIndex) => (
                  <article className="surface-card stack" key={`${key}-${itemIndex}`} style={{ padding: "1.5rem" }}>
                    {item.quote ? <p>{item.quote}</p> : null}
                    {item.author ? <strong>{item.author}</strong> : null}
                    {item.context ? <p className="muted">{item.context}</p> : null}
                  </article>
                ))}
              </div>
            </section>
          );
        }

        if (block._type === "faqBlock") {
          return (
            <section className="stack" key={key}>
              {block.title ? <h2>{block.title}</h2> : null}
              <div className="stack">
                {(block.items || []).map((item, itemIndex) => (
                  <details className="surface-card" key={`${key}-${itemIndex}`} style={{ padding: "1rem 1.25rem" }}>
                    <summary>{item.question || "Otázka"}</summary>
                    {item.answer ? <p style={{ marginTop: "0.75rem" }}>{item.answer}</p> : null}
                  </details>
                ))}
              </div>
            </section>
          );
        }

        return (
          <section className="surface-card stack" key={key} style={{ padding: "1.5rem" }}>
            <p className="eyebrow">Unknown block</p>
            <pre className="code-block">{JSON.stringify(block, null, 2)}</pre>
          </section>
        );
      })}
    </div>
  );
}
