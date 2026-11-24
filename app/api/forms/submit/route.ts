import { NextResponse } from "next/server";
import { z } from "zod";
import { getFormLabel } from "@/lib/forms";
import { sendInquiry, verifyTurnstile } from "@/lib/inquiries";

const leadSchema = z.object({
  formKey: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1),
  phone: z.string().optional(),
  sourcePage: z.string().min(1),
  turnstileToken: z.string().min(1)
});

export async function POST(request: Request) {
  const parsed = leadSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { formKey, name, email, phone, sourcePage, turnstileToken } = parsed.data;
  if (!(await verifyTurnstile(turnstileToken))) {
    return NextResponse.json(
      { ok: false, error: "Ověření bezpečnostní kontroly selhalo." },
      { status: 403 }
    );
  }

  const label = getFormLabel(formKey);
  if (!label) {
    return NextResponse.json({ ok: false, error: "Unknown form key" }, { status: 404 });
  }

  const error = await sendInquiry({
    name,
    email,
    subject: `Nová poptávka – ${label}`,
    details: phone ? [["Telefon", phone], ["Stránka", sourcePage]] : [["Stránka", sourcePage]]
  });
  if (error) {
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    message: "Děkujeme! Ozveme se vám co nejdříve."
  });
}
