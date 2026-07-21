import type { AppLocale } from "@/i18n/routing";

// Static brand + contact facts. These are the phase-1 fallback and also seed
// `siteSettings` in Sanity. Source: current site123 landing page.
export const BRAND = {
  he: "דוד אופנועים",
  en: "David Motorcycles",
  ru: "Дэвид Мотоциклы",
} as const;

export const BRAND_LATIN = "Denimotoparts";

export function brandName(locale: AppLocale): string {
  return BRAND[locale] ?? BRAND.en;
}

export const CONTACT = {
  phone: "0547761717",
  phoneIntl: "+972547761717",
  whatsapp: "972547761717",
  email: "davidr6r1@gmail.com",
  facebook: "https://www.facebook.com/",
  hours: "11:00–20:00",
  locations: [
    { he: "מושיע 36, תל אביב", en: "Moshia 36, Tel Aviv", ru: "Мошия 36, Тель-Авив" },
    { he: "דרור 2, צור הדסה", en: "Dror 2, Tzur Hadassah", ru: "Дрор 2, Цур-Хадасса" },
  ],
} as const;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://david-motorcycle.example";
