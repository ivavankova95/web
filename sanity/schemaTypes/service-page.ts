import { defineArrayMember, defineField, defineType } from "sanity";
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
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true }
    }),
    defineField({
      name: "benefits",
      title: "Benefits (výhody)",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "text", title: "Text", type: "string", validation: (Rule) => Rule.required() })
          ],
          preview: { select: { title: "text" } }
        })
      ]
    }),
    defineField({
      name: "steps",
      title: "Steps — Jak to funguje",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 })
          ],
          preview: { select: { title: "title", subtitle: "description" } }
        })
      ]
    }),
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "quote", title: "Quote", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
            defineField({ name: "author", title: "Author", type: "string" })
          ],
          preview: { select: { title: "author", subtitle: "quote" } }
        })
      ]
    }),
    defineField({ name: "leadFormKey", title: "Lead form key", type: "string" }),
    createPageBuilderField(),
    createSeoField(),
    createMigrationSourceField()
  ]
});
