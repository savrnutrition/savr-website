import { defineField, defineType } from "sanity";

export const review = defineType({
  name: "review",
  title: "Review",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Reviewer name",
      description: "Full name of the reviewer.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role / title",
      description: 'e.g. "Angel Investor" or "Seed Investor at Acme Capital".',
      type: "string",
    }),
    defineField({
      name: "quote",
      title: "Review",
      description: "The review text shown on the website. Keep it concise — 2–4 sentences work best.",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rating",
      title: "Star rating (1–5)",
      description: "Optional. Leave blank to show the review without stars.",
      type: "number",
      options: {
        list: [
          { title: "★★★★★  (5 stars)", value: 5 },
          { title: "★★★★☆  (4 stars)", value: 4 },
          { title: "★★★☆☆  (3 stars)", value: 3 },
          { title: "★★☆☆☆  (2 stars)", value: 2 },
          { title: "★☆☆☆☆  (1 star)",  value: 1 },
        ],
      },
    }),
    defineField({
      name: "approved",
      title: "Show on website",
      description: "Reviews submitted from the site are shown automatically. Untick and publish to hide a review.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Display order",
      description: "Lower numbers appear first. Use 1, 2, 3… to control the order reviews appear in.",
      type: "number",
    }),
  ],
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "role", approved: "approved" },
    prepare: ({ title, subtitle, approved }) => ({
      title: `${approved ? "✓" : "○"} ${title || "(unnamed)"}`,
      subtitle: subtitle || "",
    }),
  },
});
