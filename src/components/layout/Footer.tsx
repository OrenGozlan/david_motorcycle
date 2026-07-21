import { getTranslations } from "next-intl/server";
import { Phone, Mail, MapPin, Clock, Facebook, MessageCircle } from "lucide-react";
import type { AppLocale } from "@/i18n/routing";
import { brandName, BRAND_LATIN, CONTACT } from "@/lib/site";
import { Link } from "@/i18n/routing";

export async function Footer({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "Footer" });
  const waHref = `https://wa.me/${CONTACT.whatsapp}`;

  return (
    <footer className="border-t border-asphalt-600/60 bg-asphalt-900">
      <div className="container-page grid gap-8 py-12 md:grid-cols-3">
        <div>
          <div className="font-display text-lg font-bold uppercase tracking-widest text-dust-50">
            {brandName(locale)}
          </div>
          <div className="mt-1 text-xs uppercase tracking-[0.3em] text-ember-500">{BRAND_LATIN}</div>
          <p className="mt-4 max-w-xs text-sm text-dust-300">{t("tagline")}</p>
        </div>

        <div className="space-y-3 text-sm text-dust-200">
          <div className="font-display uppercase tracking-wider text-dust-400">{t("contact")}</div>
          <a href={`tel:${CONTACT.phoneIntl}`} className="flex items-center gap-2 hover:text-ember-400">
            <Phone size={16} /> {CONTACT.phone}
          </a>
          <a href={waHref} className="flex items-center gap-2 hover:text-ember-400" target="_blank" rel="noreferrer">
            <MessageCircle size={16} /> WhatsApp
          </a>
          <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 hover:text-ember-400">
            <Mail size={16} /> {CONTACT.email}
          </a>
          <a href={CONTACT.facebook} className="flex items-center gap-2 hover:text-ember-400" target="_blank" rel="noreferrer">
            <Facebook size={16} /> Facebook
          </a>
        </div>

        <div className="space-y-3 text-sm text-dust-200">
          <div className="font-display uppercase tracking-wider text-dust-400">{t("visit")}</div>
          {CONTACT.locations.map((loc) => (
            <div key={loc.en} className="flex items-center gap-2">
              <MapPin size={16} /> {loc[locale] ?? loc.en}
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Clock size={16} /> {CONTACT.hours}
          </div>
        </div>
      </div>

      <div className="border-t border-asphalt-600/60 py-4">
        <div className="container-page flex flex-wrap items-center justify-between gap-2 text-xs text-dust-400">
          <span>© {brandName(locale)}</span>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-ember-400">
              {t("about")}
            </Link>
            <Link href="/contact" className="hover:text-ember-400">
              {t("contact")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
