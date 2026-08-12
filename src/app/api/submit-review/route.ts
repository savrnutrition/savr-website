import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sanityClient } from "@/sanity/client";
import { writeToken } from "@/sanity/env";
import { readBoundedJson } from "@/lib/security/readJsonBody";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimit";

const ReviewSubmissionSchema = z.object({
  name: z.string().min(1).max(100),
  role: z.string().max(150).optional(),
  quote: z.string().min(10).max(2000),
  rating: z.number().int().min(1).max(5).optional(),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed, retryAfterSeconds } = checkRateLimit(`review:${ip}`, 3, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many submissions — please try again later." },
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

  const parsed = ReviewSubmissionSchema.safeParse(body.data);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", issues: parsed.error.issues }, { status: 400 });
  }

  if (!sanityClient || !writeToken) {
    return NextResponse.json({ error: "Review submission is not configured yet." }, { status: 500 });
  }

  const { name, role, quote, rating } = parsed.data;

  const client = sanityClient.withConfig({ token: writeToken, useCdn: false });

  await client.create({
    _type: "review",
    name,
    ...(role ? { role } : {}),
    quote,
    ...(rating != null ? { rating } : {}),
    approved: true,
  });

  return NextResponse.json({ submitted: true });
}
