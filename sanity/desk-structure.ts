import type { StructureResolver } from "sanity/structure";

const singletonTypes = new Set(["siteSettings", "navigation", "footer"]);
const handledTypes = new Set([
  "siteSettings",
  "navigation",
  "footer",
  "page",
  "servicePage",
  "offerPage",
  "blogPost",
  "category",
  "legalPage"
]);

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("Obsah")
    .items([
      S.listItem()
        .title("Globální nastavení")
        .child(
          S.list()
            .title("Globální nastavení")
            .items([
              S.listItem()
                .title("Site settings")
                .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
              S.listItem()
                .title("Hlavní navigace")
                .child(S.document().schemaType("navigation").documentId("navigation-main")),
              S.listItem()
                .title("Footer")
                .child(S.document().schemaType("footer").documentId("footer-main"))
            ])
        ),
      S.divider(),
      S.listItem().title("Marketingové stránky").child(S.documentTypeList("page").title("Marketingové stránky")),
      S.listItem().title("Služby").child(S.documentTypeList("servicePage").title("Služby")),
      S.listItem().title("Nabídky a checkout").child(S.documentTypeList("offerPage").title("Nabídky a checkout")),
      S.listItem()
        .title("Blog")
        .child(
          S.list()
            .title("Blog")
            .items([
              S.documentTypeListItem("blogPost").title("Články"),
              S.documentTypeListItem("category").title("Kategorie")
            ])
        ),
      S.listItem().title("Právní stránky").child(S.documentTypeList("legalPage").title("Právní stránky")),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId();
        return Boolean(id) && !singletonTypes.has(id!) && !handledTypes.has(id!);
      })
    ]);
