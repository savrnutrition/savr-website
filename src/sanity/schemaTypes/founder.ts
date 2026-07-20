import { defineField, defineType } from "sanity";

export const founder = defineType({
  name: "founder",
  title: "Founder",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Full name",
      description: "Shown as the card is empty and hidden from the site until this is filled in.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role / title",
      description: "e.g. \"Co-founder\" or \"Head of Product\". Optional.",
      type: "string",
    }),
    defineField({
      name: "bio",
      title: "Short bio",
      description: "A sentence or two shown under their name and photo.",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "photo",
      title: "Photo",
      description: "Click to upload a headshot, then drag to set the focal point.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "order",
      title: "Position (left to right)",
      description: "Lower numbers show first. Use 1, 2, 3... to control the order founders appear in.",
      type: "number",
    }),
  ],
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "(empty — not shown on site yet)",
      subtitle,
      media,
    }),
  },
});
