import Image from "next/image";
import type { SanityImage } from "@/lib/sanity/queries";
import { urlForImage } from "@/lib/sanity/image";
import { cn } from "@/lib/utils";

// Renders a Sanity image, or a branded placeholder tile when missing/unconfigured.
export function SanityImg({
  image,
  alt,
  className,
  sizes,
}: {
  image?: SanityImage | null;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  const url = urlForImage(image ?? undefined);
  if (!url) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-asphalt-800 text-dust-500",
          className,
        )}
        aria-hidden
      >
        <span className="font-display text-xs uppercase tracking-[0.3em]">Denimotoparts</span>
      </div>
    );
  }
  return (
    <Image
      src={url}
      alt={alt}
      fill
      sizes={sizes ?? "(max-width: 768px) 100vw, 33vw"}
      className={cn("object-cover", className)}
    />
  );
}
