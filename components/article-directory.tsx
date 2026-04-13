import Link from "next/link";
import type { SnapshotArticleSummary, SnapshotCategorySummary } from "@/lib/content/snapshot";

const CAT_COLORS: Record<string, { text: string; bg: string }> = {
  "ze-zivota": { text: "#5d2a94", bg: "hsla(268,56%,37%,0.14)" },
  slane: { text: "hsla(91,26%,38%,1)", bg: "hsla(91,30%,56%,0.14)" },
  sladke: { text: "hsla(340,56%,40%,1)", bg: "hsla(340,72%,57%,0.14)" },
  "cum-ea": { text: "hsla(201,77%,40%,1)", bg: "hsla(201,69%,61%,0.14)" },
  vareni: { text: "hsla(42,47%,44%,1)", bg: "hsla(42,69%,72%,0.14)" },
  peceni: { text: "hsla(34,44%,19%,1)", bg: "hsla(34,37%,35%,0.14)" }
};

const CAT_PILL_COLORS: Record<string, { text: string; bg: string }> = {
  "ze-zivota": { text: "#5d2a94", bg: "hsla(268,56%,37%,0.6)" },
  slane: { text: "hsla(91,26%,38%,1)", bg: "hsla(91,30%,56%,0.6)" },
  sladke: { text: "hsla(340,56%,40%,1)", bg: "hsla(340,72%,57%,0.6)" },
  "cum-ea": { text: "hsla(201,77%,40%,1)", bg: "hsla(201,69%,61%,0.6)" },
  vareni: { text: "hsla(42,47%,44%,1)", bg: "hsla(42,69%,72%,0.6)" },
  peceni: { text: "hsla(34,44%,19%,1)", bg: "hsla(34,37%,35%,0.6)" }
};

type ArticleDirectoryProps = {
  title: string;
  description: string;
  eyebrow: string;
  articles: SnapshotArticleSummary[];
  categories: SnapshotCategorySummary[];
  activeCategorySlug?: string;
};

export function ArticleDirectory({
  title,
  description,
  eyebrow,
  articles,
  categories,
  activeCategorySlug
}: ArticleDirectoryProps) {
  const categoryTitleBySlug = new Map(categories.map((c) => [c.slug, c.title]));

  return (
    <div>
      {/* Page header */}
      <div className="blog-header">
        <div className="container">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="section-title" style={{ marginTop: "0.5rem" }}>{title}</h1>
          {description && <p className="blog-header__desc">{description}</p>}
        </div>
      </div>

      <div className="container" style={{ paddingBottom: "5rem" }}>
        {/* Category chips strip */}
        {categories.length > 0 && (
          <div className="cats-strip">
            <Link
              href="/blog"
              className="cat-pill"
              style={
                !activeCategorySlug
                  ? { background: "var(--color-brand)", color: "var(--color-white)" }
                  : { background: "var(--color-white)", color: "var(--color-text)", border: "1.5px solid var(--color-border)" }
              }
            >
              Vše
            </Link>
            {categories.map((cat) => {
              const active = activeCategorySlug === cat.slug;
              const colors = CAT_PILL_COLORS[cat.slug] ?? { text: "var(--color-brand)", bg: "hsla(340,56%,40%,0.6)" };
              return (
                <Link
                  key={cat.slug}
                  href={cat.href}
                  className="cat-pill"
                  style={
                    active
                      ? { background: colors.bg, color: colors.text, fontWeight: 800 }
                      : { background: "var(--color-white)", color: "var(--color-text)", border: "1.5px solid var(--color-border)" }
                  }
                >
                  {cat.title}
                </Link>
              );
            })}
          </div>
        )}

        {/* Article grid */}
        <div className="article-grid">
          {articles.map((article) => (
            <article className="article-card" key={article.slug}>
              {article.imageUrl && (
                <Link href={article.href} className="article-card__image-link">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.imageUrl}
                    alt={article.imageAlt ?? article.title}
                    loading="lazy"
                    style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }}
                  />
                </Link>
              )}
              <div className="article-card__body">
                <Link href={article.href}>
                  <h2 className="article-card__title">{article.title}</h2>
                </Link>
                {article.description && (
                  <p className="article-card__excerpt">{article.description}</p>
                )}
                {article.categorySlugs.length > 0 && (
                  <div className="article-card__cats">
                    {article.categorySlugs.map((slug) => {
                      const colors = CAT_COLORS[slug] ?? { text: "var(--color-brand)", bg: "rgba(168,65,99,0.1)" };
                      return (
                        <Link
                          key={slug}
                          href={`/kategorie/${slug}`}
                          className="cat-chip"
                          style={{ color: colors.text, borderColor: colors.text, background: colors.bg }}
                        >
                          {categoryTitleBySlug.get(slug) ?? slug}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        .blog-header {
          background: var(--color-surface-alt);
          padding: 3.5rem 0 2.5rem;
          margin-bottom: 2.5rem;
        }
        .blog-header__desc {
          margin-top: 0.75rem;
          color: var(--color-text-muted);
          max-width: 55ch;
          line-height: 1.7;
          font-size: 0.95rem;
        }
      `}</style>
    </div>
  );
}
