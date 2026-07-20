/**
 * Yoco Checkout API client (server-side only — never expose the secret key
 * to the browser). Endpoint/payload shape confirmed against Yoco's public
 * docs and reference integrations: POST /checkouts with amount in cents,
 * Bearer secret-key auth, response includes `id` + `redirectUrl`.
 * https://developer.yoco.com/online/api-reference/checkout-api
 */

const YOCO_API_BASE = "https://payments.yoco.com/api";

function assertSecretKey() {
  const key = process.env.YOCO_SECRET_KEY;
  if (!key) {
    throw new Error("YOCO_SECRET_KEY is not set — add your Yoco test secret key to .env.local");
  }
  return key;
}

export interface CreateCheckoutParams {
  amountRand: number;
  orderId: string;
  lineItems: { displayName: string; quantity: number; priceRand: number }[];
  successUrl: string;
  cancelUrl: string;
  failureUrl: string;
  /** Flat string metadata only — Yoco echoes this back on the webhook payload for reconciliation. */
  metadata: Record<string, string>;
}

export interface YocoCheckout {
  id: string;
  redirectUrl: string;
  status: string;
}

export async function createYocoCheckout(params: CreateCheckoutParams): Promise<YocoCheckout> {
  const secretKey = assertSecretKey();

  const res = await fetch(`${YOCO_API_BASE}/checkouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": params.orderId,
    },
    body: JSON.stringify({
      amount: Math.round(params.amountRand * 100),
      currency: "ZAR",
      successUrl: params.successUrl,
      cancelUrl: params.cancelUrl,
      failureUrl: params.failureUrl,
      metadata: params.metadata,
      lineItems: params.lineItems.map((item) => ({
        displayName: item.displayName,
        quantity: item.quantity,
        pricingDetails: { price: Math.round(item.priceRand * 100) },
      })),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Yoco checkout creation failed (${res.status}): ${body}`);
  }

  const data = await res.json();
  return { id: data.id, redirectUrl: data.redirectUrl, status: data.status };
}

export async function getYocoCheckout(checkoutId: string) {
  const secretKey = assertSecretKey();
  const res = await fetch(`${YOCO_API_BASE}/checkouts/${checkoutId}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Yoco checkout lookup failed (${res.status}): ${body}`);
  }
  return res.json();
}
