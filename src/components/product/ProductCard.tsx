import { Link } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/routing";
import type { Product } from "@/lib/sanity/queries";
import { pickI18n } from "@/lib/sanity/locale";
import { SanityImg } from "./SanityImg";

export function ProductCard({ product, locale }: { product: Product; locale: AppLocale }) {
  const title = pickI18n(product.title, locale);
  const category = product.category ? pickI18n(product.category.title, locale) : product.brand;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="card-surface group overflow-hidden transition hover:-translate-y-1 hover:shadow-ember"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <SanityImg
          image={product.images?.[0]}
          alt={title}
          className="transition duration-500 group-hover:scale-105"
        />
        {product.featured && (
          <span className="absolute start-3 top-3 rounded bg-ember-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-asphalt-950">
            ★
          </span>
        )}
      </div>
      <div className="p-4">
        {category && (
          <div className="text-xs uppercase tracking-wider text-ember-500">{category}</div>
        )}
        <h3 className="mt-1 font-display text-lg font-semibold leading-tight text-dust-50">
          {title}
        </h3>
      </div>
    </Link>
  );
}
