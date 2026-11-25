"use client";

import Link from "next/link";
import { useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import styles from "./newsletter.module.css";

const endpoint = "https://app.zdravimebavi.cz/api/newsletter";
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const errorMessage = "Zkus to prosím za chvíli znovu. Pokud potíže trvají, napiš mi na info@zdravimebavi.cz.";

function subscribeToHash(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

async function post(action: "request" | "confirm", payload: object) {
  return fetch(`${endpoint}/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "omit",
    referrerPolicy: "no-referrer",
  });
}

export function NewsletterForm({ preview }: { preview: boolean }) {
  const hash = useSyncExternalStore(subscribeToHash, () => window.location.hash, () => "");
  const token = new URLSearchParams(hash.slice(1)).get("potvrzeni");
  const [challenge, setChallenge] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "confirmed">("idle");
  const [error, setError] = useState("");
  const turnstile = useRef<TurnstileInstance | undefined>(undefined);

  async function request(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!challenge || preview) return;
    const data = new FormData(event.currentTarget);
    setError("");
    setState("sending");
    try {
      const response = await post("request", {
        email: String(data.get("email") ?? "").trim(),
        consent: data.has("consent"),
        challenge,
      });
      if (response.status !== 202) throw new Error();
      setState("sent");
    } catch {
      setError(`Potvrzovací e-mail se nepodařilo odeslat. ${errorMessage}`);
      setState("idle");
      setChallenge("");
      turnstile.current?.reset();
    }
  }

  async function confirm() {
    if (preview) return;
    setError("");
    setState("sending");
    try {
      const response = await post("confirm", { token });
      if (response.status === 410) {
        setError("Platnost odkazu vypršela. Vyžádej si prosím nový potvrzovací e-mail.");
        setState("idle");
        return;
      }
      if (!response.ok) throw new Error();
      setState("confirmed");
      window.history.replaceState(window.history.state, "", window.location.pathname);
      window.dispatchEvent(new Event("hashchange"));
    } catch {
      setError(`Odběr se nepodařilo potvrdit. ${errorMessage}`);
      setState("idle");
    }
  }

  if (token === null && (state === "sent" || state === "confirmed")) {
    return (
      <div className={styles.card} role="status" aria-live="polite">
        {state === "sent" ? (
          <>
            <h2>Zkontroluj e-mail</h2>
            <p>Pokud pro tuto adresu ještě nemáš platný odkaz ani potvrzený odběr, přijde ti potvrzovací e-mail. Odkaz platí 24 hodin.</p>
            <p>Pokud zprávu nenajdeš, zkus zkontrolovat spam nebo hromadnou poštu.</p>
          </>
        ) : (
          <>
            <h2>Děkuju za potvrzení</h2>
            <p>Tvou volbu jsme zaznamenali.</p>
          </>
        )}
      </div>
    );
  }

  if (token !== null) {
    const valid = /^[0-9a-f]{64}$/.test(token);
    return (
      <div className={styles.card}>
        <h2>Potvrzení odběru</h2>
        {valid ? (
          <>
            <p>Kliknutím potvrdíš, že chceš dostávat novinky od Ivy na svou e-mailovou adresu.</p>
            <button className="btn btn-primary" type="button" onClick={confirm} disabled={preview || state === "sending"}>
              {state === "sending" ? "Potvrzuji…" : "Potvrdit odběr"}
            </button>
          </>
        ) : <p>Potvrzovací odkaz je neúplný.</p>}
        {error && <p className={styles.error} role="alert">{error}</p>}
        <a className={styles.textLink} href="/odber-novinek">Vyžádat nový odkaz</a>
      </div>
    );
  }

  return (
    <form className={styles.card} onSubmit={request} aria-label="Odběr novinek od Ivy" aria-busy={state === "sending"}>
      <label htmlFor="newsletter-email">E-mailová adresa</label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        autoComplete="email"
        maxLength={254}
        placeholder="např. jana@email.cz"
        required
      />
      <label className={styles.consent}>
        <input type="checkbox" name="consent" required />
        <span>Souhlasím, aby mi Iva Vaňková posílala e-mailem tipy, novinky a nabídky Zdraví mě baví.</span>
      </label>
      <p className={styles.note}>
        Odběr můžeš kdykoli zrušit odkazem v e-mailu. Přečti si,{" "}
        <Link href="/gdpr#odber-novinek">jak zpracováváme osobní údaje</Link>.
      </p>
      {siteKey && !preview && (
        <Turnstile
          ref={turnstile}
          siteKey={siteKey}
          options={{ action: "newsletter", language: "cs", appearance: "interaction-only", size: "flexible" }}
          onSuccess={setChallenge}
          onError={() => {
            setChallenge("");
            setError("Ověření se nepodařilo načíst. Obnov prosím stránku a zkus to znovu.");
          }}
          onExpire={() => setChallenge("")}
        />
      )}
      {preview && <p className={styles.note}>V náhledu je odesílání vypnuté.</p>}
      {!siteKey && !preview && <p role="status" className={styles.note}>Přihlášení k odběru je teď nedostupné.</p>}
      {error && <p className={styles.error} role="alert">{error}</p>}
      <button className="btn btn-primary" type="submit" disabled={!challenge || state === "sending"}>
        {state === "sending" ? "Odesílám…" : "Chci dostávat novinky"}
      </button>
    </form>
  );
}
