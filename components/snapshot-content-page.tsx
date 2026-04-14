import { notFound } from "next/navigation";
import { CheckoutPanel } from "@/components/checkout/checkout-panel";
import { LeadForm } from "@/components/forms/lead-form";
import {
  getSnapshotDisplayTitle,
  getSnapshotDescription,
  getSnapshotFormKeys,
  getSnapshotPage,
  getSnapshotProductKey,
  type SnapshotBlock
} from "@/lib/content/snapshot";

type SnapshotContentPageProps = {
  routePath: string;
  layout: string;
  routeType: string;
  notes?: string[];
  contextLinks?: Array<{ href: string; label: string }>;
};

function asText(value: unknown) {
  return typeof value === "string" ? value : "";
}

function isUiAsset(alt: string, src: string) {
  return (
    /(logo|podpis|ikona|icon|facebook|instagram|twitter|youtube)/i.test(alt) ||
    /(facebook|instagram|twitter|youtube|social)/i.test(src) ||
    src.endsWith(".svg")
  );
}

function renderBlock(block: SnapshotBlock, key: string) {
  if (block.type === "heading") {
    const Tag = block.level === "1" ? "h1" : block.level === "2" ? "h2" : block.level === "3" ? "h3" : "h4";
    return <Tag key={key}>{asText(block.text)}</Tag>;
  }

  if (block.type === "paragraph") {
    return <p key={key}>{asText(block.text)}</p>;
  }

  if (block.type === "image" && block.src) {
    const src = asText(block.src);
    const alt = asText(block.alt);
    // Skip Webflow UI decoration icons (logos, social icons, SVGs)
    if (isUiAsset(alt, src)) {
      return null;
    }
    return (
      <figure className="snapshot-figure" key={key}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={alt} className="snapshot-image" src={src} loading="lazy" />
      </figure>
    );
  }

  if (block.type === "cta" && block.href) {
    return (
      <a className="btn btn-primary" href={asText(block.href)} key={key}>
        {asText(block.text) || "Otevřít"}
      </a>
    );
  }

  if (block.type === "caption") {
    return (
      <p className="muted" key={key}>
        {asText(block.text)}
      </p>
    );
  }

  if (block.type === "blockquote") {
    return (
      <blockquote className="snapshot-quote" key={key}>
        {asText(block.text)}
      </blockquote>
    );
  }

  return null;
}

function renderBlocks(blocks: SnapshotBlock[]) {
  const items: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  function flushList(index: number) {
    if (!listBuffer.length) {
      return;
    }

    items.push(
      <ul className="snapshot-list" key={`list-${index}`}>
        {listBuffer.map((item, itemIndex) => (
          <li key={`list-${index}-${itemIndex}`}>{item}</li>
        ))}
      </ul>
    );
    listBuffer = [];
  }

  blocks.forEach((block, index) => {
    if (block.type === "list_item") {
      const text = asText(block.text);
      if (text) {
        listBuffer.push(text);
      }
      return;
    }

    flushList(index);
    const rendered = renderBlock(block, `block-${index}`);
    if (rendered) {
      items.push(rendered);
    }
  });

  flushList(blocks.length);
  return items;
}

export async function SnapshotContentPage({
  routePath,
  layout,
  routeType,
  notes = [],
  contextLinks = []
}: SnapshotContentPageProps) {
  void notes;
  void layout;

  const page = await getSnapshotPage(routePath);

  if (!page) {
    notFound();
  }

  const formKeys = getSnapshotFormKeys(page.forms);
  const productKey = getSnapshotProductKey(routePath);
  const title = getSnapshotDisplayTitle(page);
  const description = getSnapshotDescription(page);

  const isLegalPage = routeType === "legalPage";
  const isArticle = routeType === "blogPost";

  // Hero image — exclude logos, social media icons and SVG assets
  const heroImage = !isLegalPage
    ? page.images.find(
        (image) =>
          image.source_url &&
          !isUiAsset(asText(image.alt), image.source_url)
      )
    : null;

  const visibleBlocks = [...page.blocks];

  // Remove leading block if it duplicates the page title
  if (
    visibleBlocks[0]?.type === "heading" &&
    asText((visibleBlocks[0] as { text?: string }).text) === title
  ) {
    visibleBlocks.shift();
  }

  const containerClass = isLegalPage ? "container--narrow" : "container";

  return (
    <section className="page-section">
      <div className={containerClass}>

        {/* Breadcrumb context links */}
        {contextLinks.length > 0 && (
          <div className="taxonomy-pills" style={{ marginBottom: "1.5rem" }}>
            {contextLinks.map((link) => (
              <a className="pill-link" href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* Page header */}
        <header style={{ marginBottom: "2rem" }}>
          {isArticle && <p className="eyebrow" style={{ marginBottom: "0.5rem" }}>Článek</p>}
          <h1 style={{ marginBottom: "0.75rem" }}>{title}</h1>
          <p className="page-lead">{description}</p>
        </header>

        {/* Hero image */}
        {heroImage?.source_url && (
          <figure style={{ margin: "0 0 2.5rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={asText(heroImage.alt) || title}
              src={heroImage.source_url}
              loading={isArticle ? "eager" : "lazy"}
              style={{
                width: "100%",
                borderRadius: "var(--radius-panel)",
                display: "block",
                maxHeight: isArticle ? "480px" : "420px",
                objectFit: "cover"
              }}
            />
          </figure>
        )}

        {/* Stripe checkout */}
        {productKey && (
          <div style={{ marginBottom: "2rem" }}>
            <CheckoutPanel
              productKey={productKey}
              sourcePage={routePath}
              title={title}
              description={description}
            />
          </div>
        )}

        {/* Lead forms */}
        {formKeys.map((formKey) => (
          <div key={formKey} style={{ marginBottom: "2rem" }}>
            <LeadForm
              formKey={formKey}
              title={title}
              description=""
            />
          </div>
        ))}

        {/* Page content */}
        <article className="snapshot-article">
          {renderBlocks(visibleBlocks)}
        </article>

      </div>
    </section>
  );
}
