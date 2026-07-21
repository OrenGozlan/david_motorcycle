import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["he", "en", "ru"],
  defaultLocale: "he",
  localePrefix: "always",
  localeCookie: { name: "NEXT_LOCALE" },
  // Hebrew is always the default. Bare "/" lands on "/he" (handled by a static
  // redirect page — there is no middleware on a static export).
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];

// Only Hebrew is RTL here; en + ru are LTR.
export const RTL_LOCALES = new Set<AppLocale>(["he"]);

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
