import { defineArrayMember, defineField, defineType } from "sanity";

export const testimonialBlockSchema = defineType({
  name: "testimonialBlock",
  title: "Testimonial block",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "items",
      title: "Testimonials",
      type: "array",
      of: [
        defineArrayMember({
          name: "testimonialItem",
          title: "Testimonial item",
          type: "object",
          fields: [
            defineField({
              name: "quote",
              title: "Quote",
              type: "text",
              rows: 4,
              validation: (Rule) => Rule.required()
            }),
            defineField({
              name: "author",
              title: "Author",
              type: "string"
            }),
            defineField({
              name: "context",
              title: "Context",
              type: "string"
            })
          ],
          preview: {
            select: {
              title: "author",
              subtitle: "quote"
            }
          }
        })
      ]
    })
  ]
});
