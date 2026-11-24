import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  try {
    stripe.webhooks.constructEvent(
      body,
      signature,
      env.stripeWebhookSecret || ""
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  return NextResponse.json({ received: true });
}
