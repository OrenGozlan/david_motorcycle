import type { AppLocale } from "@/i18n/routing";

export type LocalizedString = { he?: string; en?: string; ru?: string } | undefined | null;

// Read a localized Sanity field with fallback ordering: requested → he → en → ru.
export function pickI18n(field: LocalizedString, locale: AppLocale): string {
  if (!field) return "";
  return field[locale] || field.he || field.en || field.ru || "";
}
