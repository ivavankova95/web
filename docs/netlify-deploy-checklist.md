# Netlify Deploy Checklist

This project is a Next.js App Router site with API routes. Netlify detects Next.js automatically and maps SSR, ISR, middleware, and `app/api/*` routes using its Next runtime.

## Required in Netlify

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`

## Required before production launch

- `NEXT_PUBLIC_SITE_URL`
  - Use the final production origin, for example `https://www.zdravimebavi.cz`

## Required if forms and email should work

- `RESEND_API_KEY`
- `TURNSTILE_SECRET_KEY`
- `SANITY_REVALIDATE_SECRET`

## Required only if the legacy Stripe webhook is in use

- `STRIPE_WEBHOOK_SECRET`

The public website has no Stripe checkout. Membership registration and payments are handled by the member application.

## Service-side follow-up after deploy

- Update the Sanity webhook target to the Netlify production URL.
- Ensure Cloudflare Turnstile allows `zdravimebavi.cz` and `www.zdravimebavi.cz`.
- Confirm the Resend sending domain is verified for production mail sending.

## Notes

- The same `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` values that work locally should be copied to Netlify.
- These two values are public configuration, not secrets.
- Local development uses `next dev`; Netlify deploy uses `pnpm build`.
