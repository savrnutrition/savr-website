export type DeliveryMethodId = "courierguy" | "paxi" | "collect";

export interface DeliveryMethodMeta {
  id: DeliveryMethodId;
  label: string;
  eta: string;
  /** Fixed price in Rand, or null when the price must come from a live quote. */
  fixedPrice: number | null;
}

// Functional delivery logic (pricing tier, whether a live quote is needed)
// stays in code per the build spec — only the descriptive copy shown next
// to each option is CMS-editable (see SiteSettings.deliveryNotes).
export const DELIVERY_METHODS: DeliveryMethodMeta[] = [
  {
    id: "courierguy",
    label: "Courier Guy",
    eta: "2–4 days metro · 4–5 days regional",
    fixedPrice: null,
  },
  {
    id: "paxi",
    label: "PAXI",
    eta: "7–9 days",
    fixedPrice: 65,
  },
  {
    id: "collect",
    label: "Collect in Cape Town",
    eta: "Arrange after ordering",
    fixedPrice: 0,
  },
];

export function getDeliveryMethod(id: string): DeliveryMethodMeta | undefined {
  return DELIVERY_METHODS.find((m) => m.id === id);
}
