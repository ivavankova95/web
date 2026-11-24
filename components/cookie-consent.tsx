"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import {
  consentEndpoint,
  consentLifetime,
  consentSubmissionDays,
  consentVersion,
  createConsentId,
  dayInMilliseconds,
  hasOptionalCookies,
  noOptionalCookies,
  sameCookiePreferences,
  utcDay,
  type ConsentChoice,
  type ConsentReceipt,
} from "@/lib/cookie-consent-evidence";
import { applyTrackingPreferences, type CookiePreferences } from "@/lib/web-tracking";
import styles from "./cookie-consent.module.css";

const storageKey = "zmb-cookie-preferences-v2";
const changeEvent = "zmb-cookie-preferences-change";
type SavedChoice = {
  preferences: CookiePreferences;
  receiptId: string | null;
  savedAt: number;
  pending?: ConsentChoice;
};
let sessionPreference: string | null = null;

function readPreference() {
  try {
    return sessionPreference ?? window.localStorage.getItem(storageKey);
  } catch {
    return sessionPreference;
  }
}

function parsePreference(raw: string | null | undefined): SavedChoice | null {
  if (!raw) return null;
  try {
    const choice = JSON.parse(raw) as SavedChoice;
    if (
      typeof choice?.preferences?.analytics === "boolean" &&
      typeof choice.preferences.marketing === "boolean" &&
      Number.isFinite(choice.savedAt) &&
      choice.savedAt <= Date.now() &&
      (choice.receiptId || !hasOptionalCookies(choice.preferences))
    ) {
      if (Date.now() - choice.savedAt < consentLifetime) return choice;
      if (choice.pending) return { ...choice, preferences: noOptionalCookies };
    }
  } catch {
    return null;
  }
  return null;
}

function subscribe(listener: () => void) {
  window.addEventListener(changeEvent, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(changeEvent, listener);
    window.removeEventListener("storage", listener);
  };
}

function serverPreference() {
  return undefined;
}

function storePreference(choice: SavedChoice) {
  const value = JSON.stringify(choice);
  try {
    window.localStorage.setItem(storageKey, value);
    sessionPreference = null;
  } catch {
    sessionPreference = value;
  }
  window.dispatchEvent(new Event(changeEvent));
}

export function CookieConsent() {
  const raw = useSyncExternalStore(subscribe, readPreference, serverPreference);
  const choice = parsePreference(raw);
  const preferences = choice?.pending ?? choice?.preferences;
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [failedId, setFailedId] = useState<string>();
  const attemptedId = useRef<string | undefined>(undefined);
  const settingsButton = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const pending = choice?.pending;
  const failed = pending && failedId === pending.id;
  const visible = raw !== undefined && (open || ((!choice || pending) && !dismissed));

  function submitPending(pending: ConsentChoice) {
    if (attemptedId.current === pending.id) return;
    attemptedId.current = pending.id;
    setFailedId(undefined);

    void fetch(consentEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pending),
      keepalive: true,
      signal: AbortSignal.timeout(6000),
    }).then(async (response) => {
      if (!response.ok) throw new Error("Consent recording failed");
      const receipt = await response.json() as ConsentReceipt;
      if (receipt.id !== pending.id || !Number.isFinite(Date.parse(receipt.recordedAt))) {
        throw new Error("Invalid consent receipt");
      }
      if (parsePreference(readPreference())?.pending?.id === pending.id) {
        const { analytics, marketing } = pending;
        storePreference({ preferences: { analytics, marketing }, receiptId: receipt.id, savedAt: Date.now() });
      }
    }).catch(() => {
      if (parsePreference(readPreference())?.pending?.id === pending.id) setFailedId(pending.id);
    });
  }

  function retryPending() {
    const current = parsePreference(readPreference());
    if (!current?.pending) return;
    const { pending } = current;
    if (pending.id.slice(0, 10) < utcDay(Date.now() - consentSubmissionDays * dayInMilliseconds)) {
      const replacement = { ...pending, id: createConsentId() };
      storePreference({ ...current, pending: replacement });
      submitPending(replacement);
      return;
    }
    attemptedId.current = undefined;
    submitPending(pending);
  }

  useEffect(() => {
    if (raw === undefined) return;
    const saved = parsePreference(raw);
    applyTrackingPreferences(saved?.preferences ?? null);
  }, [raw]);

  useEffect(() => {
    // Pick up a write interrupted by a reload, and retry once when connectivity returns.
    function resume() {
      const waiting = parsePreference(readPreference())?.pending;
      if (waiting) {
        if (waiting.id.slice(0, 10) < utcDay(Date.now() - consentSubmissionDays * dayInMilliseconds)) {
          setFailedId(waiting.id);
          return;
        }
        submitPending(waiting);
      }
    }
    queueMicrotask(resume);
    function reconnect() {
      attemptedId.current = undefined;
      resume();
    }
    window.addEventListener("online", reconnect);
    return () => window.removeEventListener("online", reconnect);
  }, []);

  useEffect(() => {
    if (open) heading.current?.focus();
  }, [open]);

  function dismiss() {
    setDismissed(true);
    setOpen(false);
    setCustomizing(false);
    if (open) settingsButton.current?.focus();
  }

  function save(preference: CookiePreferences) {
    const current = parsePreference(readPreference());
    const effective = current?.preferences ?? noOptionalCookies;
    if (!current?.pending && sameCookiePreferences(effective, preference)) {
      if (!current) storePreference({ preferences: preference, receiptId: null, savedAt: Date.now() });
      dismiss();
      return;
    }
    if (current?.pending && sameCookiePreferences(current.pending, preference)) {
      if (failed) retryPending();
      return;
    }

    const pending: ConsentChoice = {
      ...preference,
      id: createConsentId(),
      previousId: current?.pending?.id ?? current?.receiptId ?? null,
      version: consentVersion,
    };
    storePreference({
      preferences: {
        analytics: effective.analytics && preference.analytics,
        marketing: effective.marketing && preference.marketing,
      },
      receiptId: current?.receiptId ?? null,
      savedAt: current?.savedAt ?? Date.now(),
      pending,
    });
    submitPending(pending);
    setOpen(false);
    setDismissed(false);
  }

  function saveSelection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    save({ analytics: form.has("analytics"), marketing: form.has("marketing") });
  }

  return (
    <>
      <button
        type="button"
        ref={settingsButton}
        aria-controls={visible ? "cookie-preferences" : undefined}
        aria-expanded={visible}
        className={styles.settings}
        onClick={() => {
          setOpen(true);
          setCustomizing(true);
          heading.current?.focus();
        }}
      >
        Nastavení cookies
      </button>
      {visible && (
        <section id="cookie-preferences" aria-labelledby="cookie-preferences-title" className={styles.panel}>
          <div className={styles.header}>
            <h2 id="cookie-preferences-title" ref={heading} tabIndex={-1}>Nastavení cookies</h2>
            <button type="button" className={styles.close} aria-label="Zavřít nastavení cookies" onClick={dismiss}>×</button>
          </div>
          <p>
            Nezbytné nástroje zajišťují fungování webu. Analytiku a měření reklamy můžete
            povolit nebo odmítnout. <Link href="/cookies">Informace o cookies</Link>
          </p>
          {pending && (
            <p role="status">
              {failed ? "Zápis volby se nezdařil. Vypnuté kategorie zůstávají vypnuté." : "Ukládáme vaši volbu."}
              {failed && (
                <> <button type="button" className={styles.customize} onClick={retryPending}>Zkusit uložit znovu</button></>
              )}
            </p>
          )}
          <div className={styles.actions}>
            <button type="button" onClick={() => save({ analytics: false, marketing: false })}>Odmítnout volitelné</button>
            <button type="button" onClick={() => save({ analytics: true, marketing: true })}>Povolit volitelné</button>
          </div>
          {customizing ? (
            <form key={raw ?? "new"} onSubmit={saveSelection} className={styles.options}>
              <fieldset>
                <legend>Volitelné kategorie</legend>
                <label>
                  <input type="checkbox" name="analytics" defaultChecked={preferences?.analytics} />
                  <span><strong>Analytika</strong><small>Google Analytics a Hotjar</small></span>
                </label>
                <label>
                  <input type="checkbox" name="marketing" defaultChecked={preferences?.marketing} />
                  <span><strong>Marketing</strong><small>Meta Pixel</small></span>
                </label>
              </fieldset>
              <div className={styles.optionActions}>
                <button type="submit">Uložit výběr</button>
              </div>
            </form>
          ) : (
            <button type="button" className={styles.customize} onClick={() => setCustomizing(true)}>
              Nastavit jednotlivě
            </button>
          )}
        </section>
      )}
    </>
  );
}
