import { headers } from "next/headers";

// Basic bot protection for public forms (inquiry, checkout).
//
// 1. Honeypot: the forms include a hidden "website" field that people never see or fill.
//    Bots that fill every field do. We then pretend it worked and save nothing, so the bot
//    gets no signal to adapt.
// 2. Rate limit: at most LIMIT submissions per IP per WINDOW_MS. This lives in memory, so on
//    Cloudflare it is per worker instance: it stops a single bot hammering the form, not a
//    distributed attack. Cloudflare's own WAF rate limiting is the next step if that happens.
// 3. Size limits: refuse absurdly long text so nobody can stuff megabytes into Sanity.

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const LIMIT = 5;
const hits = new Map<string, number[]>();

export const MAX_TEXT = 2000; // characters, for free-text fields like the message
export const MAX_FIELD = 200; // characters, for names, emails, phones, addresses

async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("cf-connecting-ip") ||
    h.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown"
  );
}

export type SpamVerdict =
  | { ok: true }
  | { ok: false; silent: true } // honeypot: fake success
  | { ok: false; silent: false; message: string };

export async function checkSpam(
  form: string,
  honeypot: string | undefined,
  fields: Record<string, unknown>,
): Promise<SpamVerdict> {
  if (honeypot && honeypot.trim() !== "") {
    console.warn(`[spamGuard] ${form}: honeypot filled, dropped`);
    return { ok: false, silent: true };
  }

  for (const [name, value] of Object.entries(fields)) {
    if (typeof value === "string") {
      const max = name === "message" ? MAX_TEXT : MAX_FIELD;
      if (value.length > max) {
        return { ok: false, silent: false, message: `The ${name} field is too long.` };
      }
    }
  }

  const ip = await clientIp();
  const key = `${form}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) {
    console.warn(`[spamGuard] ${form}: rate limit hit for ${ip}`);
    return {
      ok: false,
      silent: false,
      message: "Too many submissions. Please wait a few minutes or contact us on WhatsApp.",
    };
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return { ok: true };
}
