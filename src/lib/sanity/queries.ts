import { sanityClient } from "./client";
import type { LocalizedString } from "./locale";

// Normalized catalog types used across the app. Image URLs are already resolved
// (Sanity asset URL, or a local /products path from the static fallback), so
// components never touch the Sanity image builder.
export type Category = {
  _id: string;
  title: LocalizedString;
  slug: string;
  order?: number;
  imageUrl?: string | null;
};

export type Product = {
  _id: string;
  title: LocalizedString;
  slug: string;
  brand?: string;
  featured?: boolean;
  imageUrls: string[];
  description?: LocalizedString;
  category?: { title: LocalizedString; slug: string };
};

const CATEGORY_FIELDS = `_id, title, "slug": slug.current, order, "imageUrl": image.asset->url`;
const PRODUCT_FIELDS = `
  _id, title, "slug": slug.current, brand, featured, description,
  "imageUrls": images[].asset->url,
  category->{ title, "slug": slug.current }
`;

// When Sanity is not configured, serve the static catalog scraped from the old
// site so the store renders on the review build. Sanity wins once configured.
async function fromSanity<T>(query: string, params: Record<string, unknown>): Promise<T | null> {
  if (!sanityClient) return null;
  try {
    return await sanityClient.fetch<T>(query, params);
  } catch {
    return null;
  }
}

async function staticCatalog() {
  const { STATIC_CATEGORIES, STATIC_PRODUCTS } = await import("@/content/catalog");
  return { STATIC_CATEGORIES, STATIC_PRODUCTS };
}

export async function getCategories(): Promise<Category[]> {
  const s = await fromSanity<Category[]>(
    `*[_type == "category"] | order(order asc, title.he asc){ ${CATEGORY_FIELDS} }`,
    {},
  );
  if (s && s.length) return s;
  return (await staticCatalog()).STATIC_CATEGORIES;
}

export async function getProducts(): Promise<Product[]> {
  const s = await fromSanity<Product[]>(
    `*[_type == "product" && active == true] | order(featured desc, title.he asc){ ${PRODUCT_FIELDS} }`,
    {},
  );
  if (s && s.length) return s;
  return (await staticCatalog()).STATIC_PRODUCTS;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const s = await fromSanity<Product[]>(
    `*[_type == "product" && active == true && featured == true] | order(title.he asc)[0...8]{ ${PRODUCT_FIELDS} }`,
    {},
  );
  if (s && s.length) return s;
  return (await staticCatalog()).STATIC_PRODUCTS.filter((p) => p.featured).slice(0, 8);
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const s = await fromSanity<Product[]>(
    `*[_type == "product" && active == true && category->slug.current == $slug] | order(title.he asc){ ${PRODUCT_FIELDS} }`,
    { slug },
  );
  if (s && s.length) return s;
  return (await staticCatalog()).STATIC_PRODUCTS.filter((p) => p.category?.slug === slug);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const s = await fromSanity<Product | null>(
    `*[_type == "product" && slug.current == $slug][0]{ ${PRODUCT_FIELDS} }`,
    { slug },
  );
  if (s) return s;
  return (await staticCatalog()).STATIC_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const s = await fromSanity<Category | null>(
    `*[_type == "category" && slug.current == $slug][0]{ ${CATEGORY_FIELDS} }`,
    { slug },
  );
  if (s) return s;
  return (await staticCatalog()).STATIC_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export async function getAllProductSlugs(): Promise<string[]> {
  const s = await fromSanity<string[]>(
    `*[_type == "product" && defined(slug.current)].slug.current`,
    {},
  );
  if (s && s.length) return s;
  return (await staticCatalog()).STATIC_PRODUCTS.map((p) => p.slug);
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const s = await fromSanity<string[]>(
    `*[_type == "category" && defined(slug.current)].slug.current`,
    {},
  );
  if (s && s.length) return s;
  return (await staticCatalog()).STATIC_CATEGORIES.map((c) => c.slug);
}
