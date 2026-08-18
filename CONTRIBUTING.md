# Contributing to the SAVR website

This guide is written for team members who want to make changes to the website using Claude Code — no coding experience needed. Claude Code will do the actual coding; your job is to describe what you want clearly.

---

## What this guide covers

- Getting the code onto your computer
- Opening it in Claude Code
- Describing changes to Claude
- Saving and publishing your work
- What to do (and avoid)

---

## Before you start

You need:
- **Git** installed — [git-scm.com/downloads](https://git-scm.com/downloads) (click through the installer, all defaults are fine)
- **Node.js** (v20+) — [nodejs.org](https://nodejs.org) (download the LTS version)
- **Claude Code** installed — follow the instructions at [claude.ai/code](https://claude.ai/code)
- Access to the GitHub repo — ask whoever set this up to add your GitHub account

---

## Step 1 — Get the code

Open **Terminal** (Mac) or **Git Bash** (Windows) and run:

```bash
git clone https://github.com/savrnutrition/savr-website.git
cd savr-website
npm install
```

This downloads the project and installs its dependencies. You only need to do this once.

---

## Step 2 — Open in Claude Code

From inside the `savr-website` folder, run:

```bash
claude
```

Claude Code opens in your terminal. It will read the project automatically and know what it's working with.

---

## Step 3 — Describe what you want

Just type what you want changed, in plain English. Some examples:

> "Add a new FAQ question — 'Does SAVR contain gluten?' with the answer 'No, SAVR is completely gluten-free.'"

> "Change the hero heading from 'Savoury protein' to 'Fuel your meals'"

> "The returns page needs a new section about our exchange policy — here's the text: [paste text]"

> "Add a new section below the reviews called 'As seen in' with logos of media coverage"

Claude will figure out what code needs to change, show you what it's going to do, and ask for confirmation before making anything permanent. If something doesn't look right, just say so and it will adjust.

**Tip:** The more specific you are, the better. Include exact wording, where on the page the change should appear, and any context that would help.

---

## Step 4 — Review the change

Claude Code shows you what it changed before committing. Read through it — you don't need to understand the code, but if the description of what it did doesn't match what you asked for, say "that's not quite right" and explain why.

---

## Step 5 — Commit and push

When you're happy with the change, tell Claude:

> "Commit this and push to GitHub"

Claude will write a short description of the change (a "commit message") and push it to GitHub. Vercel picks it up automatically and deploys to the live site within a minute or two.

---

## Sanity edits vs code changes

**Most content changes don't need any of the above.** If you want to update:
- The price
- Homepage copy
- FAQs
- Team bios / photos
- Recipes
- Delivery descriptions

…go straight to **[savrnutrition.co.za/studio](https://savrnutrition.co.za/studio)** and edit it there. No code, no Claude, no deployment needed — just click Publish and it's live.

You only need Claude Code for changes that aren't in Studio: adding a new page section, changing layout, integrations, or anything structural.

---

## Do's and don'ts

**Do:**
- Ask Claude to check its work before committing — "run a type check" or "does the build pass?"
- Make one change at a time, especially if you're new to this
- Test the change locally with `npm run dev` before pushing if you can
- Tell Claude if something looks wrong — it will fix it

**Don't:**
- Never delete the `.env.local` file (it holds your local API keys and won't be recreated automatically)
- Never share or commit `.env.local` — it contains secrets
- Don't commit directly to `main` with `git push --force` — this can overwrite other people's work
- Don't run `npm audit fix --force` — it would break the project
- If Claude suggests something that seems risky (deleting things, force-pushing), pause and ask a second opinion

---

## Something went wrong?

- **Build failing?** Run `npm run build` and share the error with Claude — it will diagnose it.
- **Site looks different from what you expected?** It might take a minute to deploy after pushing. If it still looks wrong after 2 minutes, check the Vercel dashboard for deployment errors.
- **Accidentally committed something wrong?** Don't try to fix it with more force-pushes. Tell Claude what happened — there is almost always a safe way to undo it.
- **Not sure if a change should be in Studio or code?** Ask Claude — it will know.
