import { defineField, defineType } from "sanity";

export const formBlockSchema = defineType({
  name: "formBlock",
  title: "Form block",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4
    }),
    defineField({
      name: "formKey",
      title: "Form key",
      type: "string",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "submitLabel",
      title: "Submit label",
      type: "string",
      initialValue: "Odeslat"
    }),
    defineField({
      name: "successMode",
      title: "Success mode",
      type: "string",
      options: {
        list: [
          { title: "Inline message", value: "inline" },
          { title: "External redirect", value: "redirect" }
        ]
      },
      initialValue: "inline"
    }),
    defineField({
      name: "successRedirectUrl",
      title: "Success redirect URL",
      type: "string",
      hidden: ({ parent }) => parent?.successMode !== "redirect"
    }),
    defineField({
      name: "privacyNote",
      title: "Privacy note",
      type: "text",
      rows: 3
    })
  ]
});
