import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/routing";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqLd } from "@/lib/seo/jsonld";
import { alternatesFor, ogLocale, localizedUrl } from "@/lib/seo/urls";

type QA = { q: string; a: string };

export async function generateMetadata({
  params,
}: {
  params: { locale: AppLocale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "Faq" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: alternatesFor("faq", params.locale),
    openGraph: {
      title: t("title"),
      description: t("subtitle"),
      url: localizedUrl(params.locale, "faq"),
      ...ogLocale(params.locale),
    },
  };
}

export default async function FaqRoute({ params }: { params: { locale: AppLocale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: "Faq" });
  const items = t.raw("items") as QA[];

  return (
    <div className="container-page py-14">
      <JsonLd data={faqLd(items)} />
      <h1 className="text-3xl font-bold uppercase text-dust-50 md:text-4xl">{t("title")}</h1>
      <p className="mt-2 text-dust-300">{t("subtitle")}</p>

      <dl className="mt-10 max-w-2xl divide-y divide-asphalt-600/60">
        {items.map((it, i) => (
          <div key={i} className="py-5">
            <dt className="font-display text-lg font-semibold text-dust-50">{it.q}</dt>
            <dd className="mt-2 text-dust-200">{it.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
