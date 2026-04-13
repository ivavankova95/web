import { defineArrayMember, defineField } from "sanity";

export function createSlugField() {
  return defineField({
    name: "slug",
    title: "Slug",
    type: "slug",
    options: { source: "title" },
    validation: (Rule) => Rule.required()
  });
}

export function createExcerptField() {
  return defineField({
    name: "excerpt",
    title: "Excerpt",
    type: "text",
    rows: 3
  });
}

export function createSeoField() {
  return defineField({
    name: "seo",
    title: "SEO",
    type: "seo"
  });
}

export function createMigrationSourceField() {
  return defineField({
    name: "migrationSource",
    title: "Migration source",
    type: "migrationSource"
  });
}

export function createPageBuilderField() {
  return defineField({
    name: "pageBuilder",
    title: "Page builder",
    type: "array",
    of: [
      defineArrayMember({ type: "heroBlock" }),
      defineArrayMember({ type: "richTextBlock" }),
      defineArrayMember({ type: "ctaBlock" }),
      defineArrayMember({ type: "imageBlock" }),
      defineArrayMember({ type: "formBlock" }),
      defineArrayMember({ type: "embedBlock" }),
      defineArrayMember({ type: "testimonialBlock" }),
      defineArrayMember({ type: "faqBlock" })
    ]
  });
}

export function createPortableTextField(name = "content", title = "Content") {
  return defineField({
    name,
    title,
    type: "array",
    of: [
      defineArrayMember({ type: "block" }),
      defineArrayMember({ type: "migrationImage" }),
      defineArrayMember({
        type: "image",
        options: { hotspot: true },
        fields: [
          defineField({
            name: "alt",
            title: "Alt text",
            type: "string"
          })
        ]
      })
    ]
  });
}
