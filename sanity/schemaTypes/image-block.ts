import { defineField, defineType } from "sanity";

export const imageBlockSchema = defineType({
  name: "imageBlock",
  title: "Image block",
  type: "object",
  fields: [
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
      ],
      validation: (Rule) => Rule.required()
    }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Default", value: "default" },
          { title: "Wide", value: "wide" },
          { title: "Full bleed", value: "fullBleed" }
        ]
      },
      initialValue: "default"
    })
  ]
});
