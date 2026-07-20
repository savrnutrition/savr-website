import { defineField, defineType } from "sanity";

export const flavour = defineType({
  name: "flavour",
  title: "Flavour",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      description: "e.g. \"Tomato Napoletana\"",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      description:
        "Just click \"Generate\" — this creates a web-friendly version of the name automatically. You almost never need to type this by hand.",
      type: "slug",
      options: { source: "name" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Availability",
      description: "Controls whether it shows as buyable or as \"Coming soon\" on the Shop section.",
      type: "string",
      options: {
        list: [
          { title: "Available now", value: "available" },
          { title: "Coming soon", value: "comingSoon" },
        ],
      },
      initialValue: "comingSoon",
    }),
    defineField({
      name: "colorway",
      title: "Accent colour",
      description: "Which brand colour this flavour's card uses on the Shop section.",
      type: "string",
      options: {
        list: [
          { title: "Tomato (red)", value: "tomato" },
          { title: "Olive (green)", value: "olive" },
          { title: "Brown", value: "brown" },
        ],
      },
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      description: "One or two sentences shown on the flavour's card on the Shop section.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "image",
      title: "Pouch photo",
      description: "Click to upload a photo, then drag to set the focal point (used when the image gets cropped).",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "servingSizeG",
      title: "Serving size (grams)",
      type: "number",
      initialValue: 40,
    }),
    defineField({
      name: "servingsPerContainer",
      title: "Servings per pouch",
      type: "number",
      initialValue: 13,
    }),
    defineField({
      name: "nutrition",
      title: "Nutrition panel",
      description:
        "One row per nutrient (e.g. Energy, Protein, Fat...). Click \"+ Add item\" for a new row, fill in the label and the two amounts.",
      type: "array",
      of: [
        {
          type: "object",
          name: "nutritionRow",
          fields: [
            defineField({ name: "label", title: "Nutrient name", type: "string" }),
            defineField({ name: "per100g", title: "Amount per 100g", type: "string" }),
            defineField({ name: "perServing", title: "Amount per serving", type: "string" }),
          ],
          preview: {
            select: { title: "label", subtitle: "perServing" },
          },
        },
      ],
    }),
    defineField({
      name: "ingredients",
      title: "Ingredients list",
      description: "Written exactly as it should appear on the site, e.g. \"Soy Protein 90%, Maize Starch Powder, ...\"",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "allergens",
      title: "Allergen information",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "storage",
      title: "Storage instructions",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "price",
      title: "Price override (R)",
      description: "Only fill this in if this specific flavour should cost something different from the main price in Site Settings. Leave blank otherwise.",
      type: "number",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "status", media: "image" },
  },
});
