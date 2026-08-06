import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { fetchRecipeBySlug, fetchSiteSettings } from "@/lib/sanity/fetchContent";
import { urlForImage } from "@/sanity/image";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
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

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [recipe, settings] = await Promise.all([fetchRecipeBySlug(slug), fetchSiteSettings()]);

  if (!recipe) notFound();

  const photoUrl = urlForImage(recipe.image)?.width(1200).height(800).url();

  const recipeSchema = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.excerpt ?? "",
    image: photoUrl ?? `${SITE_URL}/images/pouch-tomato.png`,
    author: { "@type": "Organization", name: "SAVR Nutrition" },
    recipeCategory: recipe.category ?? "Main Course",
    recipeCuisine: "South African",
    keywords: `SAVR, savoury protein powder, high protein, ${recipe.title}`,
    nutrition: {
      "@type": "NutritionInformation",
      proteinContent: "20g per serving of SAVR",
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
