import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getAllProductSlugs, getAllCategorySlugs } from "@/lib/sanity/queries";
import { localizedUrl } from "@/lib/seo/urls";

export const dynamic = "force-static";

// Emitted to out/sitemap.xml at build. One row per route with per-locale
// xhtml:link alternates (he/en/ru). Submit it manually in Search Console while
// on the Pages sub-path (robots.txt discovery only works at a domain root).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    getAllProductSlugs(),
    getAllCategorySlugs(),
  ]);
  const paths = [
    "",
    "products",
    "about",
    "contact",
    "faq",
    ...categories.filter((s) => s !== "_").map((s) => `categories/${s}`),
    ...products.filter((s) => s !== "_").map((s) => `products/${s}`),
  ];

  return paths.map((path) => ({
    url: localizedUrl(routing.defaultLocale, path),
    changeFrequency: path.startsWith("products/") ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, localizedUrl(l, path)])),
    },
  }));
}
