import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/routing";
import { ContactCTA } from "@/components/product/ContactCTA";
import { alternatesFor, ogLocale, localizedUrl } from "@/lib/seo/urls";

export async function generateMetadata({
  params,
}: {
  params: { locale: AppLocale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "About" });
  const body = t.raw("body") as string[];
  return {
    title: t("title"),
    description: body?.[0],
    alternates: alternatesFor("about", params.locale),
    openGraph: {
      title: t("title"),
      description: body?.[0],
      url: localizedUrl(params.locale, "about"),
      ...ogLocale(params.locale),
    },
  };
}

export default async function AboutPage({ params }: { params: { locale: AppLocale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: "About" });
  const paras = t.raw("body") as string[];
  const services = t.raw("services") as string[];

  return (
    <div className="container-page py-14">
      <h1 className="text-3xl font-bold uppercase text-dust-50 md:text-4xl">{t("title")}</h1>
      <div className="mt-6 max-w-2xl space-y-4 text-lg text-dust-200">
        {paras.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <h2 className="mt-12 text-2xl font-bold uppercase text-dust-50">{t("servicesTitle")}</h2>
      <ul className="mt-4 grid max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
        {services.map((s, i) => (
          <li key={i} className="flex items-center gap-2 text-dust-200">
            <span className="text-ember-500">▸</span> {s}
          </li>
        ))}
      </ul>

      <ContactCTA locale={params.locale} className="mt-12" />
    </div>
  );
}
