import {
  consentLifetime,
  consentSubmissionDays,
  dayInMilliseconds,
  utcDay,
} from "../../lib/cookie-consent-evidence";
import { cookieConsentStore } from "../../lib/cookie-consent-store";

export default async function pruneCookieConsents() {
  const now = Date.now();
  // Allow the full consent lifetime after receipt, including delayed delivery.
  const cutoff = utcDay(now - consentLifetime - consentSubmissionDays * dayInMilliseconds);
  const store = cookieConsentStore(true);
  const { directories } = await store.list({ directories: true });

  for (const day of directories.filter((key) => /^\d{4}-\d{2}-\d{2}$/.test(key) && key < cutoff).sort()) {
    for await (const { blobs } of store.list({ prefix: `${day}/`, paginate: true })) {
      for (let offset = 0; offset < blobs.length; offset += 10) {
        // Resume from the oldest remaining keys the next night if needed.
        if (Date.now() - now > 20_000) return;
        await Promise.all(blobs.slice(offset, offset + 10).map(({ key }) => store.delete(key)));
      }
    }
  }
}

export const config = { schedule: "20 3 * * *" };
