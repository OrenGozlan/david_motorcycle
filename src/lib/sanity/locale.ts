import type { AppLocale } from "@/i18n/routing";

export type LocalizedString = { he?: string; en?: string; ru?: string } | undefined | null;

const ORDER: AppLocale[] = ["he", "en", "ru"];

// Read a localized field with fallback: requested → he → en → ru.
export function pickI18n(field: LocalizedString, locale: AppLocale): string {
  if (!field) return "";
  return field[locale] || field.he || field.en || field.ru || "";
}

// Like pickI18n but also reports which language actually produced the text and
// its direction. Use to wrap fallback content, e.g. Hebrew shown on an /en page,
// in <span lang dir> so parsers + screen readers + RTL rendering stay correct.
export function pickI18nLang(
  field: LocalizedString,
  locale: AppLocale,
): { text: string; lang: AppLocale; dir: "rtl" | "ltr" } {
  const source: AppLocale =
    field && field[locale]
      ? locale
      : (ORDER.find((l) => field && field[l]) ?? locale);
  const text = field ? field[source] ?? "" : "";
  return { text, lang: source, dir: source === "he" ? "rtl" : "ltr" };
}
