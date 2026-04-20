import { defineArrayMember, defineField, defineType } from "sanity";
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
    // Ingredient tables — for recipes only (leave empty for plain articles).
    // Supports 1–2 tables (e.g. "Na korpus" + "Na krém").
    defineField({
      name: "ingredientTables",
      title: "Ingredient tables",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "ingredientTable",
          title: "Table",
          fields: [
            defineField({
              name: "title",
              title: "Table title",
              type: "string",
              description: 'Optional label shown above this table\'s rows (e.g. "Na korpus", "Na krém"). Leave blank if there is only one table.'
            }),
            defineField({
              name: "rows",
              title: "Rows",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "ingredientRow",
                  title: "Ingredient",
                  fields: [
                    defineField({
                      name: "name",
                      title: "Ingredient name",
                      type: "string",
                      validation: (Rule) => Rule.required()
                    }),
                    defineField({
                      name: "amount",
                      title: "Amount",
                      type: "string",
                      description: 'e.g. "200 g", "2 lžíce", "dle chuti". Leave blank if no specific amount.'
                    })
                  ],
                  preview: {
                    select: { title: "name", subtitle: "amount" }
                  }
                })
              ]
            })
          ],
          preview: {
            select: { title: "title" },
            prepare: ({ title }) => ({ title: title || "Ingredience" })
          }
        })
      ]
    }),
    createPortableTextField(),
    createSeoField(),
    createMigrationSourceField()
  ]
});
