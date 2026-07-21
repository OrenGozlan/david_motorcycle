import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/routing";
import type { Product } from "@/lib/sanity/queries";
import { pickI18n, pickI18nLang } from "@/lib/sanity/locale";
import { SanityImg } from "./SanityImg";

export async function ProductCard({ product, locale }: { product: Product; locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "Products" });
  const title = pickI18nLang(product.title, locale);
  const category = product.category ? pickI18n(product.category.title, locale) : product.brand;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="card-surface group overflow-hidden transition hover:-translate-y-1 hover:shadow-ember"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <SanityImg
          url={product.imageUrls?.[0]}
          alt={title.text}
          className="transition duration-500 group-hover:scale-105"
        />
        {product.featured && (
          <span className="absolute start-3 top-3 rounded bg-ember-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            <span aria-hidden>★</span>
            <span className="sr-only">{t("featured")}</span>
          </span>
        )}
      </div>
      <div className="p-4">
        {category && (
          <div className="text-xs uppercase tracking-wider text-ember-600">{category}</div>
        )}
        <h3
          lang={title.lang}
          dir={title.dir}
          className="mt-1 font-display text-lg font-semibold leading-tight text-dust-50"
        >
          {title.text}
        </h3>
      </div>
    </Link>
  );
}
