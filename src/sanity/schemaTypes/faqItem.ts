import { defineField, defineType } from "sanity";

export const faqItem = defineType({
  name: "faqItem",
  title: "FAQ Item",
  type: "document",
  fields: [
    defineField({ name: "question", title: "Question", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "answer", title: "Answer", type: "text", rows: 3 }),
    defineField({
      name: "isTodo",
      title: "Marked TODO (not confirmed yet)",
      description: "Shows a dashed placeholder badge instead of the answer text on the live site.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "order", title: "Display order", type: "number" }),
  ],
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "question" },
  },
});
