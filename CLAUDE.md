# CLAUDE.md — David Motorcycles (Denimotoparts)

Context for future sessions. Keep terse.

## What this is
Boutique motorcycle-gear store site. Catalog by category, he/en/ru, adventure vibe.
Client: David (Denimotoparts). Owner/dev: Oren.

## Phases — do not relitigate
- **Phase 1 (built): view-only catalog.** No cart, no prices. Product → WhatsApp/call CTA. Static export on **GitHub Pages** ($0).
- **Phase 2 (later): orders + payment.** Add server (Fly), Postgres/Prisma, cart, checkout, Israeli payment (Grow — ref: Traveling Hillel + greems-pay repos). Catalog stays in Sanity; orders in DB.

## Stack
- Next.js 14 App Router, TS strict, `output: "export"` (static — no server phase 1)
- next-intl: `he` default (RTL) + `en` + `ru` (LTR). **No middleware** (static). Every page calls `setRequestLocale`. Bare `/` → `/he` via `src/app/page.tsx` meta-refresh.
- Sanity CMS = catalog. Fetched at BUILD time (SSG). Studio is standalone (`pnpm studio:deploy` → *.sanity.studio), not embedded.
- Tailwind custom theme (`asphalt`/`dust`/`ember`) in `tailwind.config.ts`; helpers in `src/styles/globals.css` (`btn-ember`, `card-surface`).

## Key files
- i18n: `src/i18n/{routing,request}.ts`, `messages/{he,en,ru}.json` (he is source)
- Sanity: `src/lib/sanity/{client,queries,image,locale}.ts`; schemas `sanity/schema/*`; `sanity.config.ts`
- Contact facts fallback: `src/lib/site.ts` (phone 0547761717, wa 972547761717, 2 locations)
- Pages: `src/app/[locale]/{page,products,products/[slug],categories/[slug],about,contact}`
- Deploy: `.github/workflows/deploy.yml`, `public/.nojekyll`

## Rules
- Queries no-op to empty when Sanity env absent — site still builds. Keep that.
- No price field / no cart in phase 1.
- Sanity WRITE token is local-only (`pnpm seed`) — never in repo/CI.
- Git: branch per task, ask before push/deploy (Oren ships).
- Content edits: `messages/he.json` first, keep en/ru in sync (`pnpm translate`).

## Web admin (David edits catalog)
- Standalone Sanity Studio → `<hostname>.sanity.studio` (`pnpm studio:deploy`, config `sanity.cli.ts`). Setup + David guide: `docs/WEB-ADMIN.md`.
- Product `sizes`: free-form tag array (`sanity/schema/product.ts`); shown on product page. Still no price (phase 2).
- Studio edits go live only after rebuild (push to `main`).

## Verify
`pnpm typecheck && pnpm lint && pnpm build` → `out/`; `pnpm serve`; check `/he` RTL, `/en`, `/ru`, `/` redirect, WhatsApp CTA.
