import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { projectId, dataset, sanityConfigured } from "./client";

const builder = sanityConfigured ? imageUrlBuilder({ projectId, dataset }) : null;

export function urlForImage(source: SanityImageSource | undefined | null): string | null {
  if (!builder || !source) return null;
  try {
    return builder.image(source).auto("format").fit("max").url();
  } catch {
    return null;
  }
}
