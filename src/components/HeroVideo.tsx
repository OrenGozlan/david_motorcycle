import { asset } from "@/lib/site";

// Full-bleed background video for the hero. Drop a self-hosted clip at
// public/hero/ride.mp4 (+ optional public/hero/poster.jpg). Until then the
// warm road-trip gradient below shows — the page still looks complete.
// Autoplay requires muted + playsInline (mobile). Video is decorative →
// aria-hidden; the hero's real heading lives in the overlay children.
export function HeroVideo({ children }: { children: React.ReactNode }) {
  const src = asset("/hero/ride.mp4");
  const poster = asset("/hero/poster.jpg");

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      {/* road-trip gradient base (fallback + tint) */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-route-600 via-ember-600 to-ember-700"
        aria-hidden
      />
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        aria-hidden
      >
        <source src={src} type="video/mp4" />
      </video>
      {/* legibility scrim */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/45"
        aria-hidden
      />
      <div className="container-page relative py-28 md:py-40">{children}</div>
    </section>
  );
}
