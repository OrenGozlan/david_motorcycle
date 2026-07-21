"use client";

import { usePathname, useRouter, routing, type AppLocale } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

const LABELS: Record<AppLocale, string> = { he: "עב", en: "EN", ru: "RU" };
// Full language names in their own script (for aria — abbreviations are
// ambiguous to assistants / screen readers).
const NAMES: Record<AppLocale, string> = { he: "עברית", en: "English", ru: "Русский" };

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const current = (params.locale as AppLocale) ?? routing.defaultLocale;

  return (
    <nav aria-label="Language" className="flex items-center gap-1 text-sm">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => router.replace(pathname, { locale: loc })}
          aria-label={NAMES[loc]}
          aria-current={loc === current ? "true" : undefined}
          lang={loc}
          className={cn(
            "rounded px-2 py-1 font-display font-semibold uppercase tracking-wider transition",
            loc === current ? "bg-ember-500 text-white" : "text-dust-300 hover:text-ember-600",
          )}
        >
          {LABELS[loc]}
        </button>
      ))}
    </nav>
  );
}
