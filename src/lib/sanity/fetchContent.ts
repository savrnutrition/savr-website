import { sanityClient } from "@/sanity/client";
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

export async function fetchSiteSettings(): Promise<SiteSettings> {
  if (!sanityClient) return DEFAULT_SITE_SETTINGS;
  const doc = await sanityClient.fetch<Partial<SiteSettings> | null>(
    SITE_SETTINGS_QUERY
  );
  if (!doc) return DEFAULT_SITE_SETTINGS;
  return { ...DEFAULT_SITE_SETTINGS, ...stripEmpty(doc) };
}

export async function fetchFlavours(): Promise<Flavour[]> {
  if (!sanityClient) return DEFAULT_FLAVOURS;
  const docs = await sanityClient.fetch<Flavour[]>(FLAVOURS_QUERY);
  return docs?.length ? docs : DEFAULT_FLAVOURS;
}

export async function fetchFounders(): Promise<Founder[]> {
  if (!sanityClient) return DEFAULT_FOUNDERS;
  const docs = await sanityClient.fetch<Founder[]>(FOUNDERS_QUERY);
  return docs?.length ? docs : DEFAULT_FOUNDERS;
}

export async function fetchFaqs(): Promise<FaqItem[]> {
  if (!sanityClient) return DEFAULT_FAQS;
  const docs = await sanityClient.fetch<FaqItem[]>(FAQS_QUERY);
  return docs?.length ? docs : DEFAULT_FAQS;
}

export async function fetchRecipes(): Promise<Recipe[]> {
  if (!sanityClient) return [];
  return (await sanityClient.fetch<Recipe[]>(RECIPES_QUERY)) ?? [];
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
