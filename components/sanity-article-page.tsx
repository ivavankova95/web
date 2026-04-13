import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { urlForImage } from "@/lib/sanity/image";
import type { SanityBlogPost, SanityCategory } from "@/lib/sanity/loaders";

type SanityArticlePageProps = {
  post: SanityBlogPost;
  contextLinks?: Array<{ href: string; label: string }>;
};

export function SanityArticlePage({ post, contextLinks }: SanityArticlePageProps) {
  const imageUrl = urlForImage(post.mainImage);
  const portableTextComponents = {
    types: {
      image: ({ value }: { value: { asset?: unknown; alt?: string } }) => {
        const blockImageUrl = urlForImage(value);
        if (!blockImageUrl) {
          return null;
        }

        return (
          <figure className="snapshot-figure" style={{ margin: "0" }}>
            <Image
              alt={value.alt ?? post.title ?? ""}
              className="snapshot-image"
              height={900}
              src={blockImageUrl}
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
              width={1600}
            />
          </figure>
        );
      }
    }
  };

  return (
    <article className="page-section">
      <div className="container content-grid">
        {contextLinks && contextLinks.length > 0 && (
          <nav className="breadcrumb-nav" style={{ marginBottom: "1rem" }}>
            {contextLinks.map((link, index) => (
              <span key={link.href}>
                {index > 0 && <span style={{ margin: "0 0.4rem" }}>›</span>}
                <Link href={link.href}>{link.label}</Link>
              </span>
            ))}
          </nav>
        )}

        <header className="surface-card stack" style={{ padding: "2rem" }}>
          {post.title && <h1>{post.title}</h1>}
          {post.excerpt && <p className="page-lead">{post.excerpt}</p>}
          {post.categories && post.categories.length > 0 && (
            <div className="taxonomy-pills">
              {post.categories.map((cat: SanityCategory) =>
                cat.slug?.current ? (
                  <Link
                    className="pill-link"
                    href={`/kategorie/${cat.slug.current}`}
                    key={cat._id ?? cat.slug.current}
                  >
                    {cat.title}
                  </Link>
                ) : null
              )}
            </div>
          )}
        </header>

        {imageUrl && (
          <figure className="snapshot-figure" style={{ margin: "0" }}>
            <Image
              alt={post.mainImage?.alt ?? post.title ?? ""}
              className="snapshot-image"
              height={600}
              priority
              src={imageUrl}
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
              width={1200}
            />
          </figure>
        )}

        {post.content && post.content.length > 0 && (
          <div className="surface-card prose-content stack" style={{ padding: "2rem" }}>
            <PortableText
              components={portableTextComponents}
              value={post.content as Parameters<typeof PortableText>[0]["value"]}
            />
          </div>
        )}
      </div>
    </article>
  );
}
