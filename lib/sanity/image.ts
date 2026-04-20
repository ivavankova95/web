import { createImageUrlBuilder } from "@sanity/image-url";
import { env } from "@/lib/env";
import { sanityClient } from "@/lib/sanity/client";

const builder = createImageUrlBuilder(sanityClient);

/** Vrátí URL obrázku jako string (backward compat). */
export function urlForImage(source: unknown): string | undefined {
  if (!env.sanityProjectId || !source) {
    return undefined;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return builder.image(source as any).auto("format").fit("max").url();
  } catch {
    return undefined;
  }
}

/** Vrátí URL obrázku s danou šířkou, výškou a ořezem. */
export function urlForImageSized(
  source: unknown,
  width: number,
  height?: number,
  fit: "crop" | "max" | "fill" = "crop"
): string | undefined {
  if (!env.sanityProjectId || !source) {
    return undefined;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let b = builder.image(source as any).auto("format").fit(fit).width(width);
    if (height) b = b.height(height);
    return b.url();
  } catch {
    return undefined;
  }
}
