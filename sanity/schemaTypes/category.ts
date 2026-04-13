import { defineField, defineType } from "sanity";
import {
  createExcerptField,
  createMigrationSourceField,
  createSeoField,
  createSlugField
} from "@/sanity/schemaTypes/shared";

export const categorySchema = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required()
    }),
    createSlugField(),
    createExcerptField(),
    createSeoField(),
    createMigrationSourceField()
  ]
});
