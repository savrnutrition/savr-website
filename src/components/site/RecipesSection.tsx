import type { Recipe } from "@/lib/content/types";
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

export function RecipesSection({ recipes }: { recipes: Recipe[] }) {
  return (
    <section id="recipes" className="mx-auto max-w-5xl scroll-mt-16 px-6 py-16">
      <h2 className="mb-2 font-display text-3xl font-bold">How to use it</h2>
      <p className="mb-8 font-body text-sm text-ink-soft">
        Stir SAVR into what you&apos;re already cooking. Recipe library launching post-expo — categories below.
      </p>
      <div className="flex flex-wrap gap-3">
        {RECIPE_CATEGORIES.map((c) => (
          <span key={c} className="rounded-full border border-line px-4 py-2 font-body text-sm text-ink-soft">
            {c}
          </span>
        ))}
      </div>
      {recipes.length === 0 && (
        <div className="mt-8">
          <TodoTag>Recipe content, photos &amp; videos — add via CMS (Phase 2)</TodoTag>
        </div>
      )}
    </section>
  );
}
