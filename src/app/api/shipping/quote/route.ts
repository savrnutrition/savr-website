import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getShippingQuote } from "@/lib/courierguy";

const QuoteRequestSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  postal: z.string().min(1),
  quantity: z.number().int().min(1),
});

export async function POST(request: NextRequest) {
  const parsed = QuoteRequestSchema.safeParse(await request.json());
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
