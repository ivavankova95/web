"use client";

import { useRef, useState } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import styles from "./osobni-konzultace.module.css";

type FormState = "idle" | "submitting" | "success" | "error";

export function OsobniKonzultaceForm() {
  const [state, setState] = useState<FormState>("idle");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | undefined>(undefined);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!turnstileToken) { setState("error"); return; }
    setState("submitting");

    const formData = new FormData(e.currentTarget);
    const payload = {
      formKey: "osobni_konzultace",
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("topic") ?? ""),
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
        Moc děkuji za tvůj zájem! Pošlu ti e-mail s dostupnými termíny co nejdříve.
      </p>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="name">Jméno*</label>
        <input id="name" name="name" type="text" placeholder="Tvoje jméno" required />
      </div>
      <div className={styles.field}>
        <label htmlFor="email">Email*</label>
        <input id="email" name="email" type="email" placeholder="Tvůj Email" required />
      </div>
      <div className={styles.field}>
        <label htmlFor="topic">Téma konzultace*</label>
        <textarea
          id="topic"
          name="topic"
          placeholder="Tady je prostor pro tvou zprávu"
          required
          rows={5}
        />
      </div>

      <p className={styles.priceInfo}>
        Konzultace trvá přibližně <strong>60 minut</strong>. Její cena je{" "}
        <strong>1 500 Kč</strong> a zahrnuje i podrobné zpracování vstupního dotazníku
        (takže bude konzultace <strong>maximálně efektivní</strong>) a{" "}
        <strong>zaslání důležitých materiálů</strong> po konzultaci. Konzultaci je potřeba
        zaplatit předem převodem na účet nebo kartou. Údaje k platbě ti pošlu na e-mail, až
        si domluvíme termín konzultace.
      </p>

      <div className={styles.checkboxField}>
        <input type="checkbox" id="terms" name="terms" required />
        <label htmlFor="terms">Souhlasím s Obchodními podmínkami*</label>
      </div>
      <div className={styles.checkboxField}>
        <input type="checkbox" id="gdpr" name="gdpr" required />
        <label htmlFor="gdpr">Souhlasím s Podmínkami ochrany osobních údajů*</label>
      </div>
      <p className={styles.requiredNote}>* Povinný údaj</p>

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
        className={styles.submitBtn}
        disabled={state === "submitting" || !turnstileToken}
      >
        {state === "submitting" ? "Odesílám…" : "CHCI OSOBNÍ KONZULTACI"}
      </button>
    </form>
  );
}
