import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { routing, Link, type AppLocale } from "@/i18n/routing";
import { getAllProductSlugs, getProductBySlug } from "@/lib/sanity/queries";
import { pickI18n } from "@/lib/sanity/locale";
import { SanityImg } from "@/components/product/SanityImg";
import { ContactCTA } from "@/components/product/ContactCTA";

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  const combos = routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
  // output:export needs ≥1 prerendered route per dynamic segment. When the
  // catalog is empty (Sanity not yet populated) emit a placeholder the page
  // resolves to notFound(). Real slugs replace it once products exist.
  return combos.length ? combos : routing.locales.map((locale) => ({ locale, slug: "_" }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: AppLocale; slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  return { title: pickI18n(product.title, params.locale) };
}

export default async function ProductPage({
  params,
}: {
  params: { locale: AppLocale; slug: string };
}) {
  setRequestLocale(params.locale);
  const locale = params.locale;
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const t = await getTranslations({ locale, namespace: "Product" });
  const title = pickI18n(product.title, locale);
  const description = pickI18n(product.description, locale);
  const images = product.images ?? [];

  return (
    <div className="container-page py-10">
      <nav className="mb-6 text-sm text-dust-400">
        <Link href="/products" className="hover:text-ember-400">
          {t("backToProducts")}
        </Link>
        {product.category && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/categories/${product.category.slug}`} className="hover:text-ember-400">
              {pickI18n(product.category.title, locale)}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="card-surface relative aspect-square overflow-hidden">
            <SanityImg image={images[0]} alt={title} sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.slice(1, 5).map((img, i) => (
                <div key={i} className="card-surface relative aspect-square overflow-hidden">
                  <SanityImg image={img} alt={`${title} ${i + 2}`} sizes="25vw" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.category && (
            <div className="text-sm uppercase tracking-wider text-ember-500">
              {pickI18n(product.category.title, locale)}
            </div>
          )}
          <h1 className="mt-1 text-3xl font-bold uppercase text-dust-50 md:text-4xl">{title}</h1>
          {product.brand && <div className="mt-2 text-dust-300">{product.brand}</div>}

          {description && (
            <div className="mt-6 space-y-3 text-dust-200">
              {description.split("\n").filter(Boolean).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}

          <ContactCTA locale={locale} productName={title} className="mt-8" />
        </div>
      </div>
    </div>
  );
}
