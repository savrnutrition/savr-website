import { draftMode } from "next/headers";
import { sanityClient } from "@/sanity/client";
import { readToken } from "@/sanity/env";
import {
  DEFAULT_FAQS,
  DEFAULT_FLAVOURS,
  DEFAULT_FOUNDERS,
  DEFAULT_SITE_SETTINGS,
} from "@/lib/content/defaults";
import type { FaqItem, Flavour, Founder, Recipe, SiteSettings } from "@/lib/content/types";

const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]`;
const FLAVOURS_QUERY = `*[_type == "flavour"] | order(select(status == "available" => 0, 1) asc, name asc)`;
const FOUNDERS_QUERY = `*[_type == "founder"] | order(order asc)`;
const FAQS_QUERY = `*[_type == "faqItem"] | order(order asc)`;
const RECIPES_QUERY = `*[_type == "recipe"]`;

// Every fetch* helper degrades to the tech-spec-sourced defaults (see
// src/lib/content/defaults.ts) whenever Sanity isn't configured yet, a
// document is missing, or a field hasn't been filled in — so the site is
// always fully populated even before the team's Sanity project exists.

// When Draft Mode is on (Sanity's visual/click-to-edit preview, entered via
// /api/draft-mode/enable), read unpublished drafts with stega-encoded
// content so @sanity/visual-editing can draw click-to-edit overlays on the
// real page. Everyone else always sees only published content.
async function getClient() {
  if (!sanityClient) return null;
  const { isEnabled } = await draftMode();
  if (isEnabled && readToken) {
    return sanityClient.withConfig({
      token: readToken,
      perspective: "drafts",
      useCdn: false,
      // enabled must be forced on explicitly — the client defaults this to
      // off in production to avoid leaking stega markers to real visitors.
      // Safe here since this whole branch only runs when draft mode (i.e.
      // Studio's Presentation preview) is already active.
      stega: { studioUrl: "/studio", enabled: true },
    });
  }
  return sanityClient;
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const client = await getClient();
  if (!client) return DEFAULT_SITE_SETTINGS;
  const doc = await client.fetch<Partial<SiteSettings> | null>(SITE_SETTINGS_QUERY);
  if (!doc) return DEFAULT_SITE_SETTINGS;
  return { ...DEFAULT_SITE_SETTINGS, ...stripEmpty(doc) };
}

export async function fetchFlavours(): Promise<Flavour[]> {
  const client = await getClient();
  if (!client) return DEFAULT_FLAVOURS;
  const docs = await client.fetch<Flavour[]>(FLAVOURS_QUERY);
  return docs?.length ? docs : DEFAULT_FLAVOURS;
}

export async function fetchFounders(): Promise<Founder[]> {
  const client = await getClient();
  if (!client) return DEFAULT_FOUNDERS;
  const docs = await client.fetch<Founder[]>(FOUNDERS_QUERY);
  return docs?.length ? docs : DEFAULT_FOUNDERS;
}

export async function fetchFaqs(): Promise<FaqItem[]> {
  const client = await getClient();
  if (!client) return DEFAULT_FAQS;
  const docs = await client.fetch<FaqItem[]>(FAQS_QUERY);
  return docs?.length ? docs : DEFAULT_FAQS;
}

export async function fetchRecipes(): Promise<Recipe[]> {
  const client = await getClient();
  if (!client) return [];
  return (await client.fetch<Recipe[]>(RECIPES_QUERY)) ?? [];
}

// Drop empty-string/undefined/[]-length-0 fields so defaults show through
// for anything the team hasn't filled in yet, rather than blanking the section.
function stripEmpty<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Partial<T> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value) && value.length === 0) continue;
    out[key as keyof T] = value as T[keyof T];
  }
  return out;
}
