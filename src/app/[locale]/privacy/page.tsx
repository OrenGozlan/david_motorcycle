import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/routing";
import { PolicyPage } from "@/components/PolicyPage";
import { alternatesFor } from "@/lib/seo/urls";

export async function generateMetadata({
  params,
}: {
  params: { locale: AppLocale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "Privacy" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: alternatesFor("privacy", params.locale),
  };
}

export default async function PrivacyRoute({ params }: { params: { locale: AppLocale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: "Privacy" });
  return (
    <PolicyPage
      title={t("title")}
      updated={t("updated")}
      intro={t("intro")}
      sections={t.raw("sections") as { h: string; p: string[] }[]}
    />
  );
}
