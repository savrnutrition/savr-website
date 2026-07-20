import { defineField, defineType } from "sanity";

// Phase 2 content (post-expo) — schema is ready now so the team can start
// populating recipes in Sanity whenever they have content, without needing
// a developer to add fields later.
export const recipe = defineType({
  name: "recipe",
  title: "Recipe",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          "Chicken",
          "Pasta",
          "Rice",
          "Vegetables",
          "Meal Prep",
          "High Protein Lunches",
          "High Protein Dinners",
          "Quick Meals (under 15 min)",
        ],
      },
    }),
    defineField({
      name: "flavour",
      title: "Flavour used",
      type: "reference",
      to: [{ type: "flavour" }],
    }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "body", title: "Recipe body", type: "array", of: [{ type: "block" }] }),
  ],
  preview: {
    select: { title: "title", subtitle: "category" },
  },
});
