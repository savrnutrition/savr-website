import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { fetchSiteSettings } from "@/lib/sanity/fetchContent";
import { Footer } from "@/components/site/Footer";

export const metadata: Metadata = {
  title: "Shipping & Returns — SAVR Nutrition",
};

export default async function ReturnsPage() {
  const settings = await fetchSiteSettings();

  return (
    <>
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Image src="/images/logo.png" alt="SAVR nutrition" height={40} width={52} className="h-10 w-auto" />
          </Link>
          <Link href="/" className="font-body text-sm font-medium text-ink hover:opacity-70">
            Back to SAVR
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="mb-2 font-display text-3xl font-bold">Shipping &amp; Returns</h1>
        <p className="mb-10 font-body text-xs text-ink-soft">Last updated 20 July 2026</p>

        <div className="space-y-8 font-body text-sm leading-relaxed text-ink-soft">
          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Delivery options</h2>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <strong className="text-ink">The Courier Guy</strong> — door-to-door delivery, roughly 2–4 business
                days for metro areas and 4–5 business days regionally. The exact rate is calculated live at
                checkout based on your address.
              </li>
              <li>
                <strong className="text-ink">PAXI</strong> — collect from your nearest PEP store, roughly 7–9
                business days, flat rate of R65.
              </li>
              <li>
                <strong className="text-ink">Collect in Cape Town</strong> — free. We&apos;ll contact you after
                ordering to arrange a collection time and place.
              </li>
            </ul>
            <p className="mt-2">
              We currently deliver within South Africa only. Delivery estimates are provided in good faith and are
              not guaranteed — delays with our courier partners are outside our control.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Damaged, faulty, or incorrect items</h2>
            <p>
              If your order arrives damaged, faulty, or different from what you ordered, contact us within 48 hours
              of delivery at{" "}
              <a href={`mailto:${settings.contactEmail}`} className="underline hover:opacity-70">
                {settings.contactEmail}
              </a>{" "}
              with your order reference and a photo of the issue. We&apos;ll arrange a full replacement or refund
              at no cost to you.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Change of mind returns</h2>
            <p>
              Because SAVR is a food product, for hygiene and safety reasons we can only accept change-of-mind
              returns on <strong className="text-ink">unopened, sealed pouches</strong> within{" "}
              <strong className="text-ink">7 days</strong> of delivery. Opened or used product cannot be returned
              unless it is faulty. To start a return, email us at{" "}
              <a href={`mailto:${settings.contactEmail}`} className="underline hover:opacity-70">
                {settings.contactEmail}
              </a>{" "}
              with your order reference. You are responsible for return shipping costs unless the item is faulty
              or was sent in error.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Refunds</h2>
            <p>
              Once we&apos;ve received and inspected a return (or confirmed a delivery issue), we&apos;ll process
              your refund to the original payment method within 7–10 business days.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">Questions</h2>
            <p>
              Reach out any time at{" "}
              <a href={`mailto:${settings.contactEmail}`} className="underline hover:opacity-70">
                {settings.contactEmail}
              </a>{" "}
              — see our{" "}
              <Link href="/terms" className="underline hover:opacity-70">
                Terms of Service
              </Link>{" "}
              for our full terms.
            </p>
          </section>
        </div>
      </main>

      <Footer settings={settings} />
    </>
  );
}
