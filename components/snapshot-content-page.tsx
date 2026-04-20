import { notFound } from "next/navigation";
import { CheckoutPanel } from "@/components/checkout/checkout-panel";
import { LeadForm } from "@/components/forms/lead-form";
import { ArticleImageGallery } from "@/components/article-image-gallery";
import {
  getSnapshotDisplayTitle,
  getSnapshotDescription,
  getSnapshotFormKeys,
  getSnapshotPage,
  getSnapshotProductKey,
  type SnapshotBlock
} from "@/lib/content/snapshot";
import type { SanityIngredientTable } from "@/lib/sanity/loaders";

type SnapshotContentPageProps = {
  routePath: string;
  layout: string;
  routeType: string;
  notes?: string[];
  contextLinks?: Array<{ href: string; label: string }>;
  sanityIngredientTables?: SanityIngredientTable[];
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

// Matches amount values scraped from Webflow ingredient tables.
// Handles: number+unit ("110 g", "6 lžic"), bare counts ("5"), fraction chars,
// and Czech measurement words without leading digit ("Špetka", "Hrst").
const AMOUNT_RE =
  /^(?:[\d¼½¾⅓⅔][\d\s/,.]*\s*(?:g|ml|kg|l\b|dl|cl|lž[ií]ce?|lž[ií]ci|lžic[ei]?|lžičk[ay]?|lžičce|hrnek|hrnk[uyů]?|ks|cm|mm|šálek|šálk[uy]?)\b|[\d]+$|špetk[ay]?|hrst[iu]?|dle\s+chuti|podle\s+chuti|trochu|po\s+chuti)/i;

function cleanText(text: string): string {
  return text.replace(/[\u200b\u200c\u200d\ufeff\u00ad]/g, "").replace(/\u00a0/g, " ").trim();
}

function isPureAmount(text: string): boolean {
  return AMOUNT_RE.test(cleanText(text));
}

type IngredientRow = { name: string; amount: string | null };

// State machine: Webflow scrapes each table column-by-column, so the snapshot
// stores [table1_names..., table1_amounts..., table2_names..., table2_amounts...].
// We detect the names→amounts transition (first amount-like block) and the
// amounts→names transition (name after amounts = new sub-table) to pair correctly.
function buildIngredientRows(blocks: SnapshotBlock[]): IngredientRow[] {
  const allTexts = blocks
    .filter((b) => b.type === "paragraph" || b.type === "list_item")
    .map((b) => cleanText(asText((b as { text?: string }).text)))
    .filter(Boolean);

  const allRows: IngredientRow[] = [];
  let names: string[] = [];
  let amounts: string[] = [];
  let inAmounts = false;

  function flushTable() {
    names.forEach((name, i) => {
      allRows.push({ name, amount: amounts[i] ?? null });
    });
    names = [];
    amounts = [];
    inAmounts = false;
  }

  for (const text of allTexts) {
    if (isPureAmount(text)) {
      inAmounts = true;
      amounts.push(text);
    } else {
      if (inAmounts) {
        // Name appearing after amounts = start of new sub-table
        flushTable();
      }
      names.push(text);
    }
  }

  flushTable();
  return allRows;
}

function renderIngredientCard(blocks: SnapshotBlock[], key: string): React.ReactNode {
  const rows = buildIngredientRows(blocks);
  if (rows.length === 0) return null;

  return (
    <div className="ingredient-card" key={key}>
      <div className="ingredient-card__header">Ingredience</div>
      <ul className="ingredient-list">
        {rows.map((row, i) => (
          <li className="ingredient-row" key={i}>
            <span className="ingredient-name">
              <span className="ingredient-dot" />
              {row.name}
            </span>
            {row.amount ? (
              <span className="ingredient-amount">{row.amount}</span>
            ) : (
              <span className="ingredient-taste">dle chuti</span>
            )}
          </li>
        ))}
      </ul>
    </div>
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

  if (block.type === "image" && (block as { src?: string }).src) {
    const src = asText((block as { src?: string }).src);
    const alt = asText((block as { alt?: string }).alt);
    if (isUiAsset(alt, src)) return null;
    return (
      <figure className="snapshot-figure" key={key}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={alt} className="snapshot-image" src={src} loading="lazy" style={{ borderRadius: "var(--radius-panel)" }} />
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

function renderSanityIngredientTables(tables: SanityIngredientTable[], key: string): React.ReactNode {
  return (
    <div className="ingredient-tables-grid" key={key}>
      {tables.map((table, ti) => (
        <div className="ingredient-card" key={table._key ?? ti}>
          <div className="ingredient-card__header">{table.title || "Ingredience"}</div>
          <ul className="ingredient-list">
            {(table.rows ?? []).map((row, ri) => (
              <li className="ingredient-row" key={row._key ?? ri}>
                <span className="ingredient-name">
                  <span className="ingredient-dot" />
                  {row.name}
                </span>
                {row.amount ? (
                  <span className="ingredient-amount">{row.amount}</span>
                ) : (
                  <span className="ingredient-taste">dle chuti</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

const INGREDIENT_HEADING_RE = /^(ingredience|suroviny)$/i;

function renderBlocks(blocks: SnapshotBlock[], sanityIngredientTables?: SanityIngredientTable[]) {
  const items: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let ingredientBuffer: SnapshotBlock[] | null = null;
  let ingredientStartIndex = 0;
  const allImages: Array<{ src: string; alt: string }> = [];

  function flushList(index: number) {
    if (!listBuffer.length) return;
    items.push(
      <ul className="snapshot-list" key={`list-${index}`}>
        {listBuffer.map((item, itemIndex) => (
          <li key={`list-${index}-${itemIndex}`}>{item}</li>
        ))}
      </ul>
    );
    listBuffer = [];
  }

  function flushIngredients() {
    if (!ingredientBuffer) return;
    const card = sanityIngredientTables && sanityIngredientTables.length > 0
      ? renderSanityIngredientTables(sanityIngredientTables, `ingredients-sanity`)
      : renderIngredientCard(ingredientBuffer, `ingredients-${ingredientStartIndex}`);
    if (card) items.push(card);
    ingredientBuffer = null;
  }

  blocks.forEach((block, index) => {
    // Inside ingredient collection mode
    if (ingredientBuffer !== null) {
      if (block.type === "heading") {
        flushIngredients();
        const rendered = renderBlock(block, `block-${index}`);
        if (rendered) items.push(rendered);
        return;
      }
      ingredientBuffer.push(block);
      return;
    }

    // Detect "Ingredience" / "Suroviny" h2 or h3 heading
    if (block.type === "heading" && (block.level === "2" || block.level === "3")) {
      const text = cleanText(asText(block.text));
      if (INGREDIENT_HEADING_RE.test(text)) {
        flushList(index);
        ingredientBuffer = [];
        ingredientStartIndex = index;
        return;
      }
    }

    // Collect all content images for the gallery at the end
    if (block.type === "image" && (block as { src?: string }).src) {
      const src = asText((block as { src?: string }).src);
      const alt = asText((block as { alt?: string }).alt);
      if (src && !isUiAsset(alt, src)) allImages.push({ src, alt });
    }

    if (block.type === "list_item") {
      const text = asText(block.text);
      if (text) listBuffer.push(text);
      return;
    }

    flushList(index);
    const rendered = renderBlock(block, `block-${index}`);
    if (rendered) items.push(rendered);
  });

  flushIngredients();
  flushList(blocks.length);

  // Gallery at the end — only when 2+ images found in content
  if (allImages.length >= 2) {
    items.push(<ArticleImageGallery key="gallery" images={allImages} title="Galerie" />);
  }

  return items;
}

export async function SnapshotContentPage({
  routePath,
  layout,
  routeType,
  notes = [],
  contextLinks = [],
  sanityIngredientTables
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
          {renderBlocks(visibleBlocks, sanityIngredientTables)}
        </article>

      </div>
    </section>
  );
}
