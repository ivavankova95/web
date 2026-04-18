"use client";

import { useState } from "react";

type ContactFormState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<ContactFormState>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/contact/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { ok: boolean; error?: string };

      if (!response.ok || !data.ok) {
        setState("error");
        return;
      }

      setState("success");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <p className="page-lead">
        Děkuji za zprávu. Ozvu se ti co nejdříve.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Jméno
        <input
          name="name"
          placeholder="Tvoje jméno"
          required
          type="text"
        />
      </label>
      <label>
        Email
        <input
          name="email"
          placeholder="Tvůj email"
          required
          type="email"
        />
      </label>
      <label>
        Zpráva
        <textarea
          name="message"
          placeholder="Tady je prostor pro tvou zprávu"
          required
          rows={5}
        />
      </label>
      {state === "error" && (
        <p className="muted" style={{ color: "var(--color-error, #c0392b)" }}>
          Ups! Něco se pokazilo. Zkus to prosím znovu.
        </p>
      )}
      <button className="btn btn-primary" disabled={state === "submitting"} type="submit">
        {state === "submitting" ? "Odesílám..." : "Odeslat"}
      </button>
    </form>
  );
}
