import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/routing";
import { getCategories, getFeaturedProducts } from "@/lib/sanity/queries";
import { pickI18n } from "@/lib/sanity/locale";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SanityImg } from "@/components/product/SanityImg";
import { ContactCTA } from "@/components/product/ContactCTA";
import { HeroVideo } from "@/components/HeroVideo";

export default async function HomePage({ params }: { params: { locale: AppLocale } }) {
  setRequestLocale(params.locale);
  const locale = params.locale;
  const t = await getTranslations({ locale, namespace: "Home" });
  const [categories, featured] = await Promise.all([getCategories(), getFeaturedProducts()]);

  return (
    <>
      {/* Hero */}
      <HeroVideo>
        <p className="font-display text-sm uppercase tracking-[0.4em] text-ember-400">
          {t("kicker")}
        </p>
        <h1
          id="hero-title"
          className="mt-4 max-w-3xl text-4xl font-bold uppercase leading-[1.05] text-white drop-shadow md:text-6xl"
        >
          {t("title")}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-white/90 drop-shadow">{t("subtitle")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/products" className="btn-ember">
            {t("ctaBrowse")} <ArrowRight size={18} />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-white/60 px-5 py-3 font-display font-semibold uppercase tracking-wider text-white transition hover:bg-white/10"
          >
            {t("ctaVisit")}
          </Link>
        </div>
      </HeroVideo>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container-page py-16">
          <h2 className="text-2xl font-bold uppercase text-dust-50">{t("shopByCategory")}</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c._id}
                href={`/categories/${c.slug}`}
                className="card-surface group relative aspect-square overflow-hidden"
              >
                <SanityImg
                  url={c.imageUrl}
                  alt={pickI18n(c.title, locale)}
                  className="transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-asphalt-950/90 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-4 font-display text-lg font-semibold uppercase text-dust-50">
                  {pickI18n(c.title, locale)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="container-page py-16">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold uppercase text-dust-50">{t("featured")}</h2>
            <Link href="/products" className="text-sm text-ember-400 hover:underline">
              {t("viewAll")}
            </Link>
          </div>
          <div className="mt-6">
            <ProductGrid products={featured} locale={locale} />
          </div>
        </section>
      )}

      {/* Contact band */}
      <section className="border-t border-asphalt-600/60 bg-asphalt-900">
        <div className="container-page flex flex-col items-start gap-6 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold uppercase text-dust-50">{t("helpTitle")}</h2>
            <p className="mt-2 max-w-lg text-dust-300">{t("helpBody")}</p>
          </div>
          <ContactCTA locale={locale} />
        </div>
      </section>
    </>
  );
}
