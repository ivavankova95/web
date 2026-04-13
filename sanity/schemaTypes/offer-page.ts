import { defineField, defineType } from "sanity";
import {
  createExcerptField,
  createMigrationSourceField,
  createPageBuilderField,
  createSeoField,
  createSlugField
} from "@/sanity/schemaTypes/shared";

export const offerPageSchema = defineType({
  name: "offerPage",
  title: "Offer page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required()
    }),
    createSlugField(),
    defineField({ name: "productKey", title: "Product key", type: "string" }),
    createExcerptField(),
    defineField({
      name: "checkoutMode",
      title: "Checkout mode",
      type: "string",
      options: {
        list: [
          { title: "Stripe redirect", value: "stripeRedirect" },
          { title: "Stripe embedded form", value: "stripeEmbedded" },
          { title: "Lead only", value: "leadOnly" }
        ]
      },
      initialValue: "stripeRedirect"
    }),
    defineField({ name: "stripePriceId", title: "Stripe price ID", type: "string" }),
    createPageBuilderField(),
    createSeoField(),
    createMigrationSourceField()
  ]
});
