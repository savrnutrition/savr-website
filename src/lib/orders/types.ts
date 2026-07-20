import type { DeliveryMethodId } from "./deliveryMethods";

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postal: string;
}

export interface OrderPayload {
  orderId: string;
  quantity: number;
  flavourSlug: string;
  unitPrice: number;
  deliveryMethod: DeliveryMethodId;
  deliveryFee: number;
  subtotal: number;
  total: number;
  customer: CustomerDetails;
  createdAt: string;
}
