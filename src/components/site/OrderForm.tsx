"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, MapPin, Minus, Plus, Store, Truck } from "lucide-react";
import { FormField } from "@/components/ui/FormField";
import { DELIVERY_METHODS, type DeliveryMethodId } from "@/lib/orders/deliveryMethods";
import type { DeliveryNote } from "@/lib/content/types";

const DELIVERY_ICON: Record<DeliveryMethodId, typeof Truck> = {
  courierguy: Truck,
  paxi: Store,
  collect: MapPin,
};

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postal: string;
};

const EMPTY_FORM: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  street: "",
  city: "",
  postal: "",
};

export function OrderForm({ price, deliveryNotes }: { price: number; deliveryNotes: DeliveryNote[] }) {
  const [quantity, setQuantity] = useState(1);
  const [delivery, setDelivery] = useState<DeliveryMethodId>("courierguy");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [quote, setQuote] = useState<{ rate: number | null; loading: boolean; error: string | null }>({
    rate: null,
    loading: false,
    error: null,
  });

  const addressComplete = Boolean(form.street && form.city && form.postal);

  // Live Courier Guy rate — refetched whenever the address or quantity
  // changes while Courier Guy is the selected method.
  useEffect(() => {
    if (delivery !== "courierguy" || !addressComplete) return;
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setQuote({ rate: null, loading: true, error: null });
      try {
        const res = await fetch("/api/shipping/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ street: form.street, city: form.city, postal: form.postal, quantity }),
          signal: controller.signal,
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setQuote({ rate: data.rate.totalCharge, loading: false, error: null });
      } catch {
        if (!controller.signal.aborted) {
          setQuote({ rate: null, loading: false, error: "Couldn't get a live rate — you can still choose PAXI or collection." });
        }
      }
    }, 500);
    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [delivery, addressComplete, form.street, form.city, form.postal, quantity]);

  const deliveryOption = DELIVERY_METHODS.find((d) => d.id === delivery)!;
  const deliveryPrice = deliveryOption.fixedPrice ?? quote.rate;
  const subtotal = price * quantity;
  const total = subtotal + (deliveryPrice ?? 0);

  const canSubmit = useMemo(() => {
    const filled = form.firstName && form.lastName && form.email && form.phone && form.street && form.city && form.postal;
    if (!filled) return false;
    if (delivery === "courierguy" && deliveryPrice === null) return false;
    return true;
  }, [form, delivery, deliveryPrice]);

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const noteFor = (id: DeliveryMethodId) => deliveryNotes.find((n) => n.method === id)?.note ?? "";

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity, deliveryMethod: delivery, customer: form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      setSubmitted(true);
      window.location.href = data.redirectUrl;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-olive bg-paper p-8 text-center">
        <Check className="mx-auto mb-3 h-8 w-8 text-olive" />
        <p className="font-body text-lg font-semibold">Redirecting you to Yoco to complete payment…</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 rounded-2xl border border-line p-6 md:grid-cols-5">
      <div className="md:col-span-3">
        <p className="mb-4 font-body font-semibold">SAVR Tomato Napoletana · 500g</p>
        <div className="mb-6">
          <p className="mb-2 font-body text-sm font-medium">Quantity</p>
          <div className="flex w-fit items-center gap-3 rounded-full border border-line px-3 py-2">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-paper"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-6 text-center font-body text-sm">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(50, q + 1))}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-paper"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="First name" value={form.firstName} onChange={handleChange("firstName")} />
          <FormField label="Last name" value={form.lastName} onChange={handleChange("lastName")} />
          <FormField label="Email" type="email" value={form.email} onChange={handleChange("email")} className="sm:col-span-2" />
          <FormField label="Phone" value={form.phone} onChange={handleChange("phone")} className="sm:col-span-2" />
          <FormField label="Street address" value={form.street} onChange={handleChange("street")} className="sm:col-span-2" />
          <FormField label="City" value={form.city} onChange={handleChange("city")} />
          <FormField label="Postal code" value={form.postal} onChange={handleChange("postal")} />
        </div>

        <div className="mt-8">
          <p className="mb-3 font-body text-sm font-medium">Delivery method</p>
          <div className="space-y-3">
            {DELIVERY_METHODS.map((method) => {
              const Icon = DELIVERY_ICON[method.id];
              const active = delivery === method.id;
              let priceLabel: string;
              if (method.id === "courierguy") {
                if (delivery !== "courierguy") priceLabel = "Select to calculate";
                else if (!addressComplete) priceLabel = "Enter address";
                else if (quote.loading) priceLabel = "Calculating…";
                else if (quote.rate !== null) priceLabel = `+R${quote.rate}`;
                else priceLabel = "—";
              } else {
                priceLabel = method.fixedPrice === 0 ? "Free" : `+R${method.fixedPrice}`;
              }
              return (
                <button
                  type="button"
                  key={method.id}
                  onClick={() => setDelivery(method.id)}
                  className="flex w-full items-center gap-4 rounded-xl border p-4 text-left"
                  style={{
                    borderColor: active ? "var(--color-tomato)" : "var(--color-line)",
                    backgroundColor: active ? "var(--color-paper)" : "transparent",
                  }}
                >
                  <Icon className="h-5 w-5 flex-none" style={{ color: active ? "var(--color-tomato)" : "var(--color-ink-soft)" }} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-body text-sm font-semibold">{method.label}</p>
                      <p className="font-body text-sm">{priceLabel}</p>
                    </div>
                    <p className="font-body text-xs text-ink-soft">
                      {method.eta} · {noteFor(method.id)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          {delivery === "courierguy" && quote.error && (
            <p className="mt-2 font-body text-xs text-tomato">{quote.error}</p>
          )}
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="sticky top-24 rounded-2xl border border-line bg-paper p-6">
          <p className="mb-4 font-body text-sm font-semibold uppercase tracking-widest text-ink-soft">Summary</p>
          <div className="space-y-2 font-body text-sm">
            <div className="flex justify-between">
              <span>Tomato Napoletana × {quantity}</span>
              <span>R{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery ({deliveryOption.label})</span>
              <span>{deliveryPrice === null ? "TBD" : deliveryPrice === 0 ? "Free" : `R${deliveryPrice}`}</span>
            </div>
          </div>
          <div className="my-4 border-t border-line" />
          <div className="flex justify-between font-body text-base font-semibold">
            <span>Total</span>
            <span>{deliveryPrice === null ? "TBD" : `R${total}`}</span>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="mt-6 w-full rounded-full bg-tomato px-6 py-3 font-body text-sm font-semibold text-white disabled:opacity-40"
          >
            {submitting ? "Starting payment…" : "Proceed to payment"}
          </button>
          {submitError && <p className="mt-3 text-center font-body text-xs text-tomato">{submitError}</p>}
          <p className="mt-3 text-center font-body text-xs text-ink-soft">You&apos;ll be redirected to Yoco to complete payment.</p>
        </div>
      </div>
    </div>
  );
}
