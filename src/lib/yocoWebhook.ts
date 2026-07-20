import { createHmac, timingSafeEqual } from "crypto";

/**
 * Yoco signs webhooks the same way Svix does: headers `webhook-id`,
 * `webhook-timestamp`, `webhook-signature`; signed content is
 * `${id}.${timestamp}.${rawBody}`; HMAC-SHA256 keyed with the base64
 * portion of the secret (after the `whsec_` prefix), base64-encoded;
 * the header value is space-delimited `v1,<sig>` pairs.
 * https://developer.yoco.com/online/api-reference/webhooks/verifying-events/
 */
export function verifyYocoWebhookSignature(params: {
  rawBody: string;
  webhookId: string;
  webhookTimestamp: string;
  webhookSignature: string;
  secret: string;
}): boolean {
  const { rawBody, webhookId, webhookTimestamp, webhookSignature, secret } = params;

  const toleranceSeconds = 60 * 5;
  const timestampMs = Number(webhookTimestamp) * 1000;
  if (!timestampMs || Math.abs(Date.now() - timestampMs) > toleranceSeconds * 1000) {
    return false;
  }

  const secretBytes = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const signedContent = `${webhookId}.${webhookTimestamp}.${rawBody}`;
  const expectedSignature = createHmac("sha256", secretBytes)
    .update(signedContent)
    .digest("base64");

  const providedSignatures = webhookSignature
    .split(" ")
    .map((part) => part.split(",")[1])
    .filter(Boolean);

  return providedSignatures.some((sig) => {
    const a = Buffer.from(sig);
    const b = Buffer.from(expectedSignature);
    return a.length === b.length && timingSafeEqual(a, b);
  });
}
