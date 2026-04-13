import { defineField, defineType } from "sanity";

export const ctaBlockSchema = defineType({
  name: "ctaBlock",
  title: "CTA block",
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
      name: "body",
      title: "Body",
      type: "text",
      rows: 4
    }),
    defineField({ name: "primaryLabel", title: "Primary CTA label", type: "string" }),
    defineField({ name: "primaryHref", title: "Primary CTA href", type: "string" }),
    defineField({ name: "secondaryLabel", title: "Secondary CTA label", type: "string" }),
    defineField({ name: "secondaryHref", title: "Secondary CTA href", type: "string" }),
    defineField({
      name: "backgroundVariant",
      title: "Background variant",
      type: "string",
      options: {
        list: [
          { title: "Surface", value: "surface" },
          { title: "Surface alt", value: "surfaceAlt" },
          { title: "Brand", value: "brand" }
        ]
      },
      initialValue: "surface"
    })
  ]
});
