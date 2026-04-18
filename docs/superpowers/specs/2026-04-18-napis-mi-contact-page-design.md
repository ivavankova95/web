# Design: /napis-mi — kontaktní stránka

**Datum:** 2026-04-18  
**Status:** Schváleno

## Cíl

Předělat stránku `/napis-mi` tak, aby odpovídala originálu na `zdravimebavi.cz/napis-mi` — informačně i funkčně. Aktuální stav je broken: formulář má pole Telefon (originál ho nemá), chybí pole Zpráva (textarea), chybí kontaktní info v levém sloupci.

## Layout

Dvousloupcový grid (stejně jako originál):

- **Levý sloupec** — statické kontaktní informace
- **Pravý sloupec** — nadpis, intro text, formulář

Na mobilních zařízeních se sloupce skládají pod sebe (pravý/formulářový sloupec nahoře, kontaktní info dole — podle originálu).

## Komponenty

### `app/napis-mi/page.tsx`
- Statický server component, nahrazuje stávající `HybridStaticRoutePage`
- Renderuje dvousloupcový layout přímo v JSX
- Obsahuje statická kontaktní data (adresa, email, telefon, IČO, právní odkazy)
- Importuje `ContactForm` client komponentu

**Levý sloupec — kontaktní data:**
- Jméno: Iva Vaňková
- Adresa: Dr. Nováka 496, Benátky nad Jizerou, 294 71
- Email: info@zdravimebavi.cz (klikací mailto link)
- Tel.: +420 608 283 477
- IČO: 19197110
- Právní odkazy: Obchodní podmínky (`/obchodni-podminky`), Podmínky ochrany osobních údajů (`/gdpr`), Soubory Cookie (`/cookies`), Odpovědnost (`/odpovednost`)

**Pravý sloupec:**
- `<h1>Napiš mi</h1>`
- Intro text: „Potřebuješ se na cokoli zeptat nebo mi chceš něco sdělit? Využij následující formulář. Napsat mi můžeš taky na [Facebooku](https://www.facebook.com/zdravimebavi.fb) nebo [Instagramu](https://www.instagram.com/zdravi_me_bavi/). Moc ráda ti odpovím."
- `<ContactForm />`

### `components/forms/contact-form.tsx`
- Client component (`"use client"`)
- Pole: Jméno (text, required), Email (email, required), Zpráva (textarea, optional)
- Submit button: „Odeslat" / „Odesílám…" (disabled při odesílání)
- Po úspěšném odeslání: formulář se nahradí textem „Děkuji za zprávu. Ozvu se ti co nejdříve."
- Při chybě: zobrazí se inline hláška „Ups! Něco se pokazilo. Zkus to prosím znovu."
- Volá `POST /api/contact/send`

### `app/api/contact/send/route.ts`
- Nová API route, oddělená od `/api/forms/submit` (která slouží pro lead-gen + MailerLite)
- Přijme JSON: `{ name: string, email: string, message: string }`
- Validace přes `zod`: name min 1, email valid format, message min 1
- Odešle email přes **Resend SDK** na `info@zdravimebavi.cz`
  - From: `noreply@zdravimebavi.cz` — doména `zdravimebavi.cz` musí být ověřena v Resend dashboardu (DNS záznamy)
  - Reply-To: email odesílatele (aby stačilo kliknout Reply pro odpověď uživateli)
  - Subject: `Nová zpráva od {name}`
  - Body (plain text + HTML): jméno, email, zpráva
- Vrátí `{ ok: true }` nebo `{ ok: false, error: string }`
- `RESEND_API_KEY` musí být v `.env.local`

## Závislosti

- Přidat balíček `resend` do `package.json`
- Přidat `RESEND_API_KEY` do `.env.local` a Netlify environment variables
- Cílový email `info@zdravimebavi.cz` bude hardcoded v API route (není potřeba env var)

## Co se nemění

- `LeadForm` a `/api/forms/submit` zůstávají beze změny
- Ostatní stránky nejsou dotčeny

## Co se neřeší

- MailerLite integrace pro kontaktní formulář (záměrně vynecháno)
- Ukládání zpráv do databáze / Sanity
