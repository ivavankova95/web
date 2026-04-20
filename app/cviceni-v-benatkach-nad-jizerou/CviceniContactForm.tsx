"use client";

import { useRef, useState } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import styles from "./skupinove.module.css";

type FormState = "idle" | "submitting" | "success" | "error";

export function CviceniContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | undefined>(undefined);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!turnstileToken) { setState("error"); return; }
    setState("submitting");

    const formData = new FormData(e.currentTarget);
    const payload = {
      formKey: "skupinove_lekce",
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
      turnstileToken,
    };

    try {
      const response = await fetch("/api/contact/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { ok: boolean };
      if (!response.ok || !data.ok) {
        setState("error");
        turnstileRef.current?.reset();
        setTurnstileToken(null);
        return;
      }
      setState("success");
    } catch {
      setState("error");
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    }
  }

  if (state === "success") {
    return (
      <p style={{ fontSize: "1.1rem", lineHeight: 1.7, color: "var(--color-text)" }}>
        Moc děkuji za tvůj zájem o cvičení! Do 24 hodin ti odpovím na email.
      </p>
    );
  }

  return (
    <form id="contact-form" className={styles.contactForm} onSubmit={handleSubmit}>
      <div className={styles.contactField}>
        <label htmlFor="name">Jméno a příjmení*</label>
        <input id="name" name="name" type="text" placeholder="Tvoje jméno a příjmení" required />
      </div>
      <div className={styles.contactField}>
        <label htmlFor="email">Email*</label>
        <input id="email" name="email" type="email" placeholder="Tvůj Email" required />
      </div>
      <div className={styles.contactField}>
        <label htmlFor="message">Potřebuješ se na něco zeptat nebo mi chceš cokoli sdělit?</label>
        <textarea id="message" name="message" placeholder="Tady je prostor pro tvoje dotazy a poznámky" rows={6} />
      </div>
      <label className={styles.contactCheckbox}>
        <input type="checkbox" name="terms" required />
        Souhlasím s Obchodními podmínkami a Podmínkami ochrany osobních údajů*
      </label>
      <p className={styles.contactRequired}>* Povinný údaj</p>
      <Turnstile
        ref={turnstileRef}
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
        onSuccess={setTurnstileToken}
        onError={() => setState("error")}
        onExpire={() => setTurnstileToken(null)}
      />
      {state === "error" && (
        <p style={{ color: "var(--color-error, #c0392b)", fontSize: "0.95rem" }}>
          Ups! Něco se pokazilo. Zkus to prosím znovu.
        </p>
      )}
      <button
        type="submit"
        className={styles.contactSubmit}
        disabled={state === "submitting" || !turnstileToken}
      >
        {state === "submitting" ? "Odesílám…" : "Ozvi se mi"}
      </button>
    </form>
  );
}
