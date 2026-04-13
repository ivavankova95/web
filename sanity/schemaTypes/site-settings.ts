import { defineArrayMember, defineField, defineType } from "sanity";
import { createMigrationSourceField, createSeoField } from "@/sanity/schemaTypes/shared";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Site title",
      type: "string",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "siteDescription",
      title: "Site description",
      type: "text",
      rows: 3
    }),
    defineField({ name: "siteUrl", title: "Site URL", type: "url" }),
    defineField({ name: "appUrl", title: "External app URL", type: "url" }),
    defineField({ name: "contactEmail", title: "Contact email", type: "string" }),
    defineField({ name: "contactPhone", title: "Contact phone", type: "string" }),
    defineField({ name: "gtmId", title: "GTM ID", type: "string" }),
    defineField({ name: "ga4MeasurementId", title: "GA4 measurement ID", type: "string" }),
    defineField({ name: "metaPixelId", title: "Meta Pixel ID", type: "string" }),
    defineField({ name: "hotjarId", title: "Hotjar ID", type: "string" }),
    defineField({ name: "cookieScriptId", title: "Cookie Script ID", type: "string" }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [defineArrayMember({ type: "navigationItem" })]
    }),
    createSeoField(),
    createMigrationSourceField()
  ]
});
