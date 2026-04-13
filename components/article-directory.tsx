import Link from "next/link";
import type { SnapshotArticleSummary, SnapshotCategorySummary } from "@/lib/content/snapshot";

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
  const categoryTitleBySlug = new Map(categories.map((category) => [category.slug, category.title]));

  return (
    <section className="page-section">
      <div className="container page-grid">
        <div className="surface-card stack" style={{ padding: "2rem" }}>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="page-lead">{description}</p>
        </div>

        <section className="surface-card stack" style={{ padding: "1.5rem" }}>
          <div className="taxonomy-pills">
            <Link
              className={activeCategorySlug ? "pill-link" : "pill-link pill-link-active"}
              href="/blog"
            >
              Všechny články
            </Link>
            {categories.map((category) => (
              <Link
                className={activeCategorySlug === category.slug ? "pill-link pill-link-active" : "pill-link"}
                href={category.href}
                key={category.slug}
              >
                {category.title}
                <span className="pill-count">{category.articleCount}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="article-directory-grid">
          {articles.map((article) => (
            <article className="surface-card article-card" key={article.slug}>
              {article.imageUrl ? (
                <Link className="article-card-media" href={article.href}>
                  <img alt={article.imageAlt || article.title} src={article.imageUrl} />
                </Link>
              ) : null}
              <div className="article-card-body">
                {article.categorySlugs.length ? (
                  <div className="taxonomy-pills">
                    {article.categorySlugs.map((categorySlug) => (
                      <Link className="pill-link" href={`/kategorie/${categorySlug}`} key={categorySlug}>
                        {categoryTitleBySlug.get(categorySlug) ?? categorySlug}
                      </Link>
                    ))}
                  </div>
                ) : null}
                <h2>
                  <Link href={article.href}>{article.title}</Link>
                </h2>
                <p className="muted">{article.description}</p>
                <Link className="button-secondary" href={article.href}>
                  Přečíst článek
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </section>
  );
}
