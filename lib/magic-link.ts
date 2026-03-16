import crypto from "crypto";

const SECRET = process.env.BETTER_AUTH_SECRET!;
const EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

interface MagicLinkPayload {
  email: string;
  redirect: string;
  exp: number;
}

export function createMagicLinkToken(email: string, redirectPath: string): string {
  const payload: MagicLinkPayload = {
    email,
    redirect: redirectPath,
    exp: Date.now() + EXPIRY_MS,
  };
  const payloadStr = JSON.stringify(payload);
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(payloadStr)
    .digest("base64url");
  return Buffer.from(payloadStr).toString("base64url") + "." + signature;
}

export function verifyMagicLinkToken(token: string): MagicLinkPayload | null {
  const dotIndex = token.lastIndexOf(".");
  if (dotIndex === -1) return null;

  const payloadB64 = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);

  let payload: MagicLinkPayload;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString());
  } catch {
    return null;
  }

  const expectedSig = crypto
    .createHmac("sha256", SECRET)
    .update(JSON.stringify(payload))
    .digest("base64url");

  if (signature !== expectedSig) return null;
  if (Date.now() > payload.exp) return null;

  return payload;
}

export function createMagicLinkUrl(email: string, redirectPath: string): string {
  const token = createMagicLinkToken(email, redirectPath);
  const baseUrl = process.env.BETTER_AUTH_URL || "https://mayr-dach.com";
  return `${baseUrl}/api/auth/magic-link?token=${token}`;
}
