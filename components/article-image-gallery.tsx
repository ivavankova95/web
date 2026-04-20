"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export type GalleryImage = {
  src: string;
  alt: string;
  ref?: string; // Sanity asset _ref — used for index lookup
};

type LightboxProps = {
  images: GalleryImage[];
  initialIndex: number;
  onClose: () => void;
};

function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const active = images[index];

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % images.length),
    [images.length]
  );

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  if (!active) return null;

  return (
    <div
      className="gallery-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Náhled fotografie"
      onClick={onClose}
    >
      <div className="gallery-lightbox__inner" onClick={(e) => e.stopPropagation()}>
        <button className="gallery-lightbox__close" onClick={onClose} aria-label="Zavřít">
          ✕
        </button>

        {images.length > 1 && (
          <button
            className="gallery-lightbox__arrow gallery-lightbox__arrow--prev"
            onClick={prev}
            aria-label="Předchozí"
          >
            ‹
          </button>
        )}

        <div className="gallery-lightbox__img-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={active.src} alt={active.alt} className="gallery-lightbox__img" />
        </div>

        {images.length > 1 && (
          <button
            className="gallery-lightbox__arrow gallery-lightbox__arrow--next"
            onClick={next}
            aria-label="Další"
          >
            ›
          </button>
        )}

        {active.alt && <p className="gallery-lightbox__caption">{active.alt}</p>}
        {images.length > 1 && (
          <p className="gallery-lightbox__counter">{index + 1} / {images.length}</p>
        )}
      </div>
    </div>
  );
}

/**
 * Wraps article content server-rendered by RSC. Listens for clicks on any
 * child element that has a `data-gallery-index` attribute and opens the
 * shared lightbox at that index.
 *
 * Usage in a server component:
 *   <ArticleGalleryWrapper images={galleryImages}>
 *     ... server-rendered content with <button data-gallery-index="2"> ...
 *   </ArticleGalleryWrapper>
 */
export function ArticleGalleryWrapper({
  images,
  children,
}: {
  images: GalleryImage[];
  children: React.ReactNode;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const target = (e.target as HTMLElement).closest(
      "[data-gallery-index]"
    ) as HTMLElement | null;
    if (!target) return;
    const idx = parseInt(target.dataset.galleryIndex ?? "", 10);
    if (!isNaN(idx) && idx >= 0 && idx < images.length) {
      setLightboxIndex(idx);
    }
  }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div onClick={handleClick}>
      {children}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}

/** Grid of small thumbnails with its own lightbox — rendered below article content. */
export function ArticleImageGallery({ images, title }: { images: GalleryImage[]; title?: string }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const close = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, close, prev, next]);

  if (!images.length) return null;

  const active = lightboxIndex !== null ? images[lightboxIndex] : null;

  return (
    <>
      <section className="article-gallery">
        {title && <h2 className="article-gallery__title">{title}</h2>}
        <div className="article-gallery__grid">
          {images.map((img, i) => (
            <button
              key={i}
              className="gallery-thumb"
              onClick={() => setLightboxIndex(i)}
              aria-label={`Zobrazit fotografii: ${img.alt || i + 1}`}
              type="button"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 600px) 45vw, (max-width: 900px) 30vw, 220px"
                style={{ objectFit: "cover" }}
                unoptimized={img.src.startsWith("http") && !img.src.includes("cdn.sanity.io")}
              />
            </button>
          ))}
        </div>
      </section>

      {active && (
        <Lightbox
          images={images}
          initialIndex={lightboxIndex!}
          onClose={close}
        />
      )}
    </>
  );
}
