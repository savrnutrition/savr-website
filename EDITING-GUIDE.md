# Editing the SAVR website — no coding required

This is for anyone on the team who needs to update text, prices, FAQs, or photos on
savrnutrition.co.za. You don't need to know any code — everything here is done by
filling in a form, the same way you'd edit an online document.

## 1. Log in

Go to **[www.savrnutrition.co.za/studio](https://www.savrnutrition.co.za/studio)**
and log in with your Sanity account.

## 2. Two ways to edit

At the top of Studio there are two tabs: **Structure** and **Presentation**.

- **Presentation** — shows the real website. Turn on the **Edit** toggle (top left),
  then click directly on any text or photo on the page to edit it in place. This is
  the easiest way to change existing text/images while seeing exactly what you're doing.
- **Structure** — the classic list view. On the left you'll see five sections:

  - **Site Settings** — the price, homepage text, delivery descriptions, and
    footer/contact details. There's only ever one of these — it's edited in place.
  - **Flavours** — Tomato Napoletana, Creamy Basil Pesto, Pepper Sauce (product info,
    nutrition panel, ingredients).
  - **FAQ** — the questions and answers shown on the FAQ section.
  - **Founders** — team photos, names, and bios.
  - **Recipes** — title, photo, category, and the recipe itself. Each one gets its
    own page automatically once published.

  Use **Structure** for anything Presentation can't reach directly — mainly
  **adding a brand new item** (a new FAQ, a new founder, a new recipe) or
  **deleting one** (see below).

## 3. Make your change

Every field has a short grey description under its label explaining what it's for.
Just type your change into the box.

- **Text fields** — click in and type, exactly like editing a Word document.
- **Lists** (like "About SAVR" paragraphs, or nutrition panel rows) — click
  **"+ Add item"** to add a new one, or the bin icon to remove one.
- **Photos** — click the image box, choose a file to upload, then drag to set the
  focal point (this controls how the photo gets cropped on different screen sizes).
- **Dropdowns** (like a flavour's status, or a founder's position number) — just
  pick from the list.

## 4. Deleting something entirely

To remove a whole FAQ, founder, flavour, or recipe (not just clear its text, but make
it disappear completely):

1. Go to the **Structure** tab (deleting isn't available from the Presentation view).
2. Click into the relevant list (e.g. "FAQ"), then click the specific item you want gone.
3. Click the **"⋯"** menu near the top-right of the document (next to Publish) →
   **Delete**.
4. Confirm. This is immediate and doesn't need a separate "Publish" step.

## 5. Publish

Click the **Publish** button (top right of the document you're editing). Your change
goes live on the site automatically within about a minute — nobody needs to touch any
code or "redeploy" anything.

If you *don't* click Publish, your change is saved as a draft only and won't show up
on the live site yet — handy if you want to prepare something ahead of time.

## A few things to know

- **The "Slug" field on a Flavour** — just click the **Generate** button next to it.
  You almost never need to type this by hand.
- **Empty Founder cards** — a founder with no name filled in yet just won't show up
  on the live site at all, so it's safe to leave a few empty while you're still
  gathering photos/bios.
- **"Not confirmed yet" toggle on FAQs** — turn this on for an answer you're still
  double-checking (like an allergen or shelf-life claim) — it shows a "not confirmed"
  badge instead of publishing the text as fact.
- **Changes are instant but not undo-proof** — Sanity does keep version history if
  you ever need to roll back a mistake (there's a history/clock icon in the document
  toolbar), but there's no confirmation prompt before publishing, so a quick double-check
  before hitting Publish is good practice for anything customer-facing.

## Something feels broken or confusing?

Ping whoever set this up (or drop a note) rather than guessing — most things here are
safe to experiment with, but a couple of fields (delivery pricing, checkout logic) are
controlled by code, not by anything in Studio, so if a change doesn't seem to be doing
what you expect, it's worth asking rather than assuming you did something wrong.
