import { defineField, defineType } from "sanity";
import {
  createExcerptField,
  createMigrationSourceField,
  createPortableTextField,
  createSeoField,
  createSlugField
} from "@/sanity/schemaTypes/shared";

export const blogPostSchema = defineType({
  name: "blogPost",
  title: "Blog post",
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
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime"
    }),
    defineField({
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string"
        })
      ]
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }]
    }),
    createPortableTextField(),
    createSeoField(),
    createMigrationSourceField()
  ]
});
