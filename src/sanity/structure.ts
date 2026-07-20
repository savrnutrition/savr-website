import type { StructureResolver } from "sanity/structure";
import { Settings, Package, HelpCircle, Users, BookOpen } from "lucide-react";

// Site Settings is a singleton — one document only, edited in place rather
// than listed alongside repeatable content like flavours or FAQs.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("SAVR Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .icon(Settings)
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings").title("Site Settings")
        ),
      S.divider(),
      S.documentTypeListItem("flavour").title("Flavours").icon(Package),
      S.documentTypeListItem("faqItem").title("FAQ").icon(HelpCircle),
      S.documentTypeListItem("founder").title("Founders").icon(Users),
      S.documentTypeListItem("recipe").title("Recipes").icon(BookOpen),
    ]);
