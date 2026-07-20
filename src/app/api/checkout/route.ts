import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createYocoCheckout } from "@/lib/yoco";
import { getShippingQuote } from "@/lib/courierguy";
import { getDeliveryMethod } from "@/lib/orders/deliveryMethods";
import { fetchSiteSettings } from "@/lib/sanity/fetchContent";
import type { OrderPayload } from "@/lib/orders/types";

const CheckoutRequestSchema = z.object({
  quantity: z.number().int().min(1).max(50),
  deliveryMethod: z.enum(["courierguy", "paxi", "collect"]),
  flavourSlug: z.string().default("tomato-napoletana"),
  customer: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(6),
    street: z.string().min(1),
    city: z.string().min(1),
    postal: z.string().min(1),
  }),
});

export async function POST(request: NextRequest) {
  const parsed = CheckoutRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", issues: parsed.error.issues }, { status: 400 });
  }
  const { quantity, deliveryMethod, flavourSlug, customer } = parsed.data;

  const [settings, deliveryMeta] = [await fetchSiteSettings(), getDeliveryMethod(deliveryMethod)];
  if (!deliveryMeta) {
    return NextResponse.json({ error: "Unknown delivery method" }, { status: 400 });
  }

  // Price and delivery fee are always recomputed server-side — never trust
  // client-supplied amounts when creating a payment.
  const unitPrice = settings.price;
  let deliveryFee: number;

  if (deliveryMeta.fixedPrice !== null) {
    deliveryFee = deliveryMeta.fixedPrice;
  } else {
    try {
      const rates = await getShippingQuote({
        deliveryAddress: { streetAddress: customer.street, city: customer.city, postalCode: customer.postal },
        quantity,
        declaredValueRand: quantity * unitPrice,
      });
      if (!rates.length) throw new Error("no rates");
      deliveryFee = Math.min(...rates.map((r) => r.totalCharge));
    } catch (err) {
      console.error("Courier Guy re-quote failed at checkout", err);
      return NextResponse.json(
        { error: "Could not get a Courier Guy shipping rate for this address. Try PAXI or Cape Town collection." },
        { status: 502 }
      );
    }
  }

  const subtotal = unitPrice * quantity;
  const total = subtotal + deliveryFee;
  const orderId = randomUUID();

  const order: OrderPayload = {
    orderId,
    quantity,
    flavourSlug,
    unitPrice,
    deliveryMethod,
    deliveryFee,
    subtotal,
    total,
    customer,
    createdAt: new Date().toISOString(),
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;

  try {
    const checkout = await createYocoCheckout({
      amountRand: total,
      orderId,
      lineItems: [
        { displayName: "SAVR Tomato Napoletana (500g)", quantity, priceRand: unitPrice },
        { displayName: `Delivery — ${deliveryMeta.label}`, quantity: 1, priceRand: deliveryFee },
      ],
      successUrl: `${siteUrl}/order/success?orderId=${orderId}`,
      cancelUrl: `${siteUrl}/#shop`,
      failureUrl: `${siteUrl}/order/failed?orderId=${orderId}`,
      metadata: {
        orderId,
        order: JSON.stringify(order),
      },
    });

    return NextResponse.json({ redirectUrl: checkout.redirectUrl, orderId });
  } catch (err) {
    console.error("Yoco checkout creation failed", err);
    return NextResponse.json(
      { error: "Could not start payment — check YOCO_SECRET_KEY is set to a valid test/live key" },
      { status: 502 }
    );
  }
}
