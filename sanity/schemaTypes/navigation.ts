import { defineArrayMember, defineField, defineType } from "sanity";
import { createMigrationSourceField } from "@/sanity/schemaTypes/shared";

export const navigationSchema = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Main navigation"
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [defineArrayMember({ type: "navigationItem" })]
    }),
    defineField({ name: "ctaLabel", title: "CTA label", type: "string" }),
    defineField({
      name: "ctaHref",
      title: "CTA href",
      type: "string",
      initialValue: "https://app.zdravimebavi.cz/"
    }),
    createMigrationSourceField()
  ]
});
