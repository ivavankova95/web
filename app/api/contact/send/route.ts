import { NextResponse } from "next/server";
import { z } from "zod";
import { sendInquiry, verifyTurnstile } from "@/lib/inquiries";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
  turnstileToken: z.string().min(1)
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Neplatná data formuláře." },
      { status: 400 }
    );
  }

  const { name, email, message, turnstileToken } = parsed.data;
  if (!(await verifyTurnstile(turnstileToken))) {
    return NextResponse.json(
      { ok: false, error: "Ověření bezpečnostní kontroly selhalo." },
      { status: 403 }
    );
  }

  const error = await sendInquiry({
    name,
    email,
    subject: `Nová zpráva od ${name.replace(/[\r\n]+/g, " ")}`,
    details: [["Zpráva", message]]
  });
  if (error) {
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
