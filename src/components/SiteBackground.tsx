import { asset } from "@/lib/site";

// Full-page motorcycle splash backdrop (outback ride). Fixed behind all
// content with a cream wash so cards + text stay readable. Decorative.
// Uses a fixed div (not background-attachment:fixed) to avoid iOS jank.
export function SiteBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${asset("/bg/road.jpg")})` }}
      />
      {/* cream legibility wash + subtle warm vignette */}
      <div className="absolute inset-0 bg-asphalt-950/[0.88]" />
      <div className="absolute inset-0 bg-gradient-to-b from-asphalt-950/60 via-transparent to-asphalt-950/80" />
    </div>
  );
}
