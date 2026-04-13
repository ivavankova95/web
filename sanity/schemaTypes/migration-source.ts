import { defineArrayMember, defineField, defineType } from "sanity";

export const migrationSourceSchema = defineType({
  name: "migrationSource",
  title: "Migration source",
  type: "object",
  fields: [
    defineField({ name: "sourceFile", title: "Source file", type: "string" }),
    defineField({ name: "sourceUrl", title: "Source URL", type: "url" }),
    defineField({ name: "sourceSlug", title: "Source slug", type: "string" }),
    defineField({ name: "pageType", title: "Source page type", type: "string" }),
    defineField({ name: "layoutFamily", title: "Layout family", type: "string" }),
    defineField({ name: "generatedAt", title: "Generated at", type: "datetime" }),
    defineField({ name: "productKey", title: "Product key", type: "string" }),
    defineField({
      name: "formKeys",
      title: "Form keys",
      type: "array",
      of: [defineArrayMember({ type: "string" })]
    }),
    defineField({
      name: "notes",
      title: "Migration notes",
      type: "array",
      of: [defineArrayMember({ type: "string" })]
    }),
    defineField({
      name: "pendingAssetCount",
      title: "Pending asset count",
      type: "number"
    })
  ],
  preview: {
    select: {
      title: "sourceFile",
      subtitle: "pageType"
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Migration source",
        subtitle: subtitle || "Snapshot metadata"
      };
    }
  }
});
