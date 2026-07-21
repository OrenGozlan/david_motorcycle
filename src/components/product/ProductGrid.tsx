import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import type { Product } from "@/lib/sanity/queries";
import { ProductCard } from "./ProductCard";

export async function ProductGrid({
  products,
  locale,
}: {
  products: Product[];
  locale: AppLocale;
}) {
  const t = await getTranslations({ locale, namespace: "Products" });

  if (products.length === 0) {
    return (
      <div className="card-surface p-10 text-center text-dust-300">{t("empty")}</div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} locale={locale} />
      ))}
    </div>
  );
}
