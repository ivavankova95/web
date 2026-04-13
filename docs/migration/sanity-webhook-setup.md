# Sanity Webhook Setup

Datum: 2026-04-12 (aktualizace: 2026-04-13)

Tento postup zapojuje on-demand revalidaci mezi Sanity a frontendem.

## Cíl

Po publikaci dokumentu v Sanity se má okamžitě obnovit:

- globální shell (`siteSettings`, `navigation`, `footer`)
- homepage
- blog, články a kategorie

Frontend route je připravena na:

- `POST /api/revalidate/sanity`

## 1. Secret

Do prostředí frontendu je potřeba přidat:

```env
SANITY_REVALIDATE_SECRET=...
```

Vygeneruj náhodný secret, např.:

```bash
openssl rand -base64 32
```

Tuto stejnou hodnotu zadáš jako `Secret` při nastavení webhooku v Sanity Manage.

## 2. URL webhooku

Lokálně (pro testování s ngrok nebo podobným nástrojem):

```text
http://localhost:3000/api/revalidate/sanity
```

Na preview / production hostingu:

```text
https://<tvoje-domena>/api/revalidate/sanity
```

## 3. Nastavení webhooku v Sanity Manage

Přejdi na [sanity.io/manage](https://www.sanity.io/manage) → vyber projekt → **API** → **Webhooks** → **Add webhook**.

### Základní nastavení

| Pole | Hodnota |
|------|---------|
| Name | Frontend revalidation |
| URL | `https://<tvoje-domena>/api/revalidate/sanity` |
| Dataset | `production` |
| Trigger on | `Create`, `Update`, `Delete` |
| Filter | viz níže |
| Projection | viz níže |
| HTTP method | `POST` |
| HTTP Headers | `Content-Type: application/json` |
| Secret | hodnota z `SANITY_REVALIDATE_SECRET` |
| API version | `v2024-01-01` |

### Filter (důležité — bez toho webhook reaguje i na draft saves)

```groq
!(_id in path('drafts.**'))
```

Tím se webhook spustí pouze po publikaci, ne při každém automatickém ukládání draftu ve Studiu.

### Projection (kritický detail)

```groq
{
  "_type": _type,
  "slug": slug.current,
  "path": path.current
}
```

> **Pozor:** Nikdy neposílej holé `slug` bez `.current`. Sanity by odeslal objekt
> `{ _type: 'slug', current: '...' }` místo stringu, a URL by vypadala jako
> `/clanky/[object Object]`.

## 4. Jak route ověřuje request

Route používá HMAC-SHA256 podpis z hlavičky `sanity-webhook-signature` (knihovna `@sanity/webhook`). Tajný klíč musí být totožný na obou stranách — v Sanity Manage i v `SANITY_REVALIDATE_SECRET`.

Mapování dokumentů na cache tagy a cesty:

| `_type` | `slug` | výsledná cesta |
|---------|--------|----------------|
| `page` | `home` | `/` |
| `blogPost` | `<slug>` | `/clanky/<slug>` |
| `category` | `<slug>` | `/kategorie/<slug>` |
| `siteSettings` / `navigation` / `footer` | — | layout `/` |
| ostatní | `<slug>` | `/<slug>` |

## 5. Ověření po nastavení

1. Uprav `navigation` nebo `footer` ve Studiu → publikuj → zkontroluj, že se změna propíše bez ručního rebuildu.
2. Uprav homepage nebo článek → publikuj → zkontroluj, že se obnoví odpovídající route.
3. V Sanity Manage → Webhooks → klikni na webhook → záložka **Attempts** — úspěšný request vrací HTTP 200 s tělem `{ "ok": true, ... }`.

## 6. Netlify — nastavení env vars

Při nasazení na Netlify je potřeba přidat `SANITY_REVALIDATE_SECRET` do:

**Site settings → Environment variables → Add variable**

Stejná hodnota musí být jak v `production`, tak ve `preview` prostředí, pokud chceš webhook testovat na preview deployích.

## 7. Lokální testování

Pro lokální test bez Sanity Manage lze poslat manuální POST s HMAC podpisem.

Vytvoř jednorázový skript `scripts/test-revalidate.mjs`:

```js
import { createHmac } from "crypto";

const secret = process.env.SANITY_REVALIDATE_SECRET;
const payload = JSON.stringify({ _type: "siteSettings" });
const timestamp = Date.now(); // milisekundy — @sanity/webhook v4 vyžaduje ms přesnost

const hmac = createHmac("sha256", secret)
  .update(`${timestamp}.${payload}`)
  .digest("base64")
  .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); // base64url

const signature = `t=${timestamp},v1=${hmac}`;

const res = await fetch("http://localhost:3000/api/revalidate/sanity", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "sanity-webhook-signature": signature,
  },
  body: payload,
});

console.log(res.status, await res.json());
```

Spusť:

```bash
SANITY_REVALIDATE_SECRET=<hodnota> node scripts/test-revalidate.mjs
```
