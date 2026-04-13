import { defineField, defineType } from "sanity";
import {
  createMigrationSourceField,
  createPortableTextField,
  createSeoField,
  createSlugField
} from "@/sanity/schemaTypes/shared";

export const legalPageSchema = defineType({
  name: "legalPage",
  title: "Legal page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required()
    }),
    createSlugField(),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3
    }),
    createPortableTextField(),
    createSeoField(),
    createMigrationSourceField()
  ]
});
