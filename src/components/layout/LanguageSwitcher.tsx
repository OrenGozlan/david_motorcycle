"use client";

import { usePathname, useRouter, routing, type AppLocale } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

const LABELS: Record<AppLocale, string> = { he: "עב", en: "EN", ru: "RU" };

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const current = (params.locale as AppLocale) ?? routing.defaultLocale;

  return (
    <div className="flex items-center gap-1 text-sm">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => router.replace(pathname, { locale: loc })}
          aria-current={loc === current}
          className={cn(
            "rounded px-2 py-1 font-display font-semibold uppercase tracking-wider transition",
            loc === current
              ? "bg-ember-500 text-asphalt-950"
              : "text-dust-300 hover:text-ember-400",
          )}
        >
          {LABELS[loc]}
        </button>
      ))}
    </div>
  );
}
