import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.stripeWebhookSecret || ""
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Forward to Make (or Base44 if needed)
    // The payload structure follows what Make expects based on analysis/dom-trees blueprints
    const payload = {
      event: "checkout.session.completed",
      id: session.id,
      email: session.customer_details?.email,
      name: session.customer_details?.name,
      amount: session.amount_total,
      currency: session.currency,
      metadata: session.metadata,
      payment_status: session.payment_status
    };

    if (env.makeAutomationWebhookUrl) {
      try {
        await fetch(env.makeAutomationWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.error("Failed to forward to Make:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
