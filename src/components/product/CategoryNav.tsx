import { Link } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/routing";
import type { Category } from "@/lib/sanity/queries";
import { pickI18n } from "@/lib/sanity/locale";
import { cn } from "@/lib/utils";

export function CategoryNav({
  categories,
  locale,
  activeSlug,
  allLabel,
}: {
  categories: Category[];
  locale: AppLocale;
  activeSlug?: string;
  allLabel: string;
}) {
  const pill = "rounded-full border px-4 py-1.5 text-sm font-medium transition";
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/products"
        className={cn(
          pill,
          !activeSlug
            ? "border-ember-500 bg-ember-500 text-asphalt-950"
            : "border-asphalt-600 text-dust-200 hover:border-ember-500 hover:text-ember-400",
        )}
      >
        {allLabel}
      </Link>
      {categories.map((c) => (
        <Link
          key={c._id}
          href={`/categories/${c.slug}`}
          className={cn(
            pill,
            activeSlug === c.slug
              ? "border-ember-500 bg-ember-500 text-asphalt-950"
              : "border-asphalt-600 text-dust-200 hover:border-ember-500 hover:text-ember-400",
          )}
        >
          {pickI18n(c.title, locale)}
        </Link>
      ))}
    </div>
  );
}
