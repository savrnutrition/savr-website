import type { MetadataRoute } from "next";
import { fetchRecipes } from "@/lib/sanity/fetchContent";

const SITE_URL = "https://www.savrnutrition.co.za";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const recipes = await fetchRecipes();
  const recipeUrls: MetadataRoute.Sitemap = recipes
    .filter((r) => r.slug)
    .map((r) => ({
      url: `${SITE_URL}/recipes/${r.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/returns`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...recipeUrls,
  ];
}
