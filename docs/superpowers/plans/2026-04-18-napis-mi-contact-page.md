# /napis-mi Contact Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Předělat stránku `/napis-mi` — dvousloupcový layout s kontaktními info a funkčním formulářem (Jméno, Email, Zpráva) odesílajícím email přes Resend.

**Architecture:** Statická page komponenta v `app/napis-mi/page.tsx` renderuje dvousloupcový layout; client komponenta `ContactForm` volá novou API route `/api/contact/send`, která odesílá email přes Resend SDK.

**Tech Stack:** Next.js 15 App Router, React, TypeScript, Resend SDK, zod

---

## Soubory

| Akce | Soubor | Zodpovědnost |
|------|--------|--------------|
| Modify | `lib/env.ts` | Přidat `resendApiKey` |
| Create | `components/forms/contact-form.tsx` | Client form komponenta (Jméno, Email, Zpráva) |
| Create | `app/api/contact/send/route.ts` | API route — validace + Resend |
| Modify | `app/napis-mi/page.tsx` | Nahradit HybridStaticRoutePage dedikovanou stránkou |

---

## Task 1: Nainstalovat Resend a přidat env var

**Files:**
- Modify: `package.json` (přes pnpm)
- Modify: `lib/env.ts`
- Modify: `.env.local`

- [ ] **Step 1: Nainstalovat resend**

```bash
cd "/Users/jakub-mac/Documents/AI/Programovani/Zdravi me bavi"
pnpm add resend
```

Očekávaný výstup: `+ resend X.X.X` bez chyb.

- [ ] **Step 2: Přidat RESEND_API_KEY do lib/env.ts**

V `lib/env.ts` přidat do objektu `env`:

```ts
resendApiKey: readEnv("RESEND_API_KEY") ?? "",
```

Výsledný soubor `lib/env.ts`:

```ts
function readEnv(name: string) {
  return process.env[name];
}

export const env = {
  siteUrl: readEnv("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000",
  sanityProjectId: readEnv("NEXT_PUBLIC_SANITY_PROJECT_ID") ?? "",
  sanityDataset: readEnv("NEXT_PUBLIC_SANITY_DATASET") ?? "production",
  sanityApiReadToken: readEnv("SANITY_API_READ_TOKEN") ?? "",
  sanityApiWriteToken: readEnv("SANITY_API_WRITE_TOKEN") ?? "",
  sanityRevalidateSecret: readEnv("SANITY_REVALIDATE_SECRET") ?? "",
  stripeSecretKey: readEnv("STRIPE_SECRET_KEY") ?? "",
  stripeWebhookSecret: readEnv("STRIPE_WEBHOOK_SECRET") ?? "",
  stripePriceIdEbook: readEnv("STRIPE_PRICE_ID_EBOOK") ?? "",
  stripePriceIdOsobniKonzultace: readEnv("STRIPE_PRICE_ID_OSOBNI_KONZULTACE") ?? "",
  stripePriceIdPruvodce: readEnv("STRIPE_PRICE_ID_PRUVODCE") ?? "",
  mailerLiteApiToken: readEnv("MAILERLITE_API_TOKEN") ?? "",
  mailerLiteApiBaseUrl: readEnv("MAILERLITE_API_BASE_URL") ?? "https://connect.mailerlite.com/api",
  makeAutomationWebhookUrl: readEnv("MAKE_AUTOMATION_WEBHOOK_URL") ?? "",
  makeAutomationApiKey: readEnv("MAKE_AUTOMATION_API_KEY") ?? "",
  base44AutomationWebhookUrl: readEnv("BASE44_AUTOMATION_WEBHOOK_URL") ?? "",
  base44AutomationApiKey: readEnv("BASE44_AUTOMATION_API_KEY") ?? "",
  resendApiKey: readEnv("RESEND_API_KEY") ?? "",
};
```

- [ ] **Step 3: Přidat placeholder do .env.local**

Do `.env.local` přidat řádek:

```
RESEND_API_KEY=re_placeholder_replace_with_real_key
```

(Skutečný klíč se doplní po registraci na resend.com)

- [ ] **Step 4: Ověřit typecheck**

```bash
cd "/Users/jakub-mac/Documents/AI/Programovani/Zdravi me bavi"
pnpm typecheck
```

Očekávaný výstup: žádné chyby TypeScriptu.

- [ ] **Step 5: Commit**

```bash
git add lib/env.ts pnpm-lock.yaml package.json
git commit -m "feat: přidat resend závislost a RESEND_API_KEY env var"
```

---

## Task 2: Vytvořit ContactForm client komponentu

**Files:**
- Create: `components/forms/contact-form.tsx`

- [ ] **Step 1: Vytvořit komponentu**

Vytvořit soubor `components/forms/contact-form.tsx`:

```tsx
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
```

- [ ] **Step 2: Ověřit typecheck**

```bash
cd "/Users/jakub-mac/Documents/AI/Programovani/Zdravi me bavi"
pnpm typecheck
```

Očekávaný výstup: žádné chyby.

- [ ] **Step 3: Commit**

```bash
git add components/forms/contact-form.tsx
git commit -m "feat: přidat ContactForm komponentu (Jméno, Email, Zpráva)"
```

---

## Task 3: Vytvořit API route /api/contact/send

**Files:**
- Create: `app/api/contact/send/route.ts`

- [ ] **Step 1: Vytvořit API route**

Vytvořit soubor `app/api/contact/send/route.ts`:

```ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { env } from "@/lib/env";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Neplatná data formuláře." },
      { status: 400 }
    );
  }

  const { name, email, message } = parsed.data;

  if (!env.resendApiKey) {
    console.error("RESEND_API_KEY is not set");
    return NextResponse.json(
      { ok: false, error: "Chyba konfigurace serveru." },
      { status: 500 }
    );
  }

  const resend = new Resend(env.resendApiKey);

  const { error } = await resend.emails.send({
    from: "noreply@zdravimebavi.cz",
    to: "info@zdravimebavi.cz",
    replyTo: email,
    subject: `Nová zpráva od ${name}`,
    html: `
      <p><strong>Jméno:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Zpráva:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `,
    text: `Jméno: ${name}\nEmail: ${email}\n\nZpráva:\n${message}`,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { ok: false, error: "Nepodařilo se odeslat zprávu." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Ověřit typecheck**

```bash
cd "/Users/jakub-mac/Documents/AI/Programovani/Zdravi me bavi"
pnpm typecheck
```

Očekávaný výstup: žádné chyby.

- [ ] **Step 3: Commit**

```bash
git add app/api/contact/send/route.ts
git commit -m "feat: přidat /api/contact/send route s Resend integrací"
```

---

## Task 4: Předělat app/napis-mi/page.tsx

**Files:**
- Modify: `app/napis-mi/page.tsx`

- [ ] **Step 1: Nahradit obsah stránky**

Přepsat `app/napis-mi/page.tsx`:

```tsx
import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = {
  title: "Zdraví mě baví - Kontakt",
  description: "Napiš mi — kontaktní formulář Zdraví mě baví.",
};

export default function ContactPage() {
  return (
    <section className="page-section">
      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "start",
        }}
        className="contact-grid"
        >
          {/* Levý sloupec — kontaktní info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div>
              <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Iva Vaňková</p>
              <p className="muted" style={{ lineHeight: 1.6 }}>
                Dr. Nováka 496<br />
                Benátky nad Jizerou<br />
                294 71
              </p>
            </div>
            <div>
              <p className="eyebrow" style={{ marginBottom: "0.5rem" }}>Kontakt</p>
              <a href="mailto:info@zdravimebavi.cz" style={{ display: "block", marginBottom: "0.25rem" }}>
                info@zdravimebavi.cz
              </a>
              <p className="muted">Tel.: +420 608 283 477</p>
            </div>
            <div>
              <p className="eyebrow" style={{ marginBottom: "0.5rem" }}>Ostatní informace</p>
              <p className="muted" style={{ marginBottom: "0.5rem" }}>IČO: 19197110</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <a href="/obchodni-podminky" target="_blank" rel="noreferrer">Obchodní podmínky</a>
                <a href="/gdpr" target="_blank" rel="noreferrer">Podmínky ochrany osobních údajů</a>
                <a href="/cookies" target="_blank" rel="noreferrer">Soubory Cookie</a>
                <a href="/odpovednost" target="_blank" rel="noreferrer">Odpovědnost</a>
              </div>
            </div>
          </div>

          {/* Pravý sloupec — formulář */}
          <div>
            <h1 style={{ marginBottom: "1rem" }}>Napiš mi</h1>
            <p className="page-lead" style={{ marginBottom: "2rem" }}>
              Potřebuješ se na cokoli zeptat nebo mi chceš něco sdělit? Využij následující
              formulář. Napsat mi můžeš taky na{" "}
              <a href="https://www.facebook.com/zdravimebavi.fb" target="_blank" rel="noreferrer">
                Facebooku
              </a>{" "}
              nebo{" "}
              <a href="https://www.instagram.com/zdravi_me_bavi/" target="_blank" rel="noreferrer">
                Instagramu
              </a>
              . Moc ráda ti odpovím.
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Přidat responzivní CSS pro contact-grid do globals.css**

Do `app/globals.css` přidat na konec souboru:

```css
@media (max-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr !important;
    gap: 2rem !important;
  }
}
```

- [ ] **Step 3: Ověřit typecheck**

```bash
cd "/Users/jakub-mac/Documents/AI/Programovani/Zdravi me bavi"
pnpm typecheck
```

Očekávaný výstup: žádné chyby.

- [ ] **Step 4: Ověřit stránku v prohlížeči**

Otevřít http://localhost:3000/napis-mi a ověřit:
- Zobrazuje se dvousloupcový layout
- Levý sloupec má: Iva Vaňková, adresa, email, telefon, IČO, právní odkazy
- Pravý sloupec má: nadpis „Napiš mi", intro text, formulář se 3 poli (Jméno, Email, Zpráva)
- Na mobilu (<768px) se sloupce skládají pod sebe

- [ ] **Step 5: Commit**

```bash
git add app/napis-mi/page.tsx app/globals.css
git commit -m "feat: předělat /napis-mi na dedikovanou kontaktní stránku"
```

---

## Task 5: Manuální test odesílání formuláře

> **Poznámka:** Tento task vyžaduje skutečný Resend API klíč a ověřenou doménu `zdravimebavi.cz` v Resend dashboardu. Bez toho odesílání selže. Provést až po DNS konfiguraci.

- [ ] **Step 1: Nastavit skutečný Resend API klíč**

V `.env.local` nahradit placeholder skutečným klíčem z resend.com dashboardu:

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
```

Restartovat dev server: `pnpm dev`

- [ ] **Step 2: Odeslat testovací zprávu**

Na http://localhost:3000/napis-mi vyplnit formulář a odeslat. Ověřit:
- Formulář se nahradí textem „Děkuji za zprávu. Ozvu se ti co nejdříve."
- Na `info@zdravimebavi.cz` dorazí email s předmětem „Nová zpráva od [jméno]"
- Email obsahuje správné jméno, email odesílatele, text zprávy
- Reply-To je nastaven na email odesílatele

- [ ] **Step 3: Otestovat chybový stav**

Dočasně nastavit `RESEND_API_KEY=invalid` a odeslat formulář. Ověřit, že se zobrazí: „Ups! Něco se pokazilo. Zkus to prosím znovu."

Vrátit správný klíč zpět.
