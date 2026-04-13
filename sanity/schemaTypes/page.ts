import { defineField, defineType } from "sanity";
import {
  createExcerptField,
  createMigrationSourceField,
  createPageBuilderField,
  createSeoField,
  createSlugField
} from "@/sanity/schemaTypes/shared";

export const pageSchema = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required()
    }),
    createSlugField(),
    defineField({ name: "pageKey", title: "Page key", type: "string" }),
    createExcerptField(),
    createPageBuilderField(),
    createSeoField(),
    createMigrationSourceField()
  ]
});
