import { defineArrayMember, defineField, defineType } from "sanity";

export const faqBlockSchema = defineType({
  name: "faqBlock",
  title: "FAQ block",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "items",
      title: "FAQ items",
      type: "array",
      of: [
        defineArrayMember({
          name: "faqItem",
          title: "FAQ item",
          type: "object",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              validation: (Rule) => Rule.required()
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "text",
              rows: 5,
              validation: (Rule) => Rule.required()
            })
          ],
          preview: {
            select: {
              title: "question"
            }
          }
        })
      ]
    })
  ]
});
