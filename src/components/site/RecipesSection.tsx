"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Recipe } from "@/lib/content/types";
import { urlForImage } from "@/sanity/image";

const RECIPE_CATEGORIES = [
  "Chicken",
  "Pasta",
  "Rice",
  "Vegetables",
  "Meal Prep",
  "High Protein Lunches",
  "High Protein Dinners",
  "Quick Meals (under 15 min)",
];

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const photoUrl = urlForImage(recipe.image)?.width(400).height(300).url();
  const content = (
    <>
      {photoUrl ? (
        <Image src={photoUrl} alt={recipe.title} width={400} height={300} className="h-40 w-full object-cover" />
      ) : (
        <div className="h-40 w-full bg-tan" />
      )}
      <div className="p-4">
        {recipe.category && (
          <p className="mb-1 font-body text-xs font-semibold uppercase tracking-widest text-tomato">
            {recipe.category}
          </p>
        )}
        <p className="font-body font-semibold">{recipe.title}</p>
        {recipe.excerpt && <p className="mt-1 font-body text-xs text-ink-soft">{recipe.excerpt}</p>}
        {!recipe.slug && (
          <p className="mt-1 font-body text-xs text-tomato">
            Add a URL slug in Studio to give this recipe its own page.
          </p>
        )}
      </div>
    </>
  );

  const className = "block overflow-hidden rounded-2xl border border-line hover:border-tomato";

  return recipe.slug ? (
    <Link href={`/recipes/${recipe.slug}`} className={className}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}

export function RecipesSection({
  recipes,
  heading,
  intro,
  emptyMessage,
}: {
  recipes: Recipe[];
  heading: string;
  intro: string;
  emptyMessage: string;
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const usedCategories = RECIPE_CATEGORIES.filter((c) => recipes.some((r) => r.category === c));
  const visible = activeCategory ? recipes.filter((r) => r.category === activeCategory) : recipes;

  return (
    <section id="recipes" className="mx-auto max-w-5xl scroll-mt-16 px-6 py-16">
      <h2 className="mb-2 font-display text-3xl font-bold">{heading}</h2>
      <p className="mb-8 font-body text-sm text-ink-soft">{intro}</p>

      {recipes.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className="rounded-full border px-4 py-2 font-body text-sm"
            style={{
              borderColor: activeCategory === null ? "var(--color-tomato)" : "var(--color-line)",
              color: activeCategory === null ? "var(--color-tomato)" : "var(--color-ink-soft)",
            }}
          >
            All
          </button>
          {usedCategories.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setActiveCategory(c)}
              className="rounded-full border px-4 py-2 font-body text-sm"
              style={{
                borderColor: activeCategory === c ? "var(--color-tomato)" : "var(--color-line)",
                color: activeCategory === c ? "var(--color-tomato)" : "var(--color-ink-soft)",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {recipes.length === 0 ? (
        <>
          <div className="flex flex-wrap gap-3">
            {RECIPE_CATEGORIES.map((c) => (
              <span key={c} className="rounded-full border border-line px-4 py-2 font-body text-sm text-ink-soft">
                {c}
              </span>
            ))}
          </div>
          <p className="mt-8 font-body text-sm text-ink-soft">{emptyMessage}</p>
        </>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {visible.map((r) => (
            <RecipeCard key={r._id} recipe={r} />
          ))}
        </div>
      )}
    </section>
  );
}
