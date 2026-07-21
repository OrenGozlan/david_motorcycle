import type { MetadataRoute } from "next";
import { SITE_URL, asset } from "@/lib/site";

export const dynamic = "force-static";

const base = SITE_URL.replace(/\/+$/, "");

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "David Motorcycles — Denimotoparts",
    short_name: "Denimotoparts",
    description: "Adventure-riding gear & parts for motorcycles and scooters.",
    start_url: `${base}/he/`,
    display: "standalone",
    background_color: "#fbf6ec",
    theme_color: "#f2751c",
    icons: [{ src: asset("/icon.svg"), sizes: "any", type: "image/svg+xml" }],
  };
}
