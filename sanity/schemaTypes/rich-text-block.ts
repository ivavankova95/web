import { defineField, defineType } from "sanity";
import { createPortableTextField } from "@/sanity/schemaTypes/shared";

export const richTextBlockSchema = defineType({
  name: "richTextBlock",
  title: "Rich text block",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Section title", type: "string" }),
    createPortableTextField("content", "Content")
  ],
  preview: {
    select: {
      title: "title"
    },
    prepare({ title }) {
      return {
        title: title || "Rich text block"
      };
    }
  }
});
