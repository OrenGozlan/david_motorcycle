import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { routing, Link, type AppLocale } from "@/i18n/routing";
import { getAllProductSlugs, getProductBySlug } from "@/lib/sanity/queries";
import { pickI18n, pickI18nLang } from "@/lib/sanity/locale";
import { SanityImg } from "@/components/product/SanityImg";
import { ContactCTA } from "@/components/product/ContactCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { productLd, breadcrumbLd } from "@/lib/seo/jsonld";
import { alternatesFor, ogLocale, localizedUrl } from "@/lib/seo/urls";

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
  const name = pickI18n(product.title, params.locale);
  const description = pickI18n(product.description, params.locale).slice(0, 155);
  const img = product.imageUrls?.[0];
  return {
    title: name,
    description,
    alternates: alternatesFor(`products/${params.slug}`, params.locale),
    openGraph: {
      title: name,
      description,
      url: localizedUrl(params.locale, `products/${params.slug}`),
      ...(img ? { images: [img] } : {}),
      ...ogLocale(params.locale),
    },
  };
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
  const title = pickI18nLang(product.title, locale);
  const desc = pickI18nLang(product.description, locale);
  const catName = product.category ? pickI18n(product.category.title, locale) : undefined;
  const images = product.imageUrls ?? [];

  const trail = [
    { name: t("home"), path: "" },
    { name: t("products"), path: "products" },
    ...(product.category ? [{ name: catName!, path: `categories/${product.category.slug}` }] : []),
    { name: title.text, path: `products/${params.slug}` },
  ];

  return (
    <div className="container-page py-10">
      <JsonLd
        data={[
          productLd(locale, {
            name: title.text,
            description: desc.text,
            slug: params.slug,
            brand: product.brand,
            imageUrls: images,
            categoryName: catName,
          }),
          breadcrumbLd(locale, trail),
        ]}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-dust-400">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/products" className="hover:text-ember-600">
              {t("products")}
            </Link>
          </li>
          {product.category && (
            <li className="flex items-center gap-2">
              <span aria-hidden>/</span>
              <Link href={`/categories/${product.category.slug}`} className="hover:text-ember-600">
                {catName}
              </Link>
            </li>
          )}
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="card-surface relative aspect-square overflow-hidden">
            <SanityImg url={images[0]} alt={title.text} sizes="(max-width: 1024px) 100vw, 50vw" priority />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.slice(1, 5).map((img, i) => (
                <div key={i} className="card-surface relative aspect-square overflow-hidden">
                  <SanityImg url={img} alt={`${title.text} ${i + 2}`} sizes="25vw" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {catName && (
            <div className="text-sm uppercase tracking-wider text-ember-600">{catName}</div>
          )}
          <h1
            lang={title.lang}
            dir={title.dir}
            className="mt-1 text-3xl font-bold uppercase text-dust-50 md:text-4xl"
          >
            {title.text}
          </h1>
          {product.brand && <div className="mt-2 text-dust-300">{product.brand}</div>}

          {desc.text && (
            <div lang={desc.lang} dir={desc.dir} className="mt-6 space-y-3 text-dust-200">
              {desc.text
                .split("\n")
                .filter(Boolean)
                .map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-6">
              <div className="text-sm uppercase tracking-wider text-dust-400">{t("sizes")}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <span
                    key={size}
                    className="rounded-md border border-dust-700 px-3 py-1 text-sm text-dust-100"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          <ContactCTA locale={locale} productName={title.text} className="mt-8" />
        </div>
      </div>
    </div>
  );
}
