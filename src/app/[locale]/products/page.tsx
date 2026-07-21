import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { getCategories, getProducts } from "@/lib/sanity/queries";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CategoryNav } from "@/components/product/CategoryNav";

export default async function ProductsPage({ params }: { params: { locale: AppLocale } }) {
  setRequestLocale(params.locale);
  const locale = params.locale;
  const t = await getTranslations({ locale, namespace: "Products" });
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <div className="container-page py-12">
      <h1 className="text-3xl font-bold uppercase text-dust-50">{t("title")}</h1>
      <p className="mt-2 text-dust-300">{t("subtitle")}</p>
      <div className="mt-6">
        <CategoryNav categories={categories} locale={locale} allLabel={t("all")} />
      </div>
      <div className="mt-8">
        <ProductGrid products={products} locale={locale} />
      </div>
    </div>
  );
}
