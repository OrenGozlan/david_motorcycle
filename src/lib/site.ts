import type { AppLocale } from "@/i18n/routing";

// Static brand + contact facts. Phase-1 fallback and also seeds Sanity
// `siteSettings`. Single source of truth — JSON-LD, llms.txt, Footer, Contact
// all read from here so NAP never diverges. Source: current site123 page.
export const BRAND = {
  he: "דוד אופנועים",
  en: "David Motorcycles",
  ru: "Дэвид Мотоциклы",
} as const;

export const BRAND_LATIN = "Denimotoparts";

export function brandName(locale: AppLocale): string {
  return BRAND[locale] ?? BRAND.en;
}

export type Branch = {
  he: string;
  en: string;
  ru: string;
  city: string;
  lat: number;
  lng: number;
};

export const CONTACT = {
  phone: "0547761717",
  phoneIntl: "+972547761717",
  whatsapp: "972547761717",
  email: "davidr6r1@gmail.com",
  // Real Facebook page URL unknown — left empty so we don't emit a dead
  // sameAs / broken link. Fill when known.
  facebook: "",
  hours: "11:00–20:00",
  // Israel retail week; confirm Fri/Sat with David.
  openDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"] as const,
  opens: "11:00",
  closes: "20:00",
  locations: [
    { he: "מושיע 36, תל אביב", en: "Moshia 36, Tel Aviv", ru: "Мошия 36, Тель-Авив", city: "Tel Aviv", lat: 32.0853, lng: 34.7818 },
    { he: "דרור 2, צור הדסה", en: "Dror 2, Tzur Hadassah", ru: "Дрор 2, Цур-Хадасса", city: "Tzur Hadassah", lat: 31.7205, lng: 35.0942 },
  ] as Branch[],
} as const;

export function branchName(b: Branch, locale: AppLocale): string {
  return b[locale] ?? b.en;
}

// Full origin INCLUDING base path (so absolute URLs are correct on GH Pages).
// Set NEXT_PUBLIC_SITE_URL to the custom domain (root) once live.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://orengozlan.github.io/david_motorcycle";

// GH Pages project sub-path. next/image + next/link auto-prefix it, but raw
// <video>/<a>/asset URLs do not — use asset() for those.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const asset = (p: string) => `${BASE_PATH}${p}`;
