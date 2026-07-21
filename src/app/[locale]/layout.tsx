import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { routing, RTL_LOCALES, type AppLocale } from "@/i18n/routing";
import { brandName, asset } from "@/lib/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SiteBackground } from "@/components/SiteBackground";
import { JsonLd } from "@/components/seo/JsonLd";
import { orgGraph } from "@/lib/seo/jsonld";
import { alternatesFor, ogLocale, localizedUrl } from "@/lib/seo/urls";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!(routing.locales as readonly string[]).includes(params.locale)) return {};
  const locale = params.locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "Meta" });
  const title = t("title");
  const description = t("description");
  return {
    title: { default: title, template: `%s · ${brandName(locale)}` },
    description,
    alternates: alternatesFor("", locale),
    openGraph: {
      type: "website",
      siteName: brandName(locale),
      title,
      description,
      url: localizedUrl(locale, ""),
      ...ogLocale(locale),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!(routing.locales as readonly string[]).includes(params.locale)) notFound();
  const locale = params.locale as AppLocale;
  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = RTL_LOCALES.has(locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <head>
        <link rel="icon" href={asset("/icon.svg")} type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Rubik:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteBackground />
        <JsonLd data={orgGraph(locale)} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="flex min-h-screen flex-col">
            <Header locale={locale} />
            <main className="flex-1">{children}</main>
            <Footer locale={locale} />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
