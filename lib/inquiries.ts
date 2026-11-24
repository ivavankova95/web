import { Resend } from "resend";
import { env } from "@/lib/env";

export async function verifyTurnstile(token: string): Promise<boolean> {
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({
        secret: env.turnstileSecretKey,
        response: token
      })
    });

    if (!response.ok) return false;
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type Inquiry = {
  name: string;
  email: string;
  subject: string;
  details: Array<[label: string, value: string]>;
};

export async function sendInquiry({ name, email, subject, details }: Inquiry) {
  if (!env.resendApiKey) {
    console.error("RESEND_API_KEY is not set");
    return "Chyba konfigurace serveru.";
  }

  const fields: Inquiry["details"] = [["Jméno", name], ["Email", email], ...details];
  const resend = new Resend(env.resendApiKey);
  const { error } = await resend.emails.send({
    from: "noreply@zdravimebavi.cz",
    to: "info@zdravimebavi.cz",
    replyTo: email,
    subject,
    html: fields
      .map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value).replace(/\n/g, "<br>")}</p>`)
      .join("\n"),
    text: fields.map(([label, value]) => `${label}: ${value}`).join("\n")
  });

  if (error) {
    console.error("Inquiry delivery failed:", error.name);
    return "Nepodařilo se odeslat zprávu.";
  }

  return null;
}
