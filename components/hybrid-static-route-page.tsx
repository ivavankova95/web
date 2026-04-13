import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { PageBuilder } from "@/components/page-builder";
import { SnapshotContentPage } from "@/components/snapshot-content-page";
import {
  getSanityRouteDocument,
  type SanityPageDocument,
  type SanityRouteDocumentKind
} from "@/lib/sanity/loaders";
import { urlForImage } from "@/lib/sanity/image";

type HybridStaticRoutePageProps = {
  routePath: string;
  documentKind: SanityRouteDocumentKind;
  fallbackLayout: string;
  fallbackRouteType: string;
  fallbackNotes?: string[];
  contextLinks?: Array<{ href: string; label: string }>;
};

function buildPortableTextComponents(document: SanityPageDocument) {
  return {
    types: {
      image: ({ value }: { value: { asset?: unknown; alt?: string } }) => {
        const imageUrl = urlForImage(value);
        if (!imageUrl) {
          return null;
        }

        return (
          <figure className="snapshot-figure" style={{ margin: "0" }}>
            <Image
              alt={value.alt ?? document.title ?? ""}
              className="snapshot-image"
              height={900}
              src={imageUrl}
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
              width={1600}
            />
          </figure>
        );
      }
    }
  };
}

function renderSanityDocument({
  document,
  routePath,
  contextLinks
}: {
  document: SanityPageDocument;
  routePath: string;
  contextLinks?: Array<{ href: string; label: string }>;
}) {
  if (document.pageBuilder?.length) {
    return (
      <section className="page-section">
        <div className="container page-grid">
          {contextLinks?.length ? (
            <div className="surface-card stack" style={{ padding: "1.5rem" }}>
              <div className="taxonomy-pills">
                {contextLinks.map((link) => (
                  <a className="pill-link" href={link.href} key={link.href}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
          <PageBuilder
            blocks={document.pageBuilder}
            checkoutProductKey={document.productKey}
            pagePath={routePath}
            pageTitle={document.title}
          />
        </div>
      </section>
    );
  }

  if (document.content?.length) {
    return (
      <section className="page-section">
        <div className="container content-grid">
          <header className="surface-card stack" style={{ padding: "2rem" }}>
            {document.title ? <h1>{document.title}</h1> : null}
            {document.summary ? <p className="page-lead">{document.summary}</p> : null}
          </header>
          <div className="surface-card prose-content stack" style={{ padding: "2rem" }}>
            <PortableText
              components={buildPortableTextComponents(document)}
              value={document.content as Parameters<typeof PortableText>[0]["value"]}
            />
          </div>
        </div>
      </section>
    );
  }

  return null;
}

export async function HybridStaticRoutePage({
  routePath,
  documentKind,
  fallbackLayout,
  fallbackRouteType,
  fallbackNotes,
  contextLinks
}: HybridStaticRoutePageProps) {
  const slug = routePath.replace(/^\/+/, "");
  const document = await getSanityRouteDocument(documentKind, slug);
  const renderedSanityDocument = document
    ? renderSanityDocument({
        document,
        routePath,
        contextLinks
      })
    : null;

  if (renderedSanityDocument) {
    return renderedSanityDocument;
  }

  return (
    <SnapshotContentPage
      contextLinks={contextLinks}
      layout={fallbackLayout}
      notes={fallbackNotes}
      routePath={routePath}
      routeType={fallbackRouteType}
    />
  );
}
