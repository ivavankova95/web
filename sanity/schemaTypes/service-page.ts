import { defineField, defineType } from "sanity";
import {
  createExcerptField,
  createMigrationSourceField,
  createPageBuilderField,
  createSeoField,
  createSlugField
} from "@/sanity/schemaTypes/shared";

export const servicePageSchema = defineType({
  name: "servicePage",
  title: "Service page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required()
    }),
    createSlugField(),
    defineField({ name: "serviceKey", title: "Service key", type: "string" }),
    createExcerptField(),
    defineField({ name: "leadFormKey", title: "Lead form key", type: "string" }),
    createPageBuilderField(),
    createSeoField(),
    createMigrationSourceField()
  ]
});
