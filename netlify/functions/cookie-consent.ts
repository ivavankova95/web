import { z } from "zod";
import {
  consentSubmissionDays,
  consentVersion,
  dayInMilliseconds,
  hasOptionalCookies,
  sameCookiePreferences,
  utcDay,
  type ConsentChoice,
  type ConsentReceipt,
} from "../../lib/cookie-consent-evidence";
import { cookieConsentStore } from "../../lib/cookie-consent-store";

const consentId = z.string().length(47).refine((id) => {
  const [day, uuid, extra] = id.split("/");
  return !extra && z.iso.date().safeParse(day).success && z.uuidv4().safeParse(uuid).success;
});

const choiceSchema = z.strictObject({
  id: consentId,
  previousId: consentId.nullable(),
  version: z.literal(consentVersion),
  analytics: z.boolean(),
  marketing: z.boolean(),
});

type ConsentRecord = ConsentChoice & ConsentReceipt;

function reply(status: number, body?: ConsentReceipt) {
  const headers = { "Cache-Control": "no-store" };
  return body ? Response.json(body, { status, headers }) : new Response(null, { status, headers });
}

export default async function recordConsent(request: Request) {
  const url = new URL(request.url);
  if (request.method !== "POST") return reply(405);
  if (request.headers.get("origin") !== url.origin) return reply(403);
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") return reply(415);

  let input: unknown;
  try {
    const body = await request.text();
    if (body.length > 512) return reply(413);
    input = JSON.parse(body);
  } catch {
    return reply(400);
  }

  const parsed = choiceSchema.safeParse(input);
  if (!parsed.success) return reply(400);
  const choice = parsed.data;
  const day = choice.id.slice(0, 10);
  const now = Date.now();
  if (
    day < utcDay(now - consentSubmissionDays * dayInMilliseconds) ||
    day > utcDay(now + dayInMilliseconds) ||
    choice.previousId === choice.id ||
    (!choice.previousId && !hasOptionalCookies(choice))
  ) return reply(400);

  try {
    const store = cookieConsentStore(
      url.hostname === "www.zdravimebavi.cz" || url.hostname === "zdravimebavi.cz",
    );
    const recordedAt = new Date(now).toISOString();
    const { modified } = await store.setJSON(choice.id, { ...choice, recordedAt }, { onlyIfNew: true });
    if (modified) return reply(201, { id: choice.id, recordedAt });

    const existing: ConsentRecord | null = await store.get(choice.id, { type: "json" });
    if (
      !existing ||
      existing.previousId !== choice.previousId ||
      existing.version !== choice.version ||
      !sameCookiePreferences(existing, choice)
    ) return reply(409);
    return reply(200, { id: choice.id, recordedAt: existing.recordedAt });
  } catch {
    console.error("Cookie consent could not be recorded");
    return reply(503);
  }
}

export const config = {
  path: "/api/cookie-consent",
  method: "POST",
  rateLimit: { windowLimit: 30, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
