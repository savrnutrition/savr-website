import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { fetchSiteSettings } from "@/lib/sanity/fetchContent";
import { Footer } from "@/components/site/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — SAVR Nutrition",
};

export default async function PrivacyPage() {
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
        <h1 className="mb-2 font-display text-3xl font-bold">Privacy Policy</h1>
        <p className="mb-10 font-body text-xs text-ink-soft">Last updated 20 July 2026</p>

        <div className="space-y-8 font-body text-sm leading-relaxed text-ink-soft">
          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">1. Who we are</h2>
            <p>
              SAVR Nutrition ("SAVR", "we", "us") is based in Cape Town, South Africa. This policy explains what
              personal information we collect when you use savrnutrition.co.za or place an order, why we collect
              it, and how we protect it, in line with South Africa&apos;s Protection of Personal Information Act
              (POPIA).
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">2. Information we collect</h2>
            <p>When you place an order or contact us, we collect:</p>
            <ul className="ml-5 mt-2 list-disc space-y-1">
              <li>Your name, email address, and phone number</li>
              <li>Your delivery address</li>
              <li>Order details (products, quantity, amount paid)</li>
              <li>Any message you send us via the contact form</li>
            </ul>
            <p className="mt-2">
              We do not collect or store your card details — payment is handled entirely by our payment provider,
              Yoco, on their secure payment page.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">3. How we use your information</h2>
            <p>We use your information only to:</p>
            <ul className="ml-5 mt-2 list-disc space-y-1">
              <li>Process and fulfil your order, including arranging delivery</li>
              <li>Send you order confirmations and delivery updates</li>
              <li>Respond to enquiries you send us</li>
              <li>Keep internal records of orders for accounting and customer support purposes</li>
            </ul>
            <p className="mt-2">We do not sell your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">4. Who we share it with</h2>
            <p>To fulfil your order, we share the minimum necessary information with:</p>
            <ul className="ml-5 mt-2 list-disc space-y-1">
              <li>
                <strong className="text-ink">Yoco</strong> — to process your payment
              </li>
              <li>
                <strong className="text-ink">The Courier Guy / ShipLogic</strong> — to deliver your order (if you
                choose courier delivery)
              </li>
              <li>
                <strong className="text-ink">Resend</strong> — to send order confirmation and notification emails
              </li>
              <li>
                <strong className="text-ink">Google Sheets</strong> — for our own internal order records
              </li>
            </ul>
            <p className="mt-2">Each of these providers only receives the information needed to perform their service for us.</p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">5. Data security and retention</h2>
            <p>
              We take reasonable technical and organisational measures to protect your information. We retain
              order records for as long as reasonably necessary for accounting, tax, and customer support
              purposes.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">6. Cookies</h2>
            <p>
              This website does not use tracking or advertising cookies. Basic hosting infrastructure may log
              technical information (such as IP address) for security and performance purposes.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">7. Your rights</h2>
            <p>
              Under POPIA, you have the right to ask us what personal information we hold about you, to request
              corrections, and to request deletion where we&apos;re not legally required to keep it. To exercise
              any of these rights, email us at{" "}
              <a href={`mailto:${settings.contactEmail}`} className="underline hover:opacity-70">
                {settings.contactEmail}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink">8. Changes to this policy</h2>
            <p>We may update this policy from time to time. The date at the top shows when it was last revised.</p>
          </section>
        </div>
      </main>

      <Footer settings={settings} />
    </>
  );
}
