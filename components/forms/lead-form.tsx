"use client";

import { useState } from "react";

type LeadFormProps = {
  formKey: string;
  title: string;
  description: string;
};

export function LeadForm({ formKey, title, description }: LeadFormProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setMessage(null);

    const payload = {
      formKey,
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      sourcePage: window.location.pathname
    };

    try {
      const response = await fetch("/api/forms/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = (await response.json()) as {
        ok: boolean;
        mappedGroupId?: string;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        setMessage(data.error ?? "Form submission failed.");
        return;
      }

      setMessage(`Form accepted. MailerLite group: ${data.mappedGroupId ?? "not configured"}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unexpected form error.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="surface-card stack" style={{ padding: "2rem" }}>
      {(title || description) && (
        <div className="stack" style={{ gap: "0.5rem" }}>
          {title && <h2>{title}</h2>}
          {description && <p className="page-lead">{description}</p>}
        </div>
      )}
      <form action={handleSubmit}>
        <label>
          Jméno
          <input name="name" placeholder="Vaše jméno" required type="text" />
        </label>
        <label>
          E-mail
          <input name="email" placeholder="vas@email.cz" required type="email" />
        </label>
        <label>
          Telefon
          <input name="phone" placeholder="+420..." type="tel" />
        </label>
        <button className="button-secondary" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Odesílám..." : "Odeslat"}
        </button>
      </form>
      {message ? <p className="muted">{message}</p> : null}
    </div>
  );
}

