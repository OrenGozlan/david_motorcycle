import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageCircle, Facebook } from "lucide-react";
import type { AppLocale } from "@/i18n/routing";
import { CONTACT } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: { locale: AppLocale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "Contact" });
  return { title: t("title") };
}

export default async function ContactPage({ params }: { params: { locale: AppLocale } }) {
  setRequestLocale(params.locale);
  const locale = params.locale;
  const t = await getTranslations({ locale, namespace: "Contact" });
  const waHref = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(t("waGeneric"))}`;

  const rows = [
    { icon: Phone, label: t("phone"), value: CONTACT.phone, href: `tel:${CONTACT.phoneIntl}` },
    { icon: MessageCircle, label: "WhatsApp", value: CONTACT.phone, href: waHref },
    { icon: Mail, label: t("email"), value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { icon: Facebook, label: "Facebook", value: t("facebookCta"), href: CONTACT.facebook },
  ];

  return (
    <div className="container-page py-14">
      <h1 className="text-3xl font-bold uppercase text-dust-50 md:text-4xl">{t("title")}</h1>
      <p className="mt-2 text-dust-300">{t("subtitle")}</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          {rows.map((r) => (
            <a
              key={r.label}
              href={r.href}
              target={r.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="card-surface flex items-center gap-4 p-4 transition hover:border-ember-500"
            >
              <span className="text-ember-500">
                <r.icon size={22} />
              </span>
              <span>
                <span className="block text-xs uppercase tracking-wider text-dust-400">
                  {r.label}
                </span>
                <span className="text-dust-100">{r.value}</span>
              </span>
            </a>
          ))}
        </div>

        <div className="space-y-6">
          <div className="card-surface p-5">
            <div className="flex items-center gap-2 font-display uppercase tracking-wider text-dust-50">
              <MapPin size={18} className="text-ember-500" /> {t("locations")}
            </div>
            <ul className="mt-3 space-y-2 text-dust-200">
              {CONTACT.locations.map((loc) => (
                <li key={loc.en}>{loc[locale] ?? loc.en}</li>
              ))}
            </ul>
          </div>
          <div className="card-surface p-5">
            <div className="flex items-center gap-2 font-display uppercase tracking-wider text-dust-50">
              <Clock size={18} className="text-ember-500" /> {t("hours")}
            </div>
            <p className="mt-3 text-dust-200">{CONTACT.hours}</p>
            <p className="mt-1 text-sm text-dust-400">{t("byAppointment")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
