"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { applyTrackingPreferences, type CookiePreferences } from "@/lib/web-tracking";
import styles from "./cookie-consent.module.css";

const storageKey = "zmb-cookie-preferences-v1";
const changeEvent = "zmb-cookie-preferences-change";
const preferenceLifetime = 180 * 24 * 60 * 60 * 1_000;
let sessionPreference: string | null = null;

function readPreference() {
  try {
    return sessionPreference ?? window.localStorage.getItem(storageKey);
  } catch {
    return sessionPreference;
  }
}

function parsePreference(raw: string | null | undefined): CookiePreferences | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    if (
      typeof value?.analytics === "boolean" &&
      typeof value.marketing === "boolean" &&
      Number.isFinite(value.savedAt) &&
      value.savedAt <= Date.now() &&
      Date.now() - value.savedAt < preferenceLifetime
    ) {
      return { analytics: value.analytics, marketing: value.marketing };
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

function storePreference(preferences: CookiePreferences) {
  const value = JSON.stringify({ ...preferences, savedAt: Date.now() });
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
  const preferences = parsePreference(raw);
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const settingsButton = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const visible = raw !== undefined && (open || (!preferences && !dismissed));

  useEffect(() => {
    if (raw !== undefined) applyTrackingPreferences(parsePreference(raw));
  }, [raw]);

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
    storePreference(preference);
    dismiss();
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
