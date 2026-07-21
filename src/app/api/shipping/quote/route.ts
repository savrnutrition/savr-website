import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getShippingQuote } from "@/lib/courierguy";
import { readBoundedJson } from "@/lib/security/readJsonBody";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimit";

const QuoteRequestSchema = z.object({
  street: z.string().min(1).max(200),
  city: z.string().min(1).max(100),
  postal: z.string().min(1).max(20),
  quantity: z.number().int().min(1).max(50),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  // Generous limit — this endpoint fires automatically (debounced) as a
  // customer types their address into the checkout form, so a strict
  // 5-per-15-min cap would break normal usage. Still bounds abuse against
  // the live, paid Courier Guy API behind it.
  const { allowed, retryAfterSeconds } = checkRateLimit(`shipping-quote:${ip}`, 30, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests — please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  const body = await readBoundedJson(request);
  if (!body.ok) {
    return NextResponse.json(
      { error: body.error === "too_large" ? "Request body too large" : "Invalid JSON" },
      { status: 400 }
    );
  }

  const parsed = QuoteRequestSchema.safeParse(body.data);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", issues: parsed.error.issues }, { status: 400 });
  }
  const { street, city, postal, quantity } = parsed.data;

  try {
    const rates = await getShippingQuote({
      deliveryAddress: { streetAddress: street, city, postalCode: postal },
      quantity,
      declaredValueRand: quantity * 299,
    });

    if (!rates.length) {
      return NextResponse.json({ error: "No rates returned" }, { status: 502 });
    }

    const cheapest = rates.reduce((min, r) => (r.totalCharge < min.totalCharge ? r : min));
    return NextResponse.json({ rate: cheapest, allRates: rates });
  } catch (err) {
    console.error("Courier Guy quote failed", err);
    return NextResponse.json(
      { error: "Courier Guy quote failed — check COURIER_GUY_API_KEY / sandbox status" },
      { status: 502 }
    );
  }
}
