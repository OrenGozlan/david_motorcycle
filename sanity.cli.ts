import { defineCliConfig } from "sanity/cli";

// CLI config for the standalone Studio. `pnpm studio:deploy` reads the project
// id / dataset from env (same vars the Next build uses). On the first deploy
// the CLI asks for a studio hostname → <hostname>.sanity.studio, David's web
// admin. No secrets here — the deploy uses the interactive `sanity login` token.
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  },
  // Studio URL → https://david-motorcycle.sanity.studio (skips the first-deploy
  // hostname prompt so `pnpm studio:deploy` runs non-interactively).
  studioHost: "david-motorcycle",
});
