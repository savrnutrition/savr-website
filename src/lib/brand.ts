/**
 * SAVR brand tokens — single source of truth for colours and font stacks.
 * Tailwind reads the colour values from src/app/globals.css (@theme block),
 * kept in sync with this file by hand since Tailwind v4 can't import TS.
 *
 * FONT SWAP: Tan Ashford / Tan Angleton / Neue Montreal are licensed but not
 * yet cleared for web use. Until then we fall back to Fraunces / Playfair
 * Display / Inter. To swap in the real fonts later:
 *   1. Add the @font-face rules (or next/font/local) in src/app/layout.tsx
 *   2. Point the --font-display / --font-display-secondary / --font-body
 *      CSS variables in globals.css at the new font-family names
 * No component code needs to change.
 */

export const BRAND_COLORS = {
  paper: "#f8f9f0",
  tan: "#d8bf9f",
  tomato: "#a83637",
  tomatoDark: "#832a2b",
  olive: "#a7a376",
  brown: "#844f39",
  ink: "#2a2420",
  inkSoft: "#6b6558",
  line: "#e3ddc9",
} as const;

export const FLAVOUR_COLOR: Record<string, string> = {
  tomato: BRAND_COLORS.tomato,
  olive: BRAND_COLORS.olive,
  brown: BRAND_COLORS.brown,
};
