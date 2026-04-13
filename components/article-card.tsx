import Image from "next/image";
import Link from "next/link";
import { urlForImageSized } from "@/lib/sanity/image";

// Barvy kategorií odpovídají původnímu Webflow designu
const CAT_COLORS: Record<string, { text: string; bg: string }> = {
  "ze-zivota": { text: "#5d2a94", bg: "hsla(268,56%,37%,0.18)" },
  slane: { text: "hsla(91,26%,38%,1)", bg: "hsla(91,30%,56%,0.18)" },
  sladke: { text: "hsla(340,56%,40%,1)", bg: "hsla(340,72%,57%,0.18)" },
  "cum-ea": { text: "hsla(201,77%,40%,1)", bg: "hsla(201,69%,61%,0.18)" },
  vareni: { text: "hsla(42,47%,44%,1)", bg: "hsla(42,69%,72%,0.18)" },
  peceni: { text: "hsla(34,44%,19%,1)", bg: "hsla(34,37%,35%,0.18)" }
};

type Category = { title: string; slug: string };

type ArticleCardProps = {
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  mainImage?: { asset?: { _ref?: string }; url?: string; alt?: string };
  categories?: Category[];
};

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export function ArticleCard({ title, slug, excerpt, publishedAt, mainImage, categories }: ArticleCardProps) {
  const href = `/clanky/${slug}`;

  let imgUrl: string | null = null;
  if (mainImage?.url) {
    imgUrl = mainImage.url;
  } else if (mainImage?.asset?._ref) {
    imgUrl = urlForImageSized(mainImage, 600, 450, "crop") ?? null;
  }

  return (
    <article className="article-card">
      <Link href={href} className="article-card__image-link">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={mainImage?.alt ?? title}
            width={600}
            height={450}
            style={{ width: "100%", height: "auto" }}
          />
        ) : (
          <div style={{ aspectRatio: "4/3", background: "var(--color-surface-alt)" }} />
        )}
      </Link>

      <div className="article-card__body">
        {publishedAt && (
          <div className="article-card__date">{formatDate(publishedAt)}</div>
        )}

        <Link href={href}>
          <h2 className="article-card__title">{title}</h2>
        </Link>

        {excerpt && <p className="article-card__excerpt">{excerpt}</p>}

        {categories && categories.length > 0 && (
          <div className="article-card__cats">
            {categories.map((cat) => {
              const colors = CAT_COLORS[cat.slug] ?? { text: "var(--color-brand)", bg: "rgba(168,65,99,0.12)" };
              return (
                <Link
                  key={cat.slug}
                  href={`/kategorie/${cat.slug}`}
                  className="cat-chip"
                  style={{ color: colors.text, borderColor: colors.text, background: colors.bg }}
                >
                  {cat.title}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}
