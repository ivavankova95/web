import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { urlForImage, urlForImageSized } from "@/lib/sanity/image";
import type { SanityBlogPost, SanityCategory } from "@/lib/sanity/loaders";

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
      }
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
                <span key={link.href} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  {i > 0 && <span style={{ color: "var(--color-border)" }}>›</span>}
                  <Link href={link.href} style={{ color: "var(--color-text-muted)" }}>{link.label}</Link>
                </span>
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

        {/* Body */}
        {post.content && post.content.length > 0 && (
          <div className="container--narrow">
            <div className="article-content">
              <PortableText
                components={portableTextComponents}
                value={post.content as Parameters<typeof PortableText>[0]["value"]}
              />
            </div>
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
