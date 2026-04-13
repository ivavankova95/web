import { siteSettingsSchema } from "@/sanity/schemaTypes/site-settings";
import { navigationSchema } from "@/sanity/schemaTypes/navigation";
import { footerSchema } from "@/sanity/schemaTypes/footer";
import { pageSchema } from "@/sanity/schemaTypes/page";
import { servicePageSchema } from "@/sanity/schemaTypes/service-page";
import { offerPageSchema } from "@/sanity/schemaTypes/offer-page";
import { blogPostSchema } from "@/sanity/schemaTypes/blog-post";
import { categorySchema } from "@/sanity/schemaTypes/category";
import { legalPageSchema } from "@/sanity/schemaTypes/legal-page";
import { seoSchema } from "@/sanity/schemaTypes/seo";
import { navigationItemSchema } from "@/sanity/schemaTypes/navigation-item";
import { heroBlockSchema } from "@/sanity/schemaTypes/hero-block";
import { richTextBlockSchema } from "@/sanity/schemaTypes/rich-text-block";
import { ctaBlockSchema } from "@/sanity/schemaTypes/cta-block";
import { imageBlockSchema } from "@/sanity/schemaTypes/image-block";
import { formBlockSchema } from "@/sanity/schemaTypes/form-block";
import { embedBlockSchema } from "@/sanity/schemaTypes/embed-block";
import { testimonialBlockSchema } from "@/sanity/schemaTypes/testimonial-block";
import { faqBlockSchema } from "@/sanity/schemaTypes/faq-block";
import { migrationSourceSchema } from "@/sanity/schemaTypes/migration-source";
import { migrationImageSchema } from "@/sanity/schemaTypes/migration-image";

export const schemaTypes = [
  migrationSourceSchema,
  migrationImageSchema,
  siteSettingsSchema,
  navigationSchema,
  footerSchema,
  pageSchema,
  servicePageSchema,
  offerPageSchema,
  blogPostSchema,
  categorySchema,
  legalPageSchema,
  seoSchema,
  navigationItemSchema,
  heroBlockSchema,
  richTextBlockSchema,
  ctaBlockSchema,
  imageBlockSchema,
  formBlockSchema,
  embedBlockSchema,
  testimonialBlockSchema,
  faqBlockSchema
];
