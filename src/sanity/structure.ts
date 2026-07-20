import type { StructureResolver } from "sanity/structure";

// Site Settings is a singleton — one document only, edited in place rather
// than listed alongside repeatable content like flavours or FAQs.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("SAVR Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings")
        ),
      S.divider(),
      S.documentTypeListItem("flavour").title("Flavours"),
      S.documentTypeListItem("faqItem").title("FAQ"),
      S.documentTypeListItem("founder").title("Founders"),
      S.documentTypeListItem("recipe").title("Recipes"),
    ]);
