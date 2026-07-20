import { NextRequest, NextResponse } from "next/server";
import { verifyYocoWebhookSignature } from "@/lib/yocoWebhook";
import { appendOrderRow } from "@/lib/googleSheets";
import { sendCustomerOrderConfirmation, sendTeamOrderNotification } from "@/lib/email";
import { bookShipment } from "@/lib/courierguy";
import type { OrderPayload } from "@/lib/orders/types";

// Payment confirmation must come from this webhook, not the successUrl
// redirect (a customer can close the tab before the redirect fires, or
// hit the success page without ever having paid).
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const webhookId = request.headers.get("webhook-id");
  const webhookTimestamp = request.headers.get("webhook-timestamp");
  const webhookSignature = request.headers.get("webhook-signature");
  const secret = process.env.YOCO_WEBHOOK_SECRET;

  if (!secret) {
    console.error("YOCO_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }
  if (!webhookId || !webhookTimestamp || !webhookSignature) {
    return NextResponse.json({ error: "Missing webhook signature headers" }, { status: 400 });
  }

  const isValid = verifyYocoWebhookSignature({
    rawBody,
    webhookId,
    webhookTimestamp,
    webhookSignature,
    secret,
  });
  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  // ⚠️ Confirm this event shape against a real sandbox webhook delivery —
  // Yoco's docs site couldn't be fully scraped while building this. Log the
  // raw payload on the first few test payments and adjust the field paths
  // below if they differ.
  const eventType: string = event?.type ?? event?.payload?.type ?? "";
  const payload = event?.payload ?? event;

  if (eventType !== "payment.succeeded") {
    return NextResponse.json({ received: true, ignored: eventType });
  }

  const orderJson: string | undefined = payload?.metadata?.order;
  if (!orderJson) {
    console.error("Yoco webhook missing order metadata", payload);
    return NextResponse.json({ error: "Missing order metadata" }, { status: 400 });
  }

  const order: OrderPayload = JSON.parse(orderJson);

  const results = await Promise.allSettled([
    appendOrderRow(order),
    sendTeamOrderNotification(order),
    sendCustomerOrderConfirmation(order),
    order.deliveryMethod === "courierguy"
      ? bookShipment({
          orderId: order.orderId,
          deliveryAddress: {
            streetAddress: order.customer.street,
            city: order.customer.city,
            postalCode: order.customer.postal,
          },
          customerName: `${order.customer.firstName} ${order.customer.lastName}`,
          customerPhone: order.customer.phone,
          customerEmail: order.customer.email,
          quantity: order.quantity,
          declaredValueRand: order.subtotal,
        })
      : Promise.resolve(null),
  ]);

  results.forEach((result, i) => {
    if (result.status === "rejected") {
      const step = ["Google Sheets", "team email", "customer email", "Courier Guy booking"][i];
      console.error(`Order fulfilment step failed (${step}) for ${order.orderId}:`, result.reason);
    }
  });

  // Always 200 once the payment itself is confirmed — Yoco should not
  // retry-storm the webhook over a downstream email/sheet hiccup. Failures
  // are logged above for manual follow-up.
  return NextResponse.json({ received: true });
}
