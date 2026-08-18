import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isReturningCustomer } from "@/lib/googleSheets";
import { readBoundedJson } from "@/lib/security/readJsonBody";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimit";

const Schema = z.object({
  email: z.string().email().max(254),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed, retryAfterSeconds } = checkRateLimit(`returningcheck:${ip}`, 20, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  const body = await readBoundedJson(request);
  if (!body.ok) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = Schema.safeParse(body.data);
  if (!parsed.success) {
    return NextResponse.json({ returning: false });
  }

  const returning = await isReturningCustomer(parsed.data.email);
  return NextResponse.json({ returning });
}
