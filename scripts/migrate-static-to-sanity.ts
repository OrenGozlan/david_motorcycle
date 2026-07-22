/**
 * One-off migration: push the static phase-1 catalog (src/content/catalog.ts)
 * into Sanity so David edits the REAL products in the Studio.
 *
 *   pnpm migrate
 *
 * Requires (local .env.local): NEXT_PUBLIC_SANITY_PROJECT_ID,
 * NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN.
 *
 * - Categories + products keyed by deterministic _id (category-<slug> /
 *   product-<slug>) → re-running updates in place, no duplicates.
 * - Images are local files under public/ (e.g. /products/p01.jpg); each is
 *   uploaded once and cached by path so shared images aren't re-uploaded.
 * - he is the source; en/ru filled only where the static data already has them.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@sanity/client";
import { STATIC_CATEGORIES, STATIC_PRODUCTS } from "../src/content/catalog";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-10-01", token, useCdn: false });

const catId = (slug: string) => `category-${slug}`;
const prodId = (slug: string) => `product-${slug}`;

// Upload a local public/ asset once; cache the Sanity image ref by path.
const imageCache = new Map<string, { _type: "image"; asset: { _type: "reference"; _ref: string } }>();
async function uploadLocal(publicPath: string) {
  const cached = imageCache.get(publicPath);
  if (cached) return cached;
  const abs = resolve(process.cwd(), "public", publicPath.replace(/^\//, ""));
  const buf = readFileSync(abs);
  const asset = await client.assets.upload("image", buf, { filename: publicPath.split("/").pop() });
  const ref = { _type: "image" as const, asset: { _type: "reference" as const, _ref: asset._id } };
  imageCache.set(publicPath, ref);
  return ref;
}

async function migrateCategories() {
  const tx = client.transaction();
  for (const c of STATIC_CATEGORIES) {
    tx.createOrReplace({
      _id: catId(c.slug),
      _type: "category",
      title: c.title,
      slug: { _type: "slug", current: c.slug },
      ...(c.order != null ? { order: c.order } : {}),
    });
  }
  await tx.commit();
  console.log(`✓ ${STATIC_CATEGORIES.length} categories`);
}

async function migrateProducts() {
  let n = 0;
  for (const p of STATIC_PRODUCTS) {
    const images = [];
    for (const url of p.imageUrls ?? []) {
      if (!url.startsWith("/")) continue; // skip remote/absent
      try {
        images.push(await uploadLocal(url));
      } catch (e) {
        console.warn(`  ! image failed (${url}): ${(e as Error).message}`);
      }
    }
    await client.createOrReplace({
      _id: prodId(p.slug),
      _type: "product",
      title: p.title,
      slug: { _type: "slug", current: p.slug },
      ...(p.category ? { category: { _type: "reference", _ref: catId(p.category.slug) } } : {}),
      ...(p.brand ? { brand: p.brand } : {}),
      ...(p.description ? { description: p.description } : {}),
      featured: p.featured ?? false,
      active: true,
      ...(images.length ? { images } : {}),
    });
    n++;
    if (n % 10 === 0) console.log(`  … ${n} products`);
  }
  console.log(`✓ ${n} products`);
}

async function main() {
  console.log(`Migrating static catalog → ${projectId}/${dataset} …`);
  await migrateCategories();
  await migrateProducts();
  console.log("Done. Studio now shows the real catalog.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
