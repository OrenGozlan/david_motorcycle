import { getTranslations } from "next-intl/server";
import { Phone, MessageCircle } from "lucide-react";
import type { AppLocale } from "@/i18n/routing";
import { CONTACT } from "@/lib/site";

// Phase-1 buy path: no cart. Ask about the product via WhatsApp or a phone call.
export async function ContactCTA({
  locale,
  productName,
  className,
}: {
  locale: AppLocale;
  productName?: string;
  className?: string;
}) {
  const t = await getTranslations({ locale, namespace: "Cta" });
  const message = productName ? t("waProduct", { name: productName }) : t("waGeneric");
  const waHref = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-3">
        <a href={waHref} target="_blank" rel="noreferrer" className="btn-ember">
          <MessageCircle size={18} /> {t("whatsapp")}
        </a>
        <a href={`tel:${CONTACT.phoneIntl}`} className="btn-ghost">
          <Phone size={18} /> {t("call")}
        </a>
      </div>
      <p className="mt-2 text-xs text-dust-400">{t("note")}</p>
    </div>
  );
}
