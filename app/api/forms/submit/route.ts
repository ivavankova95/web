import { NextResponse } from "next/server";
import { z } from "zod";
import { formRegistry } from "@/lib/forms";
import { env } from "@/lib/env";

const leadSchema = z.object({
  formKey: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1),
  phone: z.string().optional(),
  sourcePage: z.string().min(1),
  turnstileToken: z.string().min(1),
});

async function verifyTurnstile(token: string): Promise<boolean> {
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: env.turnstileSecretKey,
      response: token,
    }),
  });
  const data = (await res.json()) as { success: boolean };
  return data.success;
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const turnstileOk = await verifyTurnstile(parsed.data.turnstileToken);
  if (!turnstileOk) {
    return NextResponse.json(
      { ok: false, error: "Ověření bezpečnostní kontroly selhalo." },
      { status: 403 }
    );
  }

  const config = formRegistry[parsed.data.formKey];

  if (!config) {
    return NextResponse.json(
      { ok: false, error: "Unknown form key" },
      { status: 404 }
    );
  }

  if (env.makeAutomationWebhookUrl) {
    try {
      await fetch(env.makeAutomationWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formKey: parsed.data.formKey,
          email: parsed.data.email,
          name: parsed.data.name,
          sourcePage: parsed.data.sourcePage,
          mailerLiteGroupId: config.mailerLiteGroupId,
          timestamp: new Date().toISOString()
        })
      });
    } catch (err) {
      console.error("Failed to forward lead to Make:", err);
    }
  }

  return NextResponse.json({
    ok: true,
    message: "Děkujeme! Ozveme se vám co nejdříve."
  });
}
