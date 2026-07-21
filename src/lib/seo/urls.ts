import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";

const BASE = SITE_URL.replace(/\/+$/, ""); // origin (+ base path), no trailing slash

// path = route WITHOUT locale prefix: "" | "products" | "products/foo".
export function localizedUrl(locale: string, path = ""): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return `${BASE}/${locale}${clean ? `/${clean}` : ""}/`; // trailingSlash:true
}

export const OG_LOCALE: Record<string, string> = { he: "he_IL", en: "en_US", ru: "ru_RU" };

// canonical + hreflang alternates (+ x-default → default locale) for a route.
export function alternatesFor(path: string, currentLocale: string) {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = localizedUrl(l, path);
  languages["x-default"] = localizedUrl(routing.defaultLocale, path);
  return { canonical: localizedUrl(currentLocale, path), languages };
}

export function ogLocale(locale: string) {
  return {
    locale: OG_LOCALE[locale],
    alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
  };
}

export const absUrl = (path = "") => `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
