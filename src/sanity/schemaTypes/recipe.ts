import { defineField, defineType } from "sanity";

// Phase 2 content (post-expo) — schema is ready now so the team can start
// populating recipes in Sanity whenever they have content, without needing
// a developer to add fields later.
export const recipe = defineType({
  name: "recipe",
  title: "Recipe",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Recipe title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "category",
      title: "Category",
      description: "Which filter tab this recipe shows under on the Recipes section.",
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
      title: "SAVR flavour used",
      description: "Pick from the flavours already set up under \"Flavours\".",
      type: "reference",
      to: [{ type: "flavour" }],
    }),
    defineField({
      name: "image",
      title: "Photo",
      description: "Click to upload a photo, then drag to set the focal point.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "body",
      title: "Recipe (ingredients, method, etc.)",
      description: "Write like a normal document — use the toolbar for bold, lists, and headings.",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category" },
  },
});
