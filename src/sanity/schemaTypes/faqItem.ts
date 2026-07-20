import { defineField, defineType } from "sanity";

export const faqItem = defineType({
  name: "faqItem",
  title: "FAQ Item",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "isTodo",
      title: "Not confirmed yet",
      description:
        "Turn this on to show a dashed \"not confirmed\" badge instead of the answer — use while you're still checking a fact before publishing it.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Position in the list",
      description: "Lower numbers show first.",
      type: "number",
    }),
  ],
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "question", subtitle: "answer" },
  },
});
