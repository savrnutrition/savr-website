import type { NextRequest } from "next/server";

type BoundedJsonResult =
  | { ok: true; data: unknown }
  | { ok: false; error: "too_large" | "invalid_json" };

/**
 * Reads a request body as text (capping size before parsing) then parses it
 * as JSON — rejects oversized or malformed bodies before they ever reach
 * Zod/business logic, instead of buffering an arbitrarily large payload.
 */
export async function readBoundedJson(
  request: NextRequest,
  maxBytes = 20_000
): Promise<BoundedJsonResult> {
  const text = await request.text();
  if (Buffer.byteLength(text, "utf8") > maxBytes) {
    return { ok: false, error: "too_large" };
  }
  try {
    return { ok: true, data: JSON.parse(text) };
  } catch {
    return { ok: false, error: "invalid_json" };
  }
}
