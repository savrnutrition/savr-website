import { Resend } from "resend";
import type { OrderPayload } from "@/lib/orders/types";
import { getDeliveryMethod } from "@/lib/orders/deliveryMethods";
import { escapeHtml } from "@/lib/security/html";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set — add it to .env.local");
  }
  return new Resend(apiKey);
}

const FROM_ADDRESS = process.env.RESEND_FROM_ADDRESS || "SAVR Nutrition <orders@savrnutrition.co.za>";
const TEAM_INBOX = process.env.TEAM_NOTIFICATION_EMAIL;

export async function sendTeamOrderNotification(order: OrderPayload) {
  if (!TEAM_INBOX) {
    throw new Error("TEAM_NOTIFICATION_EMAIL is not set — add it to .env.local");
  }
  const deliveryLabel = getDeliveryMethod(order.deliveryMethod)?.label ?? order.deliveryMethod;
  const resend = getResendClient();

  const c = order.customer;
  await resend.emails.send({
    from: FROM_ADDRESS,
    to: TEAM_INBOX,
    subject: `New paid order — ${order.orderId}`,
    html: `
      <h2>New paid SAVR order</h2>
      <p><strong>Order:</strong> ${escapeHtml(order.orderId)}</p>
      <p><strong>Customer:</strong> ${escapeHtml(c.firstName)} ${escapeHtml(c.lastName)} — ${escapeHtml(c.email)} — ${escapeHtml(c.phone)}</p>
      <p><strong>Address:</strong> ${escapeHtml(c.street)}, ${escapeHtml(c.city)} ${escapeHtml(c.postal)}</p>
      <p><strong>Quantity:</strong> ${order.quantity} × Tomato Napoletana</p>
      <p><strong>Delivery:</strong> ${escapeHtml(deliveryLabel)}</p>
      <p><strong>Total:</strong> R${order.total}</p>
      <p>Also written to the shared order Google Sheet.</p>
    `,
  });
}

/**
 * Best-effort alert for checkout attempts that failed before ever reaching
 * Yoco (rate limited, shipping quote failed, checkout creation failed).
 * Exists because Vercel's free tier only keeps logs briefly and doesn't
 * support historical search — without this, "a customer said it failed at
 * 21:16" is undiagnosable after the fact. Never throws: a failed alert
 * should never break the actual response the customer sees.
 */
export async function alertCheckoutFailure(params: {
  reason: string;
  ip: string;
  detail?: string;
  customerEmail?: string;
}) {
  if (!TEAM_INBOX || !process.env.RESEND_API_KEY) return;
  try {
    const resend = getResendClient();
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: TEAM_INBOX,
      subject: `Checkout failed — ${params.reason}`,
      html: `
        <h2>A checkout attempt failed before reaching Yoco</h2>
        <p><strong>Time:</strong> ${escapeHtml(new Date().toISOString())}</p>
        <p><strong>Reason:</strong> ${escapeHtml(params.reason)}</p>
        <p><strong>IP:</strong> ${escapeHtml(params.ip)}</p>
        ${params.customerEmail ? `<p><strong>Customer email (if provided):</strong> ${escapeHtml(params.customerEmail)}</p>` : ""}
        ${params.detail ? `<p><strong>Detail:</strong> ${escapeHtml(params.detail)}</p>` : ""}
      `,
    });
  } catch (err) {
    console.error("alertCheckoutFailure: failed to send alert email", err);
  }
}

export async function sendCustomerOrderConfirmation(order: OrderPayload) {
  const deliveryLabel = getDeliveryMethod(order.deliveryMethod)?.label ?? order.deliveryMethod;
  const resend = getResendClient();

  const c = order.customer;
  await resend.emails.send({
    from: FROM_ADDRESS,
    to: c.email,
    subject: "Your SAVR order is confirmed",
    html: `
      <h2>Thanks, ${escapeHtml(c.firstName)} — your order is confirmed</h2>
      <p>Order reference: <strong>${escapeHtml(order.orderId)}</strong></p>
      <p>${order.quantity} × SAVR Tomato Napoletana (510g)</p>
      <p>Delivery method: ${escapeHtml(deliveryLabel)}</p>
      <p>Total paid: R${order.total}</p>
      <p>Delivering to: ${escapeHtml(c.street)}, ${escapeHtml(c.city)} ${escapeHtml(c.postal)}</p>
      <p>We'll be in touch with tracking details as soon as your order ships.</p>
      <p>— The SAVR team</p>
    `,
  });
}
