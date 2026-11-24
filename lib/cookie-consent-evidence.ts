import type { CookiePreferences } from "./web-tracking";

export const consentVersion = "2026-11-24-v2";
export const consentEndpoint = "/api/cookie-consent";
export const dayInMilliseconds = 86_400_000;
export const consentLifetime = 180 * dayInMilliseconds;
export const consentSubmissionDays = 2;
export const noOptionalCookies = { analytics: false, marketing: false };

export type ConsentChoice = CookiePreferences & {
  id: string;
  previousId: string | null;
  version: typeof consentVersion;
};

export type ConsentReceipt = { id: string; recordedAt: string };

export function utcDay(timestamp = Date.now()) {
  return new Date(timestamp).toISOString().slice(0, 10);
}

export function createConsentId() {
  return `${utcDay()}/${crypto.randomUUID()}`;
}

export function hasOptionalCookies(choice: CookiePreferences) {
  return choice.analytics || choice.marketing;
}

export function sameCookiePreferences(left: CookiePreferences, right: CookiePreferences) {
  return left.analytics === right.analytics && left.marketing === right.marketing;
}
