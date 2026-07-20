import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { fetchSiteSettings } from "@/lib/sanity/fetchContent";
import { Footer } from "@/components/site/Footer";

export const metadata: Metadata = {
  title: "Terms of Service — SAVR Nutrition",
};

export const revalidate = 60;

export default async function TermsPage() {
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
        <h1 className="mb-2 font-display text-3xl font-bold">Terms of Service</h1>
        <p className="mb-10 font-body text-xs text-ink-soft">Last updated 20 July 2026</p>

        <div className="space-y-8 font-body text-sm leading-relaxed text-ink-soft">
          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">1. About these terms</h2>
            <p>
              These Terms of Service govern your use of the SAVR Nutrition website (savrnutrition.co.za) and any
              purchase you make through it. By placing an order with us, you agree to these terms. SAVR Nutrition
              is based in Cape Town, South Africa.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">2. Products and pricing</h2>
            <p>
              We sell savoury protein powder products, currently SAVR Tomato Napoletana (500g). Prices are listed
              in South African Rand (ZAR) and include VAT where applicable. We reserve the right to change prices,
              product descriptions, and availability at any time without prior notice; the price shown at checkout
              is the price you will be charged.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">3. Orders and payment</h2>
            <p>
              Payments are processed securely by Yoco, a registered South African payment service provider. We do
              not store your card details. An order is only confirmed once payment has been successfully processed
              and you receive a confirmation email. We reserve the right to refuse or cancel an order (for example
              due to stock unavailability or a suspected error in pricing), in which case any payment already made
              will be refunded in full.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">4. Delivery</h2>
            <p>
              We deliver within South Africa via The Courier Guy, PAXI (PEP store collection), or free collection
              from our Cape Town base, as selected at checkout. Estimated delivery times are shown at checkout and
              are not guaranteed — see our{" "}
              <Link href="/returns" className="underline hover:opacity-70">
                Shipping &amp; Returns
              </Link>{" "}
              page for details.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">5. Returns, refunds and cancellations</h2>
            <p>
              Please see our{" "}
              <Link href="/returns" className="underline hover:opacity-70">
                Shipping &amp; Returns
              </Link>{" "}
              page for our full returns and refund policy.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">6. Product and health information</h2>
            <p>
              SAVR products are a food/meal-enhancer product, not a medicine or a substitute for a varied, balanced
              diet. Please check the ingredients and allergen information on each product page before purchasing,
              particularly if you have any food allergies or intolerances. If you are pregnant, breastfeeding, on
              medication, or have a medical condition, consult a healthcare professional before adding any new
              product to your diet. Keep out of reach of children.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">7. Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, SAVR Nutrition is not liable for any indirect or
              consequential loss arising from your use of this website or our products. Nothing in these terms
              excludes or limits any liability that cannot be excluded or limited under South African law,
              including the Consumer Protection Act 68 of 2008.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">8. Governing law</h2>
            <p>These terms are governed by the laws of South Africa.</p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">9. Contact us</h2>
            <p>
              Questions about these terms? Email us at{" "}
              <a href={`mailto:${settings.contactEmail}`} className="underline hover:opacity-70">
                {settings.contactEmail}
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer settings={settings} />
    </>
  );
}
