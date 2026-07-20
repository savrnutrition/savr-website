// Sanity isn't configured yet (no project has been created under the
// team's account). Every value here is allowed to be undefined so the site
// builds and renders fallback copy — see src/lib/sanity/fetchContent.ts —
// instead of crashing. Once NEXT_PUBLIC_SANITY_PROJECT_ID /
// NEXT_PUBLIC_SANITY_DATASET are set (see README), live content kicks in.
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

export const isSanityConfigured = Boolean(projectId && dataset);
