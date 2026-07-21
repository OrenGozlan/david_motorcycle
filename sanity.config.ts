import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schema";

// Standalone Sanity Studio. Run locally with `pnpm studio:dev`, publish a free
// hosted studio for David with `pnpm studio:deploy` (→ *.sanity.studio).
// Not embedded in the Next app because phase 1 is a static export.
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "david-motorcycle",
  title: "David Motorcycles — Catalog",
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
