import { NextRequest, NextResponse } from "next/server";
import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { sanityClient } from "@/sanity/client";
import { readToken } from "@/sanity/env";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimit";

// Only meaningful once Sanity is configured — this route isn't reachable
// from anywhere unless the Presentation tool is used, which requires it.
const { GET: enableDraftMode } = defineEnableDraftMode({
  client: sanityClient!.withConfig({ token: readToken }),
});

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  // Defense-in-depth against secret-guessing — the secret itself is a long
  // random token from Sanity, so this is a backstop, not the primary defence.
  const { allowed, retryAfterSeconds } = checkRateLimit(`draft-enable:${ip}`, 20, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests — please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }
  return enableDraftMode(request);
}
