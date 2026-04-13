import { createImageUrlBuilder } from "@sanity/image-url";
import { env } from "@/lib/env";
import { sanityClient } from "@/lib/sanity/client";

const builder = createImageUrlBuilder(sanityClient);

export function urlForImage(source: unknown) {
  if (!env.sanityProjectId || !source) {
    return undefined;
  }

  try {
    return builder.image(source as any).auto("format").fit("max").url();
  } catch {
    return undefined;
  }
}
