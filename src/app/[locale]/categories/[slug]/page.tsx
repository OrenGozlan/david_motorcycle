import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { routing, type AppLocale } from "@/i18n/routing";
import {
  getAllCategorySlugs,
  getCategories,
  getCategoryBySlug,
  getProductsByCategory,
} from "@/lib/sanity/queries";
import { pickI18n } from "@/lib/sanity/locale";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CategoryNav } from "@/components/product/CategoryNav";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo/jsonld";
import { alternatesFor, ogLocale, localizedUrl } from "@/lib/seo/urls";

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  const combos = routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
  // output:export needs ≥1 prerendered route per dynamic segment; placeholder
  // when the catalog is empty (page resolves it to notFound()).
  return combos.length ? combos : routing.locales.map((locale) => ({ locale, slug: "_" }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: AppLocale; slug: string };
}): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return {};
  const name = pickI18n(category.title, params.locale);
  return {
    title: name,
    description: `${name} — David Motorcycles / Denimotoparts`,
    alternates: alternatesFor(`categories/${params.slug}`, params.locale),
    openGraph: {
      title: name,
      url: localizedUrl(params.locale, `categories/${params.slug}`),
      ...ogLocale(params.locale),
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { locale: AppLocale; slug: string };
}) {
  setRequestLocale(params.locale);
  const locale = params.locale;
  const [category, products, categories] = await Promise.all([
    getCategoryBySlug(params.slug),
    getProductsByCategory(params.slug),
    getCategories(),
  ]);
  if (!category) notFound();

  const t = await getTranslations({ locale, namespace: "Products" });
  const catName = pickI18n(category.title, locale);

  return (
    <div className="container-page py-12">
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: t("home"), path: "" },
          { name: t("title"), path: "products" },
          { name: catName, path: `categories/${params.slug}` },
        ])}
      />
      <h1 className="text-3xl font-bold uppercase text-dust-50">{catName}</h1>
      <div className="mt-6">
        <CategoryNav
          categories={categories}
          locale={locale}
          activeSlug={category.slug}
          allLabel={t("all")}
        />
      </div>
      <div className="mt-8">
        <ProductGrid products={products} locale={locale} />
      </div>
    </div>
  );
}
