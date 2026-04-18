import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { env } from "@/lib/env";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
  turnstileToken: z.string().min(1),
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Neplatná data formuláře." },
      { status: 400 }
    );
  }

  const { name, email, message, turnstileToken } = parsed.data;

  const turnstileOk = await verifyTurnstile(turnstileToken);
  if (!turnstileOk) {
    return NextResponse.json(
      { ok: false, error: "Ověření bezpečnostní kontroly selhalo." },
      { status: 403 }
    );
  }

  if (!env.resendApiKey) {
    console.error("RESEND_API_KEY is not set");
    return NextResponse.json(
      { ok: false, error: "Chyba konfigurace serveru." },
      { status: 500 }
    );
  }

  const resend = new Resend(env.resendApiKey);

  const { error } = await resend.emails.send({
    from: "noreply@zdravimebavi.cz",
    to: "info@zdravimebavi.cz",
    replyTo: email,
    subject: `Nová zpráva od ${escapeHtml(name)}`,
    html: `
      <p><strong>Jméno:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Zpráva:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    `,
    text: `Jméno: ${name}\nEmail: ${email}\n\nZpráva:\n${message}`,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { ok: false, error: "Nepodařilo se odeslat zprávu." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
