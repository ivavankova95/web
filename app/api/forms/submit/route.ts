import { NextResponse } from "next/server";
import { z } from "zod";
import { formRegistry } from "@/lib/forms";

const leadSchema = z.object({
  formKey: z.string().min(1),
  email: z.email(),
  name: z.string().min(1),
  phone: z.string().optional(),
  sourcePage: z.string().min(1)
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const config = formRegistry[parsed.data.formKey];

  if (!config) {
    return NextResponse.json(
      { ok: false, error: "Unknown form key" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    mode: "scaffold",
    formKey: parsed.data.formKey,
    mappedGroupId: config.mailerLiteGroupId,
    nextStep: "Implement MailerLite or Make submission in this route.",
    payload: parsed.data
  });
}

