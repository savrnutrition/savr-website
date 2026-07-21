"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Recipe } from "@/lib/content/types";
import { urlForImage } from "@/sanity/image";
import { TodoTag } from "@/components/ui/TodoTag";

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

export function RecipesSection({
  recipes,
  heading,
  intro,
}: {
  recipes: Recipe[];
  heading: string;
  intro: string;
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
          <div className="mt-8">
            <TodoTag>Recipe content, photos &amp; videos — add via CMS</TodoTag>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {visible.map((r) => {
            const photoUrl = urlForImage(r.image)?.width(400).height(300).url();
            return (
              <Link
                key={r._id}
                href={`/recipes/${r.slug}`}
                className="block overflow-hidden rounded-2xl border border-line hover:border-tomato"
              >
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt={r.title}
                    width={400}
                    height={300}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="h-40 w-full bg-tan" />
                )}
                <div className="p-4">
                  {r.category && (
                    <p className="mb-1 font-body text-xs font-semibold uppercase tracking-widest text-tomato">
                      {r.category}
                    </p>
                  )}
                  <p className="font-body font-semibold">{r.title}</p>
                  {r.excerpt && <p className="mt-1 font-body text-xs text-ink-soft">{r.excerpt}</p>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
