import { defineField, defineType } from "sanity";

export const heroBlockSchema = defineType({
  name: "heroBlock",
  title: "Hero block",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "text",
      rows: 4
    }),
    defineField({
      name: "image",
      title: "Image",
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
    defineField({ name: "primaryLabel", title: "Primary CTA label", type: "string" }),
    defineField({ name: "primaryHref", title: "Primary CTA href", type: "string" }),
    defineField({ name: "secondaryLabel", title: "Secondary CTA label", type: "string" }),
    defineField({ name: "secondaryHref", title: "Secondary CTA href", type: "string" })
  ],
  preview: {
    select: {
      title: "heading",
      subtitle: "eyebrow"
    }
  }
});
