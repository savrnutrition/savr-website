import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "price",
      title: "Live price (R)",
      description:
        "The price shown and charged on the site right now. Launch price is 299; switch to 349 post-launch — just edit this number, no redeploy needed.",
      type: "number",
      validation: (Rule) => Rule.required().positive(),
      initialValue: 299,
    }),
    defineField({
      name: "standardPrice",
      title: "Standard retail price (R) — reference only",
      description: "Shown for context only; not used in checkout maths.",
      type: "number",
      initialValue: 349,
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero headline",
      type: "string",
    }),
    defineField({
      name: "heroSubheadline",
      title: "Hero subheadline",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "aboutCopy",
      title: "About SAVR copy",
      description: "One paragraph per list item.",
      type: "array",
      of: [{ type: "text", rows: 3 }],
    }),
    defineField({
      name: "howToUseSteps",
      title: "How to use — steps",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "whyPoints",
      title: "Why savoury? — points",
      type: "array",
      of: [
        {
          type: "object",
          name: "whyPoint",
          fields: [
            defineField({ name: "title", type: "string" }),
            defineField({ name: "body", type: "text", rows: 2 }),
          ],
        },
      ],
    }),
    defineField({
      name: "deliveryNotes",
      title: "Delivery method copy",
      description:
        "Descriptive text shown per delivery option. Pricing/logic (Courier Guy live rate, PAXI R65, free collection) stays in code — this is copy only.",
      type: "array",
      of: [
        {
          type: "object",
          name: "deliveryNote",
          fields: [
            defineField({
              name: "method",
              type: "string",
              options: {
                list: [
                  { title: "Courier Guy", value: "courierguy" },
                  { title: "PAXI", value: "paxi" },
                  { title: "Collect in Cape Town", value: "collect" },
                ],
              },
            }),
            defineField({ name: "note", type: "string" }),
          ],
        },
      ],
    }),
    defineField({
      name: "footerText",
      title: "Footer text (returns / delivery policy)",
      type: "text",
      rows: 3,
    }),
    defineField({ name: "contactEmail", title: "Contact email", type: "string" }),
    defineField({
      name: "instagramHandle",
      title: "Instagram handle",
      type: "string",
    }),
    defineField({
      name: "businessAddress",
      title: "Business address",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "returnsPolicy",
      title: "Returns policy (full text, optional dedicated page copy)",
      type: "text",
      rows: 4,
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
