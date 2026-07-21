import Image from "next/image";
import { cn } from "@/lib/utils";

// Renders a catalog image from an already-resolved URL (Sanity CDN or a local
// /products path), or a branded placeholder tile when missing.
export function SanityImg({
  url,
  alt,
  className,
  sizes,
  priority,
}: {
  url?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!url) {
    return (
      <div
        className={cn("flex items-center justify-center bg-asphalt-800 text-dust-500", className)}
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
      priority={priority}
      sizes={sizes ?? "(max-width: 768px) 100vw, 33vw"}
      className={cn("object-cover", className)}
    />
  );
}
