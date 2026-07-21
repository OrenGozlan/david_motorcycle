/**
 * Seed / bootstrap the Sanity catalog.
 *
 *   pnpm seed
 *
 * Requires (local .env / .env.local):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN
 *
 * Creates the category structure (from the current site123 landing page) and,
 * if scripts/catalog-input.json exists, upserts products from it (bootstrapped
 * from site123 + Facebook). Images referenced by URL are uploaded to Sanity.
 * he is filled; en/ru left for a later `pnpm translate` pass. Idempotent:
 * deterministic _id per slug, so re-running updates rather than duplicates.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-10-01",
  token,
  useCdn: false,
});

type L = { he?: string; en?: string; ru?: string };
type ProductInput = {
  slug: string;
  title: L;
  category: string; // category slug
  brand?: string;
  description?: L;
  featured?: boolean;
  images?: string[]; // URLs to upload
};

// Categories mirrored from the current site123 landing page.
const CATEGORIES: { slug: string; title: L; order: number }[] = [
  { slug: "helmets", title: { he: "קסדות", en: "Helmets", ru: "Шлемы" }, order: 1 },
  { slug: "jackets", title: { he: "מעילים", en: "Jackets", ru: "Куртки" }, order: 2 },
  { slug: "gloves", title: { he: "כפפות", en: "Gloves", ru: "Перчатки" }, order: 3 },
  { slug: "protective-gear", title: { he: "מגני גוף", en: "Protective gear", ru: "Защита" }, order: 4 },
  { slug: "locks-security", title: { he: "מנעולים ואבטחה", en: "Locks & security", ru: "Замки и защита" }, order: 5 },
  { slug: "boxes", title: { he: "ארגזים", en: "Storage boxes", ru: "Кофры" }, order: 6 },
  { slug: "intercoms", title: { he: "אינטרקום ותקשורת", en: "Intercoms", ru: "Интеркомы" }, order: 7 },
  { slug: "covers", title: { he: "כיסויים", en: "Covers", ru: "Чехлы" }, order: 8 },
  { slug: "chains-accessories", title: { he: "שרשראות ואביזרים", en: "Chains & accessories", ru: "Цепи и аксессуары" }, order: 9 },
];

const catId = (slug: string) => `category-${slug}`;
const prodId = (slug: string) => `product-${slug}`;

async function uploadImage(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${url} → ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const asset = await client.assets.upload("image", buf, { filename: url.split("/").pop() });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

async function seedCategories() {
  const tx = client.transaction();
  for (const c of CATEGORIES) {
    tx.createOrReplace({
      _id: catId(c.slug),
      _type: "category",
      title: c.title,
      slug: { _type: "slug", current: c.slug },
      order: c.order,
    });
  }
  await tx.commit();
  console.log(`✓ ${CATEGORIES.length} categories`);
}

async function seedProducts() {
  const file = resolve(process.cwd(), "scripts/catalog-input.json");
  if (!existsSync(file)) {
    console.log("• no scripts/catalog-input.json — skipping products (categories only).");
    return;
  }
  const products: ProductInput[] = JSON.parse(readFileSync(file, "utf8"));
  for (const p of products) {
    const images = [];
    for (const url of p.images ?? []) {
      try {
        images.push(await uploadImage(url));
      } catch (e) {
        console.warn(`  ! image failed (${url}): ${(e as Error).message}`);
      }
    }
    await client.createOrReplace({
      _id: prodId(p.slug),
      _type: "product",
      title: p.title,
      slug: { _type: "slug", current: p.slug },
      category: { _type: "reference", _ref: catId(p.category) },
      brand: p.brand,
      description: p.description,
      featured: p.featured ?? false,
      active: true,
      ...(images.length ? { images } : {}),
    });
    console.log(`  ✓ product ${p.slug}`);
  }
  console.log(`✓ ${products.length} products`);
}

async function main() {
  console.log(`Seeding ${projectId}/${dataset} …`);
  await seedCategories();
  await seedProducts();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
