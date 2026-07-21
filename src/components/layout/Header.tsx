import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/routing";
import { brandName, BRAND_LATIN } from "@/lib/site";
import { getCategories } from "@/lib/sanity/queries";
import { pickI18n } from "@/lib/sanity/locale";
import { LanguageSwitcher } from "./LanguageSwitcher";

export async function Header({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "Nav" });
  const categories = await getCategories();

  return (
    <header className="sticky top-0 z-40 border-b border-asphalt-600/60 bg-asphalt-950/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-baseline gap-2 leading-none">
          <span className="font-display text-xl font-bold uppercase tracking-widest text-dust-50">
            {brandName(locale)}
          </span>
          <span className="hidden text-xs uppercase tracking-[0.3em] text-ember-500 sm:inline">
            {BRAND_LATIN}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-dust-200 md:flex">
          <Link href="/products" className="hover:text-ember-400">
            {t("products")}
          </Link>
          {categories.slice(0, 4).map((c) => (
            <Link key={c._id} href={`/categories/${c.slug}`} className="hover:text-ember-400">
              {pickI18n(c.title, locale)}
            </Link>
          ))}
          <Link href="/about" className="hover:text-ember-400">
            {t("about")}
          </Link>
          <Link href="/contact" className="hover:text-ember-400">
            {t("contact")}
          </Link>
        </nav>

        <LanguageSwitcher />
      </div>
    </header>
  );
}
