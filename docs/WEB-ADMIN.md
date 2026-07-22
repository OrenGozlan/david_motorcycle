# Web Admin — editing the catalog from a browser

The catalog lives in **Sanity**. David edits it from a hosted **Sanity Studio**
web app (`<hostname>.sanity.studio`) — no code, no terminal. The public site is
a static build, so **catalog changes go live only after a rebuild** (push to
`main` → GitHub Actions redeploys).

## One-time setup (Oren — needs browser login)

1. **Create a Sanity project** at https://www.sanity.io/manage (free tier).
   Copy the **Project ID**.
2. Put the IDs in `.env.local` (local only, never committed):
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=<project id>
   NEXT_PUBLIC_SANITY_DATASET=production
   ```
3. Log in + deploy the Studio:
   ```
   npx sanity login
   pnpm studio:deploy      # first run asks for a hostname → <hostname>.sanity.studio
   ```
4. **Invite David**: sanity.io/manage → project → *Members* → Invite →
   David's email, role **Editor**. He sets his own password and signs in at
   `<hostname>.sanity.studio`.
5. **Seed the catalog** into Sanity (migrates the current static products):
   set `SANITY_API_WRITE_TOKEN` in `.env.local`, then `pnpm seed`.
6. **CI build reads from Sanity**: add repo secrets/vars in GitHub →
   `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`
   (and `SANITY_API_READ_TOKEN` only if the dataset is private).

## David's day-to-day (browser only)

1. Go to `<hostname>.sanity.studio`, sign in.
2. **Product** → pick one (or *Create new*).
   - Title (he / en / ru), Category, Brand, Images, Description
   - **Sizes** — type each size and press Enter (`S`, `M`, `L`, `XL`, `42`, `One Size`)
   - **Active** — turn off to hide a product without deleting it
   - **Featured** — show on the home page
3. **Publish** (top-right).
4. Tell Oren to redeploy — or wait for the next push to `main`. Site updates
   after the rebuild (not instant).

## Notes
- **No prices in phase 1** (view-only catalog). Prices arrive with phase 2
  (cart + payment).
- Studio edits alone don't change the live site — a rebuild is always required.
