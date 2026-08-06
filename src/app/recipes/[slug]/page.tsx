import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { fetchRecipeBySlug, fetchSiteSettings } from "@/lib/sanity/fetchContent";
import { urlForImage } from "@/sanity/image";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import type { PortableTextBlock } from "@/lib/content/types";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await fetchRecipeBySlug(slug);
  if (!recipe) return { title: "Recipe — SAVR Nutrition" };
  return {
    title: `${recipe.title} — SAVR Nutrition`,
    description: recipe.excerpt,
    alternates: { canonical: `/recipes/${slug}` },
  };
}

const SITE_URL = "https://www.savrnutrition.co.za";

function portableTextToPlainText(blocks: PortableTextBlock[] | undefined): string {
  if (!blocks?.length) return "";
  return blocks
    .map((block) => {
      if (block._type !== "block") return "";
      const children = (block.children as Array<{ _type: string; text?: string }>) || [];
      return children
        .filter((child) => child._type === "span")
        .map((child) => child.text ?? "")
        .join("");
    })
    .filter(Boolean)
    .join("\n\n");
}

interface ExtractedRecipeData {
  prepTime?: string | null;
  cookTime?: string | null;
  recipeYield?: string | null;
  recipeCuisine?: string | null;
  calories?: string | null;
  recipeIngredient?: string[] | null;
  recipeInstructions?: string[] | null;
}

async function extractRecipeSchema(
  body: PortableTextBlock[] | undefined,
  recipeName: string,
): Promise<ExtractedRecipeData | null> {
  try {
    const plainText = portableTextToPlainText(body);
    if (!plainText) return null;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
        "anthropic-version": "2023-06-01",
      },
      next: { revalidate: 86400 },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Extract structured recipe data from this recipe text and return ONLY valid JSON, no markdown, no explanation:\n\n${plainText}\n\nReturn this exact JSON structure (use null for any field you cannot find):\n{\n  "prepTime": "PT10M",\n  "cookTime": "PT30M",\n  "recipeYield": "4 servings",\n  "recipeCuisine": "South African",\n  "calories": "450 kcal",\n  "recipeIngredient": ["200g beef mince", "1 onion, diced"],\n  "recipeInstructions": ["Heat oil in a pan", "Add onion and fry for 5 minutes"]\n}`,
          },
        ],
      }),
    });

    const data = await response.json();
    const text = data.content?.find((c: { type: string }) => c.type === "text")?.text || "{}";
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [recipe, settings] = await Promise.all([fetchRecipeBySlug(slug), fetchSiteSettings()]);

  if (!recipe) notFound();

  const photoUrl = urlForImage(recipe.image)?.width(1200).height(800).url();

  const extracted = await extractRecipeSchema(recipe.body, recipe.title);

  const recipeSchema = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.excerpt ?? "",
    image: photoUrl ?? `${SITE_URL}/images/pouch-tomato.png`,
    author: { "@type": "Organization", name: "SAVR Nutrition" },
    recipeCategory: recipe.category ?? "Main Course",
    recipeCuisine: extracted?.recipeCuisine ?? "South African",
    keywords: `SAVR, savoury protein powder, high protein, ${recipe.title}`,
    ...(extracted?.prepTime ? { prepTime: extracted.prepTime } : {}),
    ...(extracted?.cookTime ? { cookTime: extracted.cookTime } : {}),
    ...(extracted?.recipeYield ? { recipeYield: extracted.recipeYield } : {}),
    ...(extracted?.recipeIngredient?.length ? { recipeIngredient: extracted.recipeIngredient } : {}),
    ...(extracted?.recipeInstructions?.length
      ? {
          recipeInstructions: extracted.recipeInstructions.map((text) => ({
            "@type": "HowToStep",
            text,
          })),
        }
      : {}),
    nutrition: {
      "@type": "NutritionInformation",
      proteinContent: "20g per serving of SAVR",
      ...(extracted?.calories ? { calories: extracted.calories } : {}),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }}
      />
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/#recipes" className="mb-8 inline-block font-body text-sm text-ink-soft hover:opacity-70">
          ← Back to recipes
        </Link>

        {recipe.category && (
          <p className="mb-2 font-body text-xs font-semibold uppercase tracking-widest text-tomato">
            {recipe.category}
          </p>
        )}
        <h1 className="mb-4 font-display text-3xl font-bold md:text-4xl">{recipe.title}</h1>
        {recipe.excerpt && <p className="mb-6 font-body text-base text-ink-soft">{recipe.excerpt}</p>}
        {recipe.flavourName && (
          <p className="mb-6 font-body text-sm text-ink-soft">
            Made with <span className="font-semibold text-ink">SAVR {recipe.flavourName}</span>
          </p>
        )}

        {photoUrl && (
          <Image
            src={photoUrl}
            alt={`${recipe.title} made with SAVR savoury protein powder`}
            width={1200}
            height={800}
            className="mb-8 w-full rounded-2xl object-cover"
            priority
          />
        )}

        {recipe.body && recipe.body.length > 0 ? (
          <div className="font-body text-sm leading-relaxed text-ink-soft [&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:font-semibold [&_h3]:text-ink [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:mb-3 [&_ol]:ml-5 [&_ol]:list-decimal">
            <PortableText value={recipe.body} />
          </div>
        ) : (
          <p className="font-body text-sm text-ink-soft">Full recipe coming soon.</p>
        )}

        <div className="mt-12 rounded-2xl border border-line bg-white p-6 text-center">
          <p className="mb-1 font-body text-xs font-semibold uppercase tracking-widest text-tomato">
            Boost the protein in this recipe
          </p>
          <p className="mb-4 font-body text-sm text-ink-soft">
            Stir one scoop of SAVR Tomato Napoletana into your sauce for an extra 20g of protein per serving — no shakes, no sweetness.
          </p>
          <Link
            href="/#shop"
            className="inline-block rounded-full bg-tomato px-6 py-3 font-body text-sm font-semibold text-white hover:bg-tomato-dark"
          >
            Try SAVR in this recipe →
          </Link>
        </div>
      </main>
      <Footer settings={settings} />
    </>
  );
}
