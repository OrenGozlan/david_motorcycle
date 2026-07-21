import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/routing";
import { brandName, BRAND_LATIN } from "@/lib/site";
import { getCategories } from "@/lib/sanity/queries";
import { pickI18n } from "@/lib/sanity/locale";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav, type NavLink } from "./MobileNav";

export async function Header({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "Nav" });
  const categories = await getCategories();

  const catLinks: NavLink[] = categories.map((c) => ({
    href: `/categories/${c.slug}`,
    label: pickI18n(c.title, locale),
  }));
  const mobileLinks: NavLink[] = [
    { href: "/products", label: t("products") },
    ...catLinks,
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-asphalt-600/60 bg-asphalt-950/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-baseline gap-2 leading-none">
          <span className="font-display text-xl font-bold uppercase tracking-widest text-dust-50">
            {brandName(locale)}
          </span>
          <span className="hidden text-xs uppercase tracking-[0.3em] text-ember-600 sm:inline">
            {BRAND_LATIN}
          </span>
        </Link>

        <nav aria-label={t("primary")} className="hidden items-center gap-6 text-sm font-medium text-dust-200 md:flex">
          <Link href="/products" className="hover:text-ember-600">
            {t("products")}
          </Link>
          {categories.slice(0, 4).map((c) => (
            <Link key={c.slug} href={`/categories/${c.slug}`} className="hover:text-ember-600">
              {pickI18n(c.title, locale)}
            </Link>
          ))}
          <Link href="/about" className="hover:text-ember-600">
            {t("about")}
          </Link>
          <Link href="/contact" className="hover:text-ember-600">
            {t("contact")}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <MobileNav links={mobileLinks} openLabel={t("openMenu")} closeLabel={t("closeMenu")} />
        </div>
      </div>
    </header>
  );
}
