import { defineArrayMember, defineField, defineType } from "sanity";
import { createMigrationSourceField } from "@/sanity/schemaTypes/shared";

export const footerSchema = defineType({
  name: "footer",
  title: "Footer",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Footer"
    }),
    defineField({
      name: "aboutText",
      title: "About text",
      type: "text",
      rows: 4
    }),
    defineField({
      name: "primaryLinks",
      title: "Primary links",
      type: "array",
      of: [defineArrayMember({ type: "navigationItem" })]
    }),
    defineField({
      name: "legalLinks",
      title: "Legal links",
      type: "array",
      of: [defineArrayMember({ type: "navigationItem" })]
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [defineArrayMember({ type: "navigationItem" })]
    }),
    createMigrationSourceField()
  ]
});
