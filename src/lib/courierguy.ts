/**
 * The Courier Guy — ShipLogic API client.
 *
 * ⚠️ Verify before go-live: ShipLogic's full API reference
 * (https://developers.shiplogic.com) sits behind a JS-rendered docs site
 * that couldn't be scraped while building this, so the request/response
 * shapes below are assembled from ShipLogic's publicly documented request
 * format (used by their WooCommerce/Shopify plugins) plus the field names
 * The Courier Guy quotes in their integration guide. Run one real quote
 * against the sandbox once you have sandbox credentials
 * (https://sandbox.shiplogic.com/register) and adjust field names here if
 * the response doesn't match — everything is isolated to this file.
 */

const BASE_URL = process.env.COURIER_GUY_API_BASE_URL || "https://api.shiplogic.com";

function assertApiKey() {
  const key = process.env.COURIER_GUY_API_KEY;
  if (!key) {
    throw new Error(
      "COURIER_GUY_API_KEY is not set — add your ShipLogic sandbox key to .env.local"
    );
  }
  return key;
}

export interface ShipLogicAddress {
  streetAddress: string;
  city: string;
  postalCode: string;
  /** "business" | "residential" */
  type?: "business" | "residential";
}

export interface ShipLogicParcel {
  /** cm */
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  /** kg */
  weightKg: number;
  description?: string;
}

export interface ShipLogicRate {
  serviceLevelName: string;
  serviceLevelCode: string;
  totalCharge: number;
  currency: string;
  etaDays?: string;
}

/** Default single-pouch parcel dimensions — update once real packed dimensions are measured. */
export const DEFAULT_PARCEL: ShipLogicParcel = {
  lengthCm: 25,
  widthCm: 18,
  heightCm: 10,
  weightKg: 0.6,
  description: "SAVR protein powder pouch(es)",
};

// Cape Town warehouse/collection point — update once the team confirms
// their fulfilment address.
const COLLECTION_ADDRESS: ShipLogicAddress = {
  streetAddress: process.env.COURIER_GUY_COLLECTION_STREET || "TODO — set COURIER_GUY_COLLECTION_STREET",
  city: process.env.COURIER_GUY_COLLECTION_CITY || "Cape Town",
  postalCode: process.env.COURIER_GUY_COLLECTION_POSTAL_CODE || "8001",
  type: "business",
};

function toShipLogicAddress(a: ShipLogicAddress) {
  return {
    street_address: a.streetAddress,
    city: a.city,
    code: a.postalCode,
    country: "ZA",
    type: a.type ?? "residential",
  };
}

function toShipLogicParcel(p: ShipLogicParcel) {
  return {
    submitted_length_cm: p.lengthCm,
    submitted_width_cm: p.widthCm,
    submitted_height_cm: p.heightCm,
    submitted_weight_kg: p.weightKg,
  };
}

export async function getShippingQuote(params: {
  deliveryAddress: ShipLogicAddress;
  quantity: number;
  declaredValueRand: number;
}): Promise<ShipLogicRate[]> {
  const apiKey = assertApiKey();

  const parcels = Array.from({ length: Math.max(1, Math.ceil(params.quantity / 4)) }, () =>
    toShipLogicParcel(DEFAULT_PARCEL)
  );

  const res = await fetch(`${BASE_URL}/rates`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      collection_address: toShipLogicAddress(COLLECTION_ADDRESS),
      delivery_address: toShipLogicAddress(params.deliveryAddress),
      parcels,
      declared_value: params.declaredValueRand,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`ShipLogic rates request failed (${res.status}): ${body}`);
  }

  const data = await res.json();
  const rates = Array.isArray(data?.rates) ? data.rates : [];

  return rates.map((r: Record<string, unknown>) => ({
    serviceLevelName:
      (r.service_level as Record<string, unknown> | undefined)?.name as string ??
      (r.service_level_name as string) ??
      "Courier Guy",
    serviceLevelCode:
      ((r.service_level as Record<string, unknown> | undefined)?.code as string) ??
      (r.service_level_code as string) ??
      "",
    totalCharge: Number(r.total_charge ?? r.rate ?? 0),
    currency: (r.currency as string) ?? "ZAR",
    etaDays:
      (r.delivery_date_from as string) ??
      (r.transit_days as string | number | undefined)?.toString(),
  }));
}

export async function bookShipment(params: {
  orderId: string;
  deliveryAddress: ShipLogicAddress;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  quantity: number;
  declaredValueRand: number;
}) {
  const apiKey = assertApiKey();

  const parcels = Array.from({ length: Math.max(1, Math.ceil(params.quantity / 4)) }, () =>
    toShipLogicParcel(DEFAULT_PARCEL)
  );

  const res = await fetch(`${BASE_URL}/shipments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      collection_address: toShipLogicAddress(COLLECTION_ADDRESS),
      delivery_address: toShipLogicAddress(params.deliveryAddress),
      parcels,
      declared_value: params.declaredValueRand,
      customer_reference: params.orderId,
      delivery_contact: {
        name: params.customerName,
        mobile_number: params.customerPhone,
        email: params.customerEmail,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`ShipLogic shipment booking failed (${res.status}): ${body}`);
  }

  const data = await res.json();
  return {
    trackingReference: (data?.short_tracking_reference ?? data?.tracking_reference ?? "") as string,
    waybillUrl: (data?.waybill_url ?? data?.waybill ?? "") as string,
    raw: data,
  };
}
