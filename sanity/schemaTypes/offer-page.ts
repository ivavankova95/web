import { defineArrayMember, defineField, defineType } from "sanity";
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
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string" })
      ]
    }),
    defineField({
      name: "productPrice",
      title: "Product price (text, např. \"990 Kč\")",
      type: "string"
    }),
    defineField({
      name: "whatYouGet",
      title: "What you get (co dostaneš)",
      type: "array",
      of: [
        defineArrayMember({
          name: "whatYouGetItem",
          title: "Item",
          type: "object",
          fields: [
            defineField({ name: "text", title: "Text", type: "string", validation: (Rule) => Rule.required() })
          ],
          preview: { select: { title: "text" } }
        })
      ]
    }),
    defineField({
      name: "forWhom",
      title: "For whom (pro koho)",
      type: "array",
      of: [
        defineArrayMember({
          name: "forWhomItem",
          title: "Item",
          type: "object",
          fields: [
            defineField({ name: "text", title: "Text", type: "string", validation: (Rule) => Rule.required() })
          ],
          preview: { select: { title: "text" } }
        })
      ]
    }),
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
    defineField({
      name: "referenceImages",
      title: "Reference images (proměny, screenshoty referencí)",
      type: "array",
      of: [
        defineArrayMember({
          name: "referenceImage",
          title: "Image",
          type: "image",
          options: { hotspot: false },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string" })
          ]
        })
      ]
    }),
    createPageBuilderField(),
    createSeoField(),
    createMigrationSourceField()
  ]
});
