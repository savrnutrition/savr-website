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
      <p>${order.quantity} × SAVR Tomato Napoletana (500g)</p>
      <p>Delivery method: ${escapeHtml(deliveryLabel)}</p>
      <p>Total paid: R${order.total}</p>
      <p>Delivering to: ${escapeHtml(c.street)}, ${escapeHtml(c.city)} ${escapeHtml(c.postal)}</p>
      <p>We'll be in touch with tracking details as soon as your order ships.</p>
      <p>— The SAVR team</p>
    `,
  });
}
