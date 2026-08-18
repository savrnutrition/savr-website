@AGENTS.md

# SAVR Nutrition — Claude Code context

## What this project is

E-commerce site for SAVR, a UCT startup selling savoury protein powder. Customers order on the site, pay via Yoco, and orders automatically land in a shared Google Sheet and trigger a Resend confirmation email. Content (copy, pricing, FAQs, team, recipes) is edited by non-technical team members in Sanity Studio at `/studio` with no code changes needed.

**Live:** savrnutrition.co.za | **Repo:** github.com/savrnutrition/savr-website | **Deployed on:** Vercel (auto-deploys `main`)

---

## Architecture

```
Browser → Next.js (App Router, Vercel)
             ↓
         Sanity CMS  ← team edits content here
         Yoco        ← card payments
         ShipLogic   ← Courier Guy shipping quotes
         Google Sheets ← order tracker (shared with team)
         Resend      ← transactional email
```

The site is a **single-page app** (`src/app/page.tsx`) that renders all sections. Recipes have their own pages (`/recipes/[slug]`). There's no database — Sanity is the CMS, Google Sheets is the order log.

---

## Key files

| File | Purpose |
|---|---|
| `src/app/page.tsx` | Homepage — assembles all sections |
| `src/app/layout.tsx` | Root layout, fonts, global meta, GSC verification placeholder |
| `src/app/api/checkout/route.ts` | Creates Yoco checkout session; reads price from Sanity server-side |
| `src/app/api/webhooks/yoco/route.ts` | Handles `payment.succeeded`; writes to Sheets + sends email |
| `src/app/api/check-returning-customer/route.ts` | Checks email against Sheets col E for loyalty discount |
| `src/app/api/shipping/quote/route.ts` | Live Courier Guy rate for the order form |
| `src/lib/googleSheets.ts` | Google Sheets client — `appendOrderRow()` + `isReturningCustomer()` |
| `src/lib/courierguy.ts` | ShipLogic API wrapper (quote + shipment creation) |
| `src/lib/yoco.ts` | Yoco checkout session creation |
| `src/lib/yocoWebhook.ts` | Webhook HMAC signature verification |
| `src/lib/email.ts` | Resend email helpers (order confirmation + team alert) |
| `src/lib/content/defaults.ts` | Fallback content — site renders without .env |
| `src/lib/content/types.ts` | Shared interfaces (OrderPayload, SiteSettings, Review, etc.) |
| `src/lib/orders/deliveryMethods.ts` | Delivery option config (Courier Guy, PAXI, Cape Town collection) |
| `src/lib/security/` | Rate limiter, HTML sanitiser, safe JSON body parser |
| `src/components/site/OrderForm.tsx` | Main order form — quantity, address, delivery, checkout |
| `src/components/site/ReviewForm.tsx` | Customer review submission form |
| `src/sanity/schemaTypes/` | Sanity document schemas |
| `src/lib/brand.ts` | Brand colours and font tokens |

---

## Google Sheets tracker layout (19 columns, Orders tab A–S)

| Col | Field | Who fills it |
|---|---|---|
| A | Date (Sheets serial, UTC+2) | Website |
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
| O | Tracking # | Team manually |
| P | Payment | Website (`"Paid"`) |
| Q | Delivery status | Team manually |
| R | Status updated | Team manually |
| S | Notes | Team manually |

`isReturningCustomer()` reads column E (email). `appendOrderRow()` writes using `update()` on a calculated next row (not `append()`) to avoid pre-set N-column formulas breaking row detection. Dates are written as Sheets serial numbers using `toSheetsDateSerial()`.

---

## Coding conventions

- **TypeScript** throughout — no `any`, no suppressions.
- **No comments** unless the WHY is non-obvious (a hidden constraint, a subtle invariant, a workaround for a specific bug). Never explain what the code does.
- **Server-authoritative pricing**: price is always read from Sanity in `api/checkout`, never trusted from the client.
- **Zod validation** on all public POST route request bodies.
- **Rate limiting** via `src/lib/security/rateLimit.ts` (in-memory, per-IP) on all public API routes.
- **HTML sanitisation** via `src/lib/security/html.ts` on all user-supplied text before storage.
- **`valueInputOption: "RAW"`** for all Sheets writes — prevents formula injection.
- **Tailwind v4** (CSS-first config, no `tailwind.config.js`). Design tokens live in `src/app/globals.css`.
- **App Router conventions**: server components by default; `"use client"` only where interactivity is needed.

---

## Security constraints (never violate)

- Never commit `.env.local`, `.env.vercel`, or any file containing real secrets.
- `YOCO_SECRET_KEY` for local dev stays as `sk_test_...` (sandbox); only production Vercel uses `sk_live_...`.
- `COURIER_GUY_API_KEY` for local dev stays as sandbox key with `https://api.shiplogic.com` — so local testing cannot trigger real courier bookings.
- `SANITY_API_READ_TOKEN` is server-only (not `NEXT_PUBLIC_`) — used only server-side for draft/preview mode.
- Google service account private key never appears in frontend code.
- Never run `npm audit fix --force` — it would downgrade Next.js and Sanity to incompatible versions.
- Never skip git hooks (`--no-verify`).

---

## What's been built

- **Full homepage** — Hero, Shop (order form), Why/Features, Reviews, FAQ, Recipes, Founders, Contact, Header, Footer
- **Order form** — quantity picker, full address, live Courier Guy quote (debounced), PAXI/collect options, Yoco redirect checkout
- **Returning customer loyalty discount** — 10% off when email is recognised in Sheets; checked at email blur (debounced 600ms) and enforced server-side at checkout
- **Yoco payment flow** — checkout session creation, success/failed redirect pages, webhook handler for `payment.succeeded`
- **Webhook-only order confirmation** — Sheets write + Resend emails trigger only on verified webhook, not on redirect
- **Customer review submission** — star rating + text form, submitted via API, stored in Sanity (auto-approved), displayed on site
- **Google Sheets tracker** — 19-column layout; new orders append automatically via service account; team updates tracking/delivery status manually. Includes Guide, Inventory, and Dashboard tabs (set up via Apps Script)
- **Sanity visual editing** — Presentation tool + draft mode; `VisualEditingClient` lazy-loads on client only when Studio is active
- **All Sanity schemas** — siteSettings, flavour, founder, faqItem, review, recipe
- **Security layer** — rate limiting, HTML sanitisation, Zod validation, safe JSON body parser, security headers via `next.config.ts`
- **SEO** — `robots.ts`, `sitemap.ts`, JSON-LD for product and recipes
- **Policy pages** — Privacy, Terms, Returns (static, content from Sanity)
- **Recipe pages** — dynamic `/recipes/[slug]` from Sanity
- **Contact form** — submits to `/api/contact` → Resend email

---

## Known open items / areas that may need work

- **Yoco webhook field paths** — built from public docs; verify against a real sandbox payment's raw payload in Vercel logs before going live (`src/app/api/webhooks/yoco/route.ts`)
- **Courier Guy production keys** — swap `COURIER_GUY_API_KEY` in Vercel (no code changes needed)
- **Google Search Console** — replace `REPLACE_WITH_YOUR_CODE` in `src/app/layout.tsx` with the GSC verification meta tag value
- **Web fonts** — Tan Ashford / Tan Angleton / Neue Montreal are licensed but not cleared for web; swap in `src/app/layout.tsx` + `src/lib/brand.ts`
- **Admin page** — `/admin` password-protected order management page was discussed but not built
- **Yoco payment failures** — intermittent failures being investigated with Yoco support
- **Ingredient label wording** — verify "Fimbridian Salt", "Di-Iotassium Phosphate", "Stevia D Bittered" with manufacturer
- **Business details in Sanity** — Instagram handle, business address, policy copy need real values entered in Studio

---

## Running locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build check
npx tsc --noEmit   # type check only
npm run lint       # ESLint
```

The site renders fully without any `.env.local` — fallback content in `src/lib/content/defaults.ts` covers all sections. API routes that need missing keys return safe errors.

---

## Sanity Studio

At `/studio` in development and production. Team members log in with their Sanity accounts. The `siteSettings` document is a singleton — create it once. `flavour`, `founder`, `faqItem`, and `recipe` are repeatable. `review` documents are submitted via the site form and appear in Studio for the team to manage.
