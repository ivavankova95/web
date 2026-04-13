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

function renderBlock(block: SnapshotBlock, key: string) {
  if (block.type === "heading") {
    const Tag = block.level === "1" ? "h1" : block.level === "2" ? "h2" : block.level === "3" ? "h3" : "h4";
    return <Tag key={key}>{asText(block.text)}</Tag>;
  }

  if (block.type === "paragraph") {
    return <p key={key}>{asText(block.text)}</p>;
  }

  if (block.type === "image" && block.src) {
    return (
      <figure className="snapshot-figure" key={key}>
        <img alt={asText(block.alt)} className="snapshot-image" src={asText(block.src)} />
        {block.alt ? <figcaption className="muted">{asText(block.alt)}</figcaption> : null}
      </figure>
    );
  }

  if (block.type === "cta" && block.href) {
    return (
      <a className="button-secondary" href={asText(block.href)} key={key}>
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
      <blockquote className="surface-card snapshot-quote" key={key}>
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
  const page = await getSnapshotPage(routePath);

  if (!page) {
    notFound();
  }

  const formKeys = getSnapshotFormKeys(page.forms);
  const productKey = getSnapshotProductKey(routePath);
  const title = getSnapshotDisplayTitle(page);
  const description = getSnapshotDescription(page);
  const heroImage = page.images.find(
    (image) => image.source_url && !/(logo|podpis)/i.test(asText(image.alt))
  );
  const visibleBlocks = [...page.blocks];
  void notes;

  if (
    visibleBlocks[0]?.type === "heading" &&
    (visibleBlocks[0] as { text?: string }).text &&
    asText((visibleBlocks[0] as { text?: string }).text) === title
  ) {
    visibleBlocks.shift();
  }

  return (
    <section className="page-section">
      <div className="container page-grid">
        <div className="surface-card stack" style={{ padding: "2rem" }}>
          <p className="eyebrow">{layout}</p>
          <h1>{title}</h1>
          <p className="page-lead">{description}</p>
          {contextLinks.length ? (
            <div className="taxonomy-pills">
              {contextLinks.map((link) => (
                <a className="pill-link" href={link.href} key={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
          {heroImage?.source_url ? (
            <figure className="snapshot-figure">
              <img alt={asText(heroImage.alt) || title} className="snapshot-image" src={heroImage.source_url} />
              {heroImage.alt ? <figcaption className="muted">{asText(heroImage.alt)}</figcaption> : null}
            </figure>
          ) : null}
        </div>

        {productKey ? (
          <CheckoutPanel
            description="Snapshot-backed checkout scaffold. Finální checkout poběží nad Stripe price IDs a Make automatizací."
            productKey={productKey}
            sourcePage={routePath}
            title="Stripe checkout"
          />
        ) : null}

        {formKeys.map((formKey) => (
          <LeadForm
            description="Formulář je vykreslený podle detekce ze snapshotu. Finální verze se napojí na MailerLite nebo Make."
            formKey={formKey}
            key={formKey}
            title={`Formulář: ${formKey}`}
          />
        ))}

        <article className="surface-card snapshot-article" style={{ padding: "2rem" }}>
          {routeType === "blogPost" ? <p className="eyebrow">Článek</p> : null}
          {renderBlocks(visibleBlocks)}
        </article>
      </div>
    </section>
  );
}
