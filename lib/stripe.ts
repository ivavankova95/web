import Stripe from "stripe";
import { env } from "@/lib/env";

type CreateCheckoutSessionArgs = {
  productKey: string;
  sourcePage: string;
  customerEmail?: string;
  priceId: string;
};

export function getStripeCheckoutConfig(productKey: string) {
  const configs: Record<string, { priceId: string; productsLabel: string }> = {
    ebook_jak_sestavit_jidelnicek: {
      priceId: env.stripePriceIdEbook,
      productsLabel: "ebook"
    },
    osobni_konzultace: {
      priceId: env.stripePriceIdOsobniKonzultace,
      productsLabel: "konzultace"
    },
    pruvodce_vyzivou_a_pohybem: {
      priceId: env.stripePriceIdPruvodce,
      productsLabel: "pruvodce"
    }
  };

  return configs[productKey];
}

export function getStripeClient() {
  if (!env.stripeSecretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY.");
  }

  return new Stripe(env.stripeSecretKey);
}

export const stripe = new Stripe(env.stripeSecretKey || "placeholder", {
  apiVersion: "2026-03-25.dahlia"
});

export async function createCheckoutSession({
  productKey,
  sourcePage,
  customerEmail,
  priceId
}: CreateCheckoutSessionArgs) {
  const stripe = getStripeClient();
  const config = getStripeCheckoutConfig(productKey);

  return stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${env.siteUrl}/?checkout=success`,
    cancel_url: `${env.siteUrl}${sourcePage}`,
    customer_email: customerEmail,
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    metadata: {
      product_key: productKey,
      products: config?.productsLabel ?? productKey,
      source_page: sourcePage
    }
  });
}
