import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { urlForImageSized } from "@/lib/sanity/image";
import type { SanityBlogPost, SanityCategory, SanityIngredientTable } from "@/lib/sanity/loaders";
import { ArticleImageGallery, type GalleryImage } from "@/components/article-image-gallery";

// Each table gets its own card; side-by-side on desktop via .ingredient-tables-grid.
function IngredientTables({ tables }: { tables: SanityIngredientTable[] }) {
  return (
    <div className="ingredient-tables-grid">
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

// Split Portable Text blocks for ingredient table placement.
// Primary: split at "Ingredience"/"Suroviny" heading (drops the raw ingredient paragraphs).
// Fallback: split at "Jak na to"/"Jak na to?" heading so tables appear before the instructions.
const INGREDIENT_HEADING_RE = /^(ingredience|suroviny)$/i;
const INSTRUCTIONS_HEADING_RE = /^jak na to\??$/i;

type PtBlock = { _type: string; style?: string; children?: Array<{ text?: string }> };
type PtImageBlock = { _type: "image"; asset?: unknown; alt?: string };
type PtMigrationImageBlock = { _type: "migrationImage"; sourceUrl?: string; alt?: string };

function splitContentAtIngredience(content: readonly unknown[]): {
  before: unknown[];
  after: unknown[];
  hasIngredience: boolean;
} {
  const blocks = content as PtBlock[];

  const headingIdx = (re: RegExp) => {
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      if (b._type === "block" && b.style && /^h[1-6]$/.test(b.style)) {
        const text = (b.children ?? []).map((c) => c.text ?? "").join("").trim();
        if (re.test(text)) return i;
      }
    }
    return -1;
  };

  const ingredienceIdx = headingIdx(INGREDIENT_HEADING_RE);

  if (ingredienceIdx !== -1) {
    // Primary split: at "Ingredience"/"Suroviny" — drop raw ingredient paragraphs
    let afterIdx = blocks.length;
    for (let i = ingredienceIdx + 1; i < blocks.length; i++) {
      const b = blocks[i];
      if (b._type === "block" && b.style && /^h[1-6]$/.test(b.style)) {
        afterIdx = i;
        break;
      }
    }
    return {
      before: blocks.slice(0, ingredienceIdx),
      after: blocks.slice(afterIdx),
      hasIngredience: true,
    };
  }

  // Fallback split: at "Jak na to?" — tables appear just before the instructions
  const instructionsIdx = headingIdx(INSTRUCTIONS_HEADING_RE);
  if (instructionsIdx !== -1) {
    return {
      before: blocks.slice(0, instructionsIdx),
      after: blocks.slice(instructionsIdx),
      hasIngredience: true,
    };
  }

  return { before: [...content], after: [], hasIngredience: false };
}


function extractGalleryImages(blocks: readonly unknown[], postTitle?: string): GalleryImage[] {
  const images: GalleryImage[] = [];
  const seenRefs = new Set<string>();

  for (const block of blocks) {
    const b = block as PtImageBlock | PtMigrationImageBlock;
    if (b._type === "image") {
      const ref = (b.asset as { _ref?: string } | undefined)?._ref;
      if (ref) {
        if (seenRefs.has(ref)) continue;
        seenRefs.add(ref);
      }
      const url = urlForImageSized(b, 1200, 900);
      if (url) images.push({ src: url, alt: b.alt ?? postTitle ?? "", ref });
    } else if (b._type === "migrationImage" && b.sourceUrl) {
      if (seenRefs.has(b.sourceUrl)) continue;
      seenRefs.add(b.sourceUrl);
      images.push({ src: b.sourceUrl, alt: b.alt ?? postTitle ?? "", ref: b.sourceUrl });
    }
  }
  return images;
}

const CAT_COLORS: Record<string, { text: string; bg: string }> = {
  "ze-zivota": { text: "#5d2a94", bg: "hsla(268,56%,37%,0.14)" },
  slane: { text: "hsla(91,26%,38%,1)", bg: "hsla(91,30%,56%,0.14)" },
  sladke: { text: "hsla(340,56%,40%,1)", bg: "hsla(340,72%,57%,0.14)" },
  "cum-ea": { text: "hsla(201,77%,40%,1)", bg: "hsla(201,69%,61%,0.14)" },
  vareni: { text: "hsla(42,47%,44%,1)", bg: "hsla(42,69%,72%,0.14)" },
  peceni: { text: "hsla(34,44%,19%,1)", bg: "hsla(34,37%,35%,0.14)" }
};

type SanityArticlePageProps = {
  post: SanityBlogPost;
  contextLinks?: Array<{ href: string; label: string }>;
};

export function SanityArticlePage({ post, contextLinks }: SanityArticlePageProps) {
  const imageUrl = post.mainImage ? urlForImageSized(post.mainImage, 1200, 675, "crop") ?? null : null;

  const mainContent = post.content ? [...post.content] : [];
  const galleryImages = extractGalleryImages(mainContent, post.title);

  const portableTextComponents = {
    types: {
      image: ({ value }: { value: { asset?: unknown; alt?: string } }) => {
        const blockImageUrl = urlForImageSized(value, 900);
        if (!blockImageUrl) return null;
        return (
          <figure style={{ margin: "1rem 0" }}>
            <Image
              alt={value.alt ?? post.title ?? ""}
              src={blockImageUrl}
              width={900}
              height={600}
              style={{ width: "100%", height: "auto", borderRadius: "14px", display: "block" }}
            />
          </figure>
        );
      },
      migrationImage: ({ value }: { value: { sourceUrl?: string; alt?: string } }) => {
        if (!value.sourceUrl) return null;
        return (
          <figure style={{ margin: "1rem 0" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value.sourceUrl}
              alt={value.alt ?? post.title ?? ""}
              style={{ width: "100%", height: "auto", borderRadius: "14px", display: "block" }}
            />
          </figure>
        );
      },
    }
  };

  const publishedLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <>
      <article>
        {/* Hero */}
        <div className="article-hero">
          <div className="container--narrow">
            <div className="article-hero__eyebrow">
              {contextLinks && contextLinks.map((link, i) => (
                i === 0 ? (
                  <Link key={link.href} href={link.href} className="btn btn-outline" style={{ display: "inline-flex", padding: "0.4rem 1rem", fontSize: "0.78rem" }}>
                    ← {link.label}
                  </Link>
                ) : (
                  <span key={link.href} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span style={{ color: "var(--color-border)" }}>›</span>
                    <Link href={link.href} style={{ color: "var(--color-text-muted)" }}>{link.label}</Link>
                  </span>
                )
              ))}
              {publishedLabel && (
                <>
                  {contextLinks && contextLinks.length > 0 && <span style={{ color: "var(--color-border)" }}>·</span>}
                  <span>{publishedLabel}</span>
                </>
              )}
            </div>

            <h1 className="article-hero__title">{post.title}</h1>

            {post.excerpt && (
              <p className="article-hero__lead">{post.excerpt}</p>
            )}

            {post.categories && post.categories.length > 0 && (
              <div className="article-card__cats" style={{ marginTop: "1rem" }}>
                {post.categories.map((cat: SanityCategory) => {
                  const slug = cat.slug?.current ?? "";
                  const colors = CAT_COLORS[slug] ?? { text: "var(--color-brand)", bg: "rgba(168,65,99,0.1)" };
                  return slug ? (
                    <Link
                      key={cat._id ?? slug}
                      href={`/kategorie/${slug}`}
                      className="cat-chip"
                      style={{ color: colors.text, borderColor: colors.text, background: colors.bg }}
                    >
                      {cat.title}
                    </Link>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>

        {/* Cover image */}
        {imageUrl && (
          <div className="container--narrow">
            <Image
              src={imageUrl}
              alt={post.mainImage?.alt ?? post.title ?? ""}
              width={1200}
              height={675}
              priority
              className="article-cover"
            />
          </div>
        )}

        {/* Body — uses mainContent (content before "Galerie" heading) */}
        {mainContent.length > 0 && (() => {
          const hasTables = post.ingredientTables && post.ingredientTables.length > 0;
          const { before, after, hasIngredience } = hasTables
            ? splitContentAtIngredience(mainContent)
            : { before: [...mainContent], after: [], hasIngredience: false };

          return (
            <>
              {/* Content before Ingredience */}
              {before.length > 0 && (
                <div className="container--narrow">
                  <div className="article-content">
                    <PortableText
                      components={portableTextComponents}
                      value={before as Parameters<typeof PortableText>[0]["value"]}
                    />
                  </div>
                </div>
              )}

              {/* Ingredient tables — inserted at Ingredience heading or before "Jak na to" */}
              {hasTables && hasIngredience && (
                <div className="container--narrow">
                  <IngredientTables tables={post.ingredientTables!} />
                </div>
              )}

              {/* Content after Ingredience (from the next heading onwards) */}
              {after.length > 0 && (
                <div className="container--narrow">
                  <div className="article-content">
                    <PortableText
                      components={portableTextComponents}
                      value={after as Parameters<typeof PortableText>[0]["value"]}
                    />
                  </div>
                </div>
              )}
            </>
          );
        })()}

        {/* Gallery section — all images from article content rendered as thumbnails */}
        {galleryImages.length >= 2 && (
          <div className="container--narrow">
            <ArticleImageGallery images={galleryImages} title="Galerie" />
          </div>
        )}

        {/* Back to blog */}
        <div className="container--narrow" style={{ padding: "3rem 0" }}>
          <Link href="/blog" className="btn btn-outline" style={{ display: "inline-flex" }}>
            ← Zpět na blog
          </Link>
        </div>
      </article>
    </>
  );
}
