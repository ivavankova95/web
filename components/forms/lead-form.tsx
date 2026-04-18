"use client";

import { useRef, useState } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

type LeadFormProps = {
  formKey: string;
  title: string;
  description: string;
};

export function LeadForm({ formKey, title, description }: LeadFormProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | undefined>(undefined);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!turnstileToken) {
      setMessage("Prosím počkejte na dokončení bezpečnostní kontroly.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      formKey,
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      sourcePage: window.location.pathname,
      turnstileToken,
    };

    try {
      const response = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        ok: boolean;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        setMessage(data.error ?? "Něco se pokazilo. Zkus to prosím znovu.");
        turnstileRef.current?.reset();
        setTurnstileToken(null);
        return;
      }

      setMessage("Děkujeme! Ozveme se vám co nejdříve.");
    } catch {
      setMessage("Něco se pokazilo. Zkus to prosím znovu.");
      turnstileRef.current?.reset();
      setTurnstileToken(null);
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
      <form onSubmit={handleSubmit}>
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
        <Turnstile
          ref={turnstileRef}
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
          onSuccess={setTurnstileToken}
          onExpire={() => { setTurnstileToken(null); }}
        />
        <button className="button-secondary" disabled={isSubmitting || !turnstileToken} type="submit">
          {isSubmitting ? "Odesílám..." : "Odeslat"}
        </button>
      </form>
      {message ? <p className="muted">{message}</p> : null}
    </div>
  );
}
