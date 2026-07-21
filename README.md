# David Motorcycles — Denimotoparts

Boutique motorcycle & scooter gear store. Multi-language catalog (he / en / ru), adventure-riding vibe.

- **Phase 1 (current): view-only catalog.** Browse products by category. No cart — each product links to WhatsApp / phone. No prices. Hosted **free on GitHub Pages** (static export).
- **Phase 2 (later): orders + payment.** Cart, checkout, Israeli payment provider. Moves to a server (Fly).

## Stack
- Next.js 14 (App Router, TS strict), `output: "export"` → fully static
- next-intl (he default RTL · en · ru), no middleware (static)
- **Sanity** CMS for the catalog — content fetched at **build time**, baked into HTML
- Tailwind + a custom adventure theme
- Hosting: GitHub Pages · CMS editing: hosted Sanity Studio

## Develop
```bash
pnpm install
cp .env.example .env.local     # fill Sanity project id + dataset
pnpm dev                       # http://localhost:3000  (→ /he)
```
The site builds and renders even before Sanity is configured — queries return empty and the shell shows.

## Content (Sanity)
```bash
pnpm studio:dev       # local Studio
pnpm studio:deploy    # publish hosted Studio for David (*.sanity.studio)
pnpm seed             # bootstrap categories (+ products from scripts/catalog-input.json)
pnpm translate        # fill en/ru UI strings from he (needs ANTHROPIC_API_KEY)
```
Content model: `category`, `product` (localized title/description, images, brand, featured, active — no price in phase 1), `siteSettings`.

## Build & preview the static site
```bash
pnpm build            # → ./out
pnpm serve            # serve ./out locally
```

## Deploy (GitHub Pages)
Push to `main` → `.github/workflows/deploy.yml` builds `out/` and deploys to Pages.
Set repo **Actions secrets**: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN` (if dataset private), `NEXT_PUBLIC_SITE_URL`, and `NEXT_PUBLIC_BASE_PATH` (only if served under `/<repo>`).
When David publishes in Sanity, a webhook → `repository_dispatch (sanity-publish)` triggers a rebuild.

Custom domain: add `public/CNAME` + point DNS.
