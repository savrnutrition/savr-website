# SAVR Nutrition — website

The marketing and e-commerce site for SAVR's savoury protein powder. Customers browse the product, get a live shipping quote, and pay via Yoco card checkout — all from a single page. Orders land automatically in a shared Google Sheet and trigger a confirmation email. Content (copy, pricing, FAQs, recipes) is managed by the team in Sanity Studio with no code changes needed.

**Live site:** [savrnutrition.co.za](https://savrnutrition.co.za)  
**Studio (content editing):** [savrnutrition.co.za/studio](https://savrnutrition.co.za/studio)  
**Tracker sheet:** [Google Sheet](https://docs.google.com/spreadsheets/d/1z1s5o22x6Ufxsw58nfidZsvDgeQhANFKArkbO_gO9kQ) (SAVR Gmail account)  
**Deployed on:** Vercel (auto-deploys from `main`)

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| CMS | Sanity v6 (headless, with visual editing) |
| Payments | Yoco |
| Shipping quotes | The Courier Guy / ShipLogic API |
| Order tracking | Google Sheets (via service account) |
| Email | Resend |
| Hosting | Vercel |

---

## Project structure

```
src/
  app/                        # Next.js routes (App Router)
    page.tsx                  # Homepage (single-page site)
    layout.tsx                # Root layout, fonts, global meta
    api/
      checkout/               # POST — creates Yoco checkout session
      check-returning-customer/ # POST — 10% loyalty discount check
      contact/                # POST — contact form → Resend email
      shipping/quote/         # POST — live Courier Guy shipping rate
      submit-review/          # POST — customer review submission
      webhooks/yoco/          # POST — Yoco payment.succeeded handler
      draft-mode/             # Sanity draft-mode toggle
    order/success|failed/     # Yoco redirect landing pages
    recipes/[slug]/           # Dynamic recipe pages from Sanity
    studio/                   # Sanity Studio (embedded)
    privacy/ terms/ returns/  # Static policy pages

  components/site/            # Page sections (one component per section)
    HeroSection, ShopSection, WhySection, ReviewsSection,
    FaqSection, RecipesSection, FoundersSection, ContactSection,
    Header, Footer, OrderForm, ReviewForm, VisualEditingClient

  components/ui/              # Shared UI primitives
    FormField, TodoTag

  lib/
    brand.ts                  # Brand colours, font tokens
    courierguy.ts             # ShipLogic API client (quote + booking)
    email.ts                  # Resend email helpers
    googleSheets.ts           # Google Sheets service (append order row)
    yoco.ts                   # Yoco checkout session creation
    yocoWebhook.ts            # Webhook signature verification
    content/
      types.ts                # Shared TypeScript interfaces
      defaults.ts             # Fallback content (site renders without .env)
    orders/
      deliveryMethods.ts      # Delivery option config (Courier Guy, PAXI, collect)
      types.ts                # OrderPayload type
    sanity/
      client.ts               # Sanity client setup
      env.ts                  # Sanity env var validation
      fetchContent.ts         # Data-fetching helpers (GROQ queries)
      image.ts                # Sanity image URL builder
    security/
      html.ts                 # HTML sanitisation (reviews)
      rateLimit.ts            # In-memory rate limiter (per-IP)
      readJsonBody.ts         # Safe JSON body parser with size limit

  sanity/
    schemaTypes/              # Sanity document schemas
      siteSettings, flavour, founder, faqItem, review, recipe
    structure.ts              # Studio sidebar structure
    client.ts / env.ts / image.ts

public/
  images/                     # logo.png, pouch-tomato.png, team.png
```

---

## Local development

```bash
git clone https://github.com/savrnutrition/savr-website.git
cd savr-website
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Without a `.env.local`** the site still renders fully — every content field falls back to hardcoded defaults in `src/lib/content/defaults.ts`, and API routes that need a missing key return a safe error instead of crashing.

To bring integrations to life, copy `.env.example` to `.env.local` and fill in values (see sections below).

---

## Environment variables

Copy `.env.example` → `.env.local`. Never commit real values — `.env.local` is gitignored.

All variables from `.env.example` must also be added to the **Vercel project's Environment Variables** (Settings → Environment Variables) for production and preview deployments.

### Sanity (CMS)

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
SANITY_API_READ_TOKEN=           # server-only; powers live/draft preview
```

1. Create a Sanity project at [sanity.io](https://sanity.io) under the SAVR account.
2. `npx sanity init` (choose "Use existing project") fills in the project ID and dataset.
3. From sanity.io/manage → API → Tokens, create a **Viewer** token → `SANITY_API_READ_TOKEN`.

### Yoco (payments)

```
YOCO_SECRET_KEY=sk_test_...      # swap for sk_live_... when going live
YOCO_WEBHOOK_SECRET=whsec_...
```

- Yoco Business Portal → Selling Online → Payment Gateway → secret key.
- Add a webhook at `https://savrnutrition.co.za/api/webhooks/yoco` subscribed to `payment.succeeded` → copy its signing secret.
- Payment confirmation happens **only** via the webhook, never the success-page redirect.

### Courier Guy / ShipLogic (shipping)

```
COURIER_GUY_API_KEY=                                   # sandbox key for local dev
COURIER_GUY_API_BASE_URL=https://api.shiplogic.com     # sandbox URL for local dev
COURIER_GUY_COLLECTION_STREET=
COURIER_GUY_COLLECTION_CITY=Cape Town
COURIER_GUY_COLLECTION_POSTAL_CODE=
```

- Sandbox account: [sandbox.shiplogic.com/register](https://sandbox.shiplogic.com/register).
- Production: key from [portal.thecourierguy.co.za](https://portal.thecourierguy.co.za) → Integrations → API Keys. Base URL stays the same.
- Only `COURIER_GUY_API_KEY` (and optionally `COURIER_GUY_API_BASE_URL`) needs changing between sandbox and production.

### Google Sheets (order tracker)

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=     # paste entire PEM block including \n
GOOGLE_SHEET_ID=1z1s5o22x6Ufxsw58nfidZsvDgeQhANFKArkbO_gO9kQ
```

The tracker sheet uses a **19-column layout** (Orders tab, columns A–S):

| Col | Field | Filled by |
|---|---|---|
| A | Date (Sheets serial) | Website |
| B | Order ID | Website |
| C | Source | Website (`"Website"`) |
| D | Customer name | Website |
| E | Email | Website |
| F | Phone | Website |
| G | Address | Website |
| H | Qty | Website |
| I | Flavour | Website |
| J | Unit price | Website |
| K | Discount % | Website (10 or 0) |
| L | Delivery method | Website |
| M | Delivery fee | Website |
| N | Total | Website |
| O | Tracking # | Team (manually) |
| P | Payment | Website (`"Paid"`) |
| Q | Delivery status | Team (manually) |
| R | Status updated | Team (manually) |
| S | Notes | Team (manually) |

Setup steps:
1. Google Cloud Console (under SAVR account) → create project → enable **Google Sheets API** → create service account → download JSON key.
2. Set `GOOGLE_SERVICE_ACCOUNT_EMAIL` = `client_email` from JSON, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` = `private_key` (paste including `\n`).
3. Share the SAVR tracker sheet with the service account email as **Editor**.
4. The sheet already has the Guide tab explaining manual vs automatic columns.

### Email (Resend)

```
RESEND_API_KEY=
RESEND_FROM_ADDRESS="SAVR Nutrition <orders@savrnutrition.co.za>"
TEAM_NOTIFICATION_EMAIL=
```

- Create a Resend account under the SAVR email, verify `savrnutrition.co.za`, generate an API key.
- `TEAM_NOTIFICATION_EMAIL` gets the "new paid order" alert.

### Site

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000   # → https://savrnutrition.co.za in prod
```

---

## Deployment

The site auto-deploys to Vercel on every push to `main`.

1. Vercel project imports this GitHub repo (github.com/savrnutrition/savr-website).
2. All env vars from `.env.example` are set in Vercel → Settings → Environment Variables.
3. `NEXT_PUBLIC_SITE_URL` = `https://savrnutrition.co.za` in production.
4. DNS: `savrnutrition.co.za` registered at Afrihost, nameservers pointed at Vercel (A/ALIAS for root, CNAME for `www` — Vercel shows the exact records).

---

## Content management (Sanity Studio)

Non-technical team members edit content at `/studio` — no code changes needed.

- **Site Settings** — price, homepage copy, delivery descriptions, contact info, footer.
- **Flavours** — product copy, nutrition panel, ingredients per SKU.
- **FAQ** — questions and answers with a "not confirmed" flag for unverified claims.
- **Founders** — team bios and photos.
- **Recipes** — recipe pages (auto-get their own URL when published).
- **Reviews** — customer reviews submitted via the site; appear after team approval.

See `EDITING-GUIDE.md` for a step-by-step non-technical editing guide.

---

## Key technical decisions

**Server-authoritative pricing**: The unit price is read from Sanity on the server in `/api/checkout` and never trusted from the client. Discount eligibility (returning customer check against the Sheet) is also server-side — the UI badge is cosmetic only.

**Returning customer loyalty discount**: When a customer's email is found in the Orders sheet (column E), they get 10% off. Checked at email blur in the form (debounced 600ms) and again server-side at checkout.

**Webhook-only order confirmation**: A Yoco `payment.succeeded` webhook is the only trigger for writing to Google Sheets and sending emails. The success-page redirect is purely cosmetic — a customer closing their browser before redirecting back still gets confirmed.

**Sanity visual editing**: The site runs Sanity's Presentation tool in the Studio route. The `VisualEditingClient` component loads lazily on the client only when Studio sets the draft-mode cookie, so there's no production overhead.

**Date serials for Sheets**: Order dates are written as Google Sheets serial numbers (days since Dec 30 1899, adjusted to SA local time UTC+2) so dashboard date-comparison formulas (COUNTIFS, SUMPRODUCT) work correctly.

**Security**: All public POST routes are rate-limited per IP (in-memory). Request bodies are size-limited and Zod-validated. Customer-supplied text goes through HTML sanitisation before storage. `valueInputOption: "RAW"` prevents formula injection via Sheets.

---

## Known open items

- **Yoco webhook shape**: The handler in `src/app/api/webhooks/yoco/route.ts` was built from Yoco's public docs. Send one real sandbox payment, check Vercel function logs for the raw payload, and verify the field paths match.
- **Courier Guy production key**: The codebase targets the sandbox API. Swap `COURIER_GUY_API_KEY` and `COURIER_GUY_API_BASE_URL` in Vercel for production keys — no code changes needed.
- **Web fonts**: Tan Ashford / Tan Angleton / Neue Montreal / Copperplate are licensed but not cleared for web use. The site uses Fraunces, Playfair Display, and Inter as free fallbacks. Swapping is a font-loader + CSS variable change in `src/app/layout.tsx` and `src/lib/brand.ts`.
- **Google Search Console**: Replace `REPLACE_WITH_YOUR_CODE` in `src/app/layout.tsx` with the GSC verification meta tag value.
- **Business details**: Instagram handle, business address, and returns/delivery policy text are Sanity `siteSettings` fields — just need real copy entered in Studio.
- **Ingredient label wording**: "Fimbridian Salt", "Di-Iotassium Phosphate", "Stevia D Bittered" — verify with manufacturer before launch.
- **Yoco card payment failures**: Awaiting response from Yoco support on intermittent payment failures.

---

## Account ownership

Every third-party account (Vercel, Sanity, Google Cloud, Resend, Yoco) is under the **SAVR team email**, not a personal account. Add developers as collaborators/members on each service — this keeps the team in control if a developer relationship ends.
