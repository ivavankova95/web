import { defineField, defineType } from "sanity";

export const embedBlockSchema = defineType({
  name: "embedBlock",
  title: "Embed block",
  type: "object",
  fields: [
    defineField({
      name: "provider",
      title: "Provider",
      type: "string",
      options: {
        list: [
          { title: "YouTube", value: "youtube" },
          { title: "Wistia", value: "wistia" },
          { title: "Elfsight", value: "elfsight" },
          { title: "Custom", value: "custom" }
        ]
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "embedUrl",
      title: "Embed URL",
      type: "url"
    }),
    defineField({
      name: "embedCode",
      title: "Embed code",
      type: "text",
      rows: 6
    }),
    defineField({ name: "title", title: "Title", type: "string" })
  ]
});
