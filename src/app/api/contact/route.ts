import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { escapeHtml } from "@/lib/security/html";
import { readBoundedJson } from "@/lib/security/readJsonBody";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimit";

const ContactRequestSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(254),
  message: z.string().min(1).max(5000),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed, retryAfterSeconds } = checkRateLimit(`contact:${ip}`, 5, 15 * 60 * 1000);
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

  const parsed = ContactRequestSchema.safeParse(body.data);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", issues: parsed.error.issues }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const teamInbox = process.env.TEAM_NOTIFICATION_EMAIL;
  if (!apiKey || !teamInbox) {
    return NextResponse.json(
      { error: "Contact form isn't configured yet (RESEND_API_KEY / TEAM_NOTIFICATION_EMAIL)" },
      { status: 500 }
    );
  }

  const { name, email, message } = parsed.data;
  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_ADDRESS || "SAVR Nutrition <orders@savrnutrition.co.za>",
      to: teamInbox,
      replyTo: email,
      subject: `Website contact form — ${name}`,
      html: `<p><strong>${escapeHtml(name)}</strong> (${escapeHtml(email)}) wrote:</p><p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`,
    });
    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("Contact form send failed", err);
    return NextResponse.json({ error: "Could not send message" }, { status: 502 });
  }
}
