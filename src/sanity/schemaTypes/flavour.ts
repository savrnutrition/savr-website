import { defineField, defineType } from "sanity";

export const flavour = defineType({
  name: "flavour",
  title: "Flavour",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
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
      title: "Colourway",
      type: "string",
      options: {
        list: [
          { title: "Tomato (red)", value: "tomato" },
          { title: "Olive", value: "olive" },
          { title: "Brown", value: "brown" },
        ],
      },
    }),
    defineField({ name: "shortDescription", title: "Short description", type: "text", rows: 3 }),
    defineField({ name: "image", title: "Pouch image", type: "image", options: { hotspot: true } }),
    defineField({ name: "servingSizeG", title: "Serving size (g)", type: "number", initialValue: 40 }),
    defineField({ name: "servingsPerContainer", title: "Servings per container", type: "number", initialValue: 13 }),
    defineField({
      name: "nutrition",
      title: "Nutrition panel rows",
      type: "array",
      of: [
        {
          type: "object",
          name: "nutritionRow",
          fields: [
            defineField({ name: "label", type: "string" }),
            defineField({ name: "per100g", type: "string" }),
            defineField({ name: "perServing", type: "string" }),
          ],
          preview: {
            select: { title: "label", subtitle: "perServing" },
          },
        },
      ],
    }),
    defineField({ name: "ingredients", title: "Ingredients", type: "text", rows: 3 }),
    defineField({ name: "allergens", title: "Allergens", type: "text", rows: 2 }),
    defineField({ name: "storage", title: "Storage", type: "text", rows: 2 }),
    defineField({
      name: "price",
      title: "Price override (R)",
      description: "Leave blank to use the site-wide price from Site Settings.",
      type: "number",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "status" },
  },
});
