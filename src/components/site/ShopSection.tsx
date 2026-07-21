import type { Flavour, SiteSettings } from "@/lib/content/types";
import { FLAVOUR_COLOR } from "@/lib/brand";
import { OrderForm } from "./OrderForm";

export function ShopSection({ flavours, settings }: { flavours: Flavour[]; settings: SiteSettings }) {
  return (
    <section id="shop" className="scroll-mt-16 border-y border-line bg-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-2 font-display text-3xl font-bold">{settings.shopHeading}</h2>
        <p className="mb-10 font-body text-sm text-ink-soft">{settings.shopIntro}</p>

        <div className="mb-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {flavours.map((f) => {
            const color = FLAVOUR_COLOR[f.colorway] ?? FLAVOUR_COLOR.tomato;
            const available = f.status === "available";
            return (
              <div
                key={f._id}
                className="rounded-2xl border p-5"
                style={{ borderColor: available ? color : "var(--color-line)" }}
              >
                <div className="mb-3 h-2 w-10 rounded-full" style={{ backgroundColor: color }} />
                <p className="font-body font-semibold">{f.name}</p>
                <p className="mt-1 font-body text-xs text-ink-soft">{f.shortDescription}</p>
                <p
                  className="mt-3 font-body text-xs font-semibold"
                  style={{ color: available ? color : "var(--color-ink-soft)" }}
                >
                  {available ? "Available now" : "Coming soon"}
                </p>
              </div>
            );
          })}
        </div>

        <OrderForm price={settings.price} deliveryNotes={settings.deliveryNotes} />
      </div>
    </section>
  );
}
