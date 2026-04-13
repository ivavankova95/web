import { NextResponse } from "next/server";
import { z } from "zod";
import { createCheckoutSession, getStripeCheckoutConfig } from "@/lib/stripe";

const checkoutSchema = z.object({
  productKey: z.string().min(1),
  sourcePage: z.string().min(1),
  customerEmail: z.email().optional()
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid checkout payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const config = getStripeCheckoutConfig(parsed.data.productKey);

  if (!config?.priceId) {
    return NextResponse.json(
      {
        ok: false,
        error: "Stripe price ID is not configured",
        productKey: parsed.data.productKey
      },
      { status: 503 }
    );
  }

  const session = await createCheckoutSession({
    productKey: parsed.data.productKey,
    sourcePage: parsed.data.sourcePage,
    customerEmail: parsed.data.customerEmail,
    priceId: config.priceId
  });

  return NextResponse.json({
    ok: true,
    checkoutUrl: session.url
  });
}

