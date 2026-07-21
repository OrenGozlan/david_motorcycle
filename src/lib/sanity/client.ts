import { createClient, type SanityClient } from "@sanity/client";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

// True once a real project id is configured. When false, queries no-op so the
// static build still produces the site shell (useful before Sanity is wired).
export const sanityConfigured = projectId.length > 0;

export const sanityClient: SanityClient | null = sanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      // Build-time fetch (SSG). CDN is fine; content is baked into static HTML.
      useCdn: true,
      token: process.env.SANITY_API_READ_TOKEN || undefined,
      perspective: "published",
    })
  : null;
