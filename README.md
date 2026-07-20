# SAVR Nutrition — website

Next.js (App Router) site for SAVR's savoury protein powder launch. Content
is edited by the team in Sanity Studio (`/studio`); payments run through
Yoco; shipping quotes/bookings run through The Courier Guy's ShipLogic API;
paid orders are written to a shared Google Sheet and trigger Resend emails.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without any `.env.local`
set up, the site still renders fully — every content field falls back to the
copy in `src/lib/content/defaults.ts` (taken verbatim from the tech spec),
and API routes that need a missing key return a clear error instead of
crashing the page.

Copy `.env.example` to `.env.local` and fill in real values to bring each
integration to life. Each section below says where those values come from.

## Accounts — who owns what

Every third-party account (Vercel, Sanity, Google Cloud service account,
Resend, Yoco) should be created under the **team's own SAVR email**, not a
personal one. Add the developer as a collaborator/member on each — this
keeps the team as the account owner if the developer relationship ends.

## Content management (Sanity)

1. Create a free Sanity project under the team's account at
   [sanity.io](https://www.sanity.io).
2. From this folder, run `npx sanity init` and choose "Use existing
   project" — this fills in `NEXT_PUBLIC_SANITY_PROJECT_ID` /
   `NEXT_PUBLIC_SANITY_DATASET` for you. Add them to `.env.local` and to the
   Vercel project's environment variables.
3. Non-technical team members log in at `https://savrnutrition.co.za/studio`
   (or `localhost:3000/studio` locally) with their Sanity account to edit:
   price, product/flavour copy, nutrition panels, delivery method notes,
   footer text, founder bios, FAQ, and recipes. Changes go live immediately
   — no redeploy.
4. Courier Guy quoting/booking, Yoco checkout, and Google Sheets/email
   fulfilment are **not** in Sanity — they're code, per the build spec.

The `siteSettings` document is a singleton (create it once — the Studio's
"Site Settings" entry in the sidebar points straight at it). `flavour`,
`founder`, `faqItem`, and `recipe` are repeatable document types.

## Payments (Yoco)

- Yoco Business Portal → Selling Online → Payment Gateway → grab the
  **test** secret key first (`sk_test_...`), set it as `YOCO_SECRET_KEY`.
- In the same portal, add a webhook pointing at
  `https://<your-domain>/api/webhooks/yoco`, subscribed to
  `payment.succeeded`. Copy its signing secret into `YOCO_WEBHOOK_SECRET`.
- Payment confirmation happens **only** via that webhook (`src/app/api/webhooks/yoco/route.ts`),
  never from the success-page redirect alone — a customer can close the tab
  before redirecting back.
- Swap to the live secret key (and a live webhook + secret) when ready to
  go live. Nothing else changes.
- ⚠️ The exact webhook payload shape (`src/app/api/webhooks/yoco/route.ts`)
  was built from Yoco's public docs/reference integrations, since their
  full docs site couldn't be scraped while building this. Send yourself one
  real test payment in the sandbox, check the Vercel function logs for the
  raw payload, and adjust the field paths there if anything doesn't match.

## Shipping (Courier Guy / ShipLogic)

- Register a sandbox account at
  [sandbox.shiplogic.com/register](https://sandbox.shiplogic.com/register)
  and grab a sandbox API key → `COURIER_GUY_API_KEY`.
- Set `COURIER_GUY_COLLECTION_STREET` / `_CITY` / `_POSTAL_CODE` to wherever
  SAVR ships orders from.
- ⚠️ Same caveat as Yoco: `src/lib/courierguy.ts` implements the well-known
  ShipLogic request/response shape (`collection_address`,
  `delivery_address`, `parcels`, Bearer auth), but the full field reference
  sits behind a JS-rendered docs site. Run one real sandbox quote and
  compare against the response before going live — everything is isolated
  to that one file.
- PAXI and free Cape Town collection are **manual** options — no API calls,
  just captured on the order (per the build spec).
- Once you have production API keys, only `COURIER_GUY_API_KEY` (and
  `COURIER_GUY_API_BASE_URL` if it differs) needs to change.

## Order overview (Google Sheets)

1. In Google Cloud Console (under the team's account), create a project,
   enable the **Google Sheets API**, and create a service account.
2. Download its JSON key. Set `GOOGLE_SERVICE_ACCOUNT_EMAIL` to the
   `client_email` field and `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` to the
   `private_key` field (paste it as-is, including the `\n` sequences).
3. Create a Google Sheet under the team's account with a tab named
   `Orders` and a header row: Order ID, Name, Email, Phone, Address,
   Quantity, Delivery Method, Total, Date, Status.
4. Share that Sheet with the service account's email (Editor access).
5. Copy the Sheet ID (from its URL) into `GOOGLE_SHEET_ID`.

## Email (Resend)

- Create a free Resend account under the team's email, verify the
  `savrnutrition.co.za` sending domain, and generate an API key →
  `RESEND_API_KEY`.
- `TEAM_NOTIFICATION_EMAIL` is where the "new paid order" alert goes.
- `RESEND_FROM_ADDRESS` is what customers see as the sender on their order
  confirmation.

## Deployment (Vercel)

1. Create a Vercel project under the team's account, import this repo.
2. Add every variable from `.env.example` to the Vercel project's
   Environment Variables (Production **and** Preview, so PR previews work
   too).
3. Set `NEXT_PUBLIC_SITE_URL` to the production domain
   (`https://savrnutrition.co.za`) once DNS is pointed there.
4. Domain: keep `savrnutrition.co.za` registered at Afrihost, but point its
   DNS at Vercel (Vercel's project settings show the exact records to add —
   typically an `A`/`ALIAS` record for the root domain and a `CNAME` for
   `www`). This is a DNS change only; no hosting/FTP migration needed since
   this is a Vercel-hosted app, not a cPanel/PHP site.

## Fonts

Tan Ashford / Tan Angleton / Neue Montreal / Copperplate are licensed but
not yet cleared for web use. The site currently uses Fraunces (display),
Playfair Display (secondary display, italic), and Inter (body) as close
free fallbacks. To swap in the real fonts once licensed, see the comment at
the top of `src/app/layout.tsx` and `src/lib/brand.ts` — it's a font-loader
swap plus a CSS variable change, no component code needs to touch.

## Known open items (from the tech spec, as of 20 July 2026)

These aren't blockers for local development, but should be resolved before
go-live:

- Ingredient label wording ("Fimbridian Salt", "Di-Iotassium Phosphate",
  "Stevia D Bittered") needs verifying with the manufacturer — currently
  shown exactly as printed on packaging artwork.
- Web font licences for Tan Ashford / Tan Angleton / Neue Montreal.
- Courier Guy production API key (site currently targets their sandbox).
- Business address, Instagram handle, returns/delivery policy text — these
  are Sanity `siteSettings` fields, just need real copy from the team.
- Founder bios/photos and recipe content are Phase 2 — schemas exist in
  Sanity (`founder`, `recipe`) but are empty placeholders until then.
