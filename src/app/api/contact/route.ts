import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const ContactRequestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1).max(5000),
});

export async function POST(request: NextRequest) {
  const parsed = ContactRequestSchema.safeParse(await request.json());
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
      html: `<p><strong>${name}</strong> (${email}) wrote:</p><p>${message.replace(/\n/g, "<br/>")}</p>`,
    });
    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("Contact form send failed", err);
    return NextResponse.json({ error: "Could not send message" }, { status: 502 });
  }
}
