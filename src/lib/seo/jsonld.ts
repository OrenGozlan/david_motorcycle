import type { AppLocale } from "@/i18n/routing";
import { SITE_URL, brandName, branchName, BRAND_LATIN, CONTACT, asset } from "@/lib/site";
import { localizedUrl, absUrl } from "./urls";

const ORG_ID = `${SITE_URL}#org`;
const WEBSITE_ID = `${SITE_URL}#website`;

const dayName = (d: string) => d; // schema.org accepts full English day names

// Organization + WebSite + both Store branches — injected once, site-wide.
export function orgGraph(locale: AppLocale) {
  const org = {
    "@type": "Organization",
    "@id": ORG_ID,
    name: brandName(locale),
    alternateName: BRAND_LATIN,
    url: localizedUrl(locale, ""),
    logo: absUrl(asset("/icon.svg")),
    telephone: CONTACT.phoneIntl,
    email: CONTACT.email,
    ...(CONTACT.facebook ? { sameAs: [CONTACT.facebook] } : {}),
  };
  const website = {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: localizedUrl(locale, ""),
    name: brandName(locale),
    inLanguage: locale,
    publisher: { "@id": ORG_ID },
  };
  const branches = CONTACT.locations.map((loc, i) => ({
    "@type": ["Store", "MotorcycleDealer"],
    "@id": `${SITE_URL}#branch-${i}`,
    name: `${brandName(locale)} — ${branchName(loc, locale)}`,
    parentOrganization: { "@id": ORG_ID },
    telephone: CONTACT.phoneIntl,
    address: {
      "@type": "PostalAddress",
      streetAddress: branchName(loc, locale),
      addressLocality: loc.city,
      addressCountry: "IL",
    },
    geo: { "@type": "GeoCoordinates", latitude: loc.lat, longitude: loc.lng },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: CONTACT.openDays.map(dayName),
        opens: CONTACT.opens,
        closes: CONTACT.closes,
      },
    ],
  }));
  return { "@context": "https://schema.org", "@graph": [org, website, ...branches] };
}

export function breadcrumbLd(
  locale: AppLocale,
  trail: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: localizedUrl(locale, t.path),
    })),
  };
}

export function productLd(
  locale: AppLocale,
  p: { name: string; description?: string; slug: string; brand?: string; imageUrls: string[]; categoryName?: string },
) {
  // No `offers` node: store has no online price/cart (phase 1). A priceless
  // Product is valid; add offers once real prices exist (phase 2).
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    ...(p.description ? { description: p.description.slice(0, 400) } : {}),
    ...(p.brand ? { brand: { "@type": "Brand", name: p.brand } } : {}),
    ...(p.categoryName ? { category: p.categoryName } : {}),
    ...(p.imageUrls.length ? { image: p.imageUrls } : {}),
    url: localizedUrl(locale, `products/${p.slug}`),
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}
