import { groq } from "next-sanity";

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]
`;

export const navigationQuery = groq`
  *[_type == "navigation"][0]
`;

export const footerQuery = groq`
  *[_type == "footer"][0]
`;

export const homePageQuery = groq`
  *[_type == "page" && pageKey == "home"][0]
`;

export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0]
`;

export const servicePageBySlugQuery = groq`
  *[_type == "servicePage" && slug.current == $slug][0] {
    _id,
    title,
    excerpt,
    slug,
    serviceKey,
    leadFormKey,
    heroImage { asset, alt },
    benefits[] { _key, text },
    steps[] { _key, title, description },
    testimonials[] { _key, quote, author },
    pageBuilder,
    seo
  }
`;

export const offerPageBySlugQuery = groq`
  *[_type == "offerPage" && slug.current == $slug][0] {
    _id,
    title,
    excerpt,
    slug,
    productKey,
    checkoutMode,
    stripePriceId,
    heroImage { asset, alt },
    productPrice,
    whatYouGet[] { _key, text },
    forWhom[] { _key, text },
    pageBuilder,
    seo
  }
`;

export const legalPageBySlugQuery = groq`
  *[_type == "legalPage" && slug.current == $slug][0]
`;

export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage { asset, alt },
    categories[]->{ _id, title, slug },
    ingredientTables[] {
      _key,
      title,
      rows[] { _key, name, amount }
    },
    content,
    seo
  }
`;

export const allBlogPostsQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage { asset, alt },
    categories[]->{ _id, title, slug },
    seo
  }
`;

export const allBlogPostSlugsQuery = groq`
  *[_type == "blogPost"].slug.current
`;

export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    seo
  }
`;

export const allCategoriesQuery = groq`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    "articleCount": count(*[_type == "blogPost" && references(^._id)])
  }
`;

export const categoryArticlesBySlugQuery = groq`
  *[_type == "blogPost" && $slug in categories[]->slug.current] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage { asset, alt },
    categories[]->{ _id, title, slug },
    seo
  }
`;
