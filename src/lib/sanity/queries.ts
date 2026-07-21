import { sanityClient } from "./client";
import type { LocalizedString } from "./locale";

export type SanityImage = { asset?: { _ref?: string }; alt?: LocalizedString };

export type Category = {
  _id: string;
  title: LocalizedString;
  slug: string;
  order?: number;
  image?: SanityImage;
};

export type Product = {
  _id: string;
  title: LocalizedString;
  slug: string;
  brand?: string;
  featured?: boolean;
  images?: SanityImage[];
  description?: LocalizedString;
  category?: { title: LocalizedString; slug: string };
};

const CATEGORY_FIELDS = `_id, title, "slug": slug.current, order, image`;
const PRODUCT_FIELDS = `
  _id, title, "slug": slug.current, brand, featured, images, description,
  category->{ title, "slug": slug.current }
`;

// All queries no-op to safe empties when Sanity is not yet configured, so the
// static build still renders the site shell.
async function run<T>(query: string, params: Record<string, unknown>, fallback: T): Promise<T> {
  if (!sanityClient) return fallback;
  try {
    return await sanityClient.fetch<T>(query, params);
  } catch {
    return fallback;
  }
}

export function getCategories() {
  return run<Category[]>(
    `*[_type == "category"] | order(order asc, title.he asc){ ${CATEGORY_FIELDS} }`,
    {},
    [],
  );
}

export function getProducts() {
  return run<Product[]>(
    `*[_type == "product" && active == true] | order(featured desc, title.he asc){ ${PRODUCT_FIELDS} }`,
    {},
    [],
  );
}

export function getFeaturedProducts() {
  return run<Product[]>(
    `*[_type == "product" && active == true && featured == true] | order(title.he asc)[0...8]{ ${PRODUCT_FIELDS} }`,
    {},
    [],
  );
}

export function getProductsByCategory(slug: string) {
  return run<Product[]>(
    `*[_type == "product" && active == true && category->slug.current == $slug] | order(title.he asc){ ${PRODUCT_FIELDS} }`,
    { slug },
    [],
  );
}

export function getProductBySlug(slug: string) {
  return run<Product | null>(
    `*[_type == "product" && slug.current == $slug][0]{ ${PRODUCT_FIELDS} }`,
    { slug },
    null,
  );
}

export function getCategoryBySlug(slug: string) {
  return run<Category | null>(
    `*[_type == "category" && slug.current == $slug][0]{ ${CATEGORY_FIELDS} }`,
    { slug },
    null,
  );
}

export function getAllProductSlugs() {
  return run<string[]>(`*[_type == "product" && defined(slug.current)].slug.current`, {}, []);
}

export function getAllCategorySlugs() {
  return run<string[]>(`*[_type == "category" && defined(slug.current)].slug.current`, {}, []);
}
