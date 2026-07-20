import type { Metadata } from "next";
import { Fraunces, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

// FONT SWAP: replace these next/font/google calls with next/font/local once
// Tan Ashford / Tan Angleton / Neue Montreal are cleared for web use — the
// exported variable names (--font-fraunces etc.) are referenced from
// globals.css, so nothing else needs to change.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  style: ["normal"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SAVR — Savoury Protein Powder | Tomato Napoletana",
  description:
    "SAVR is a high-protein meal enhancer designed to effortlessly boost the protein content of your favourite dishes. Stir it into sauces, stews, curries and soups — 20g protein per serving.",
  metadataBase: new URL("https://savrnutrition.co.za"),
  openGraph: {
    title: "SAVR — Savoury Protein Powder",
    description:
      "Protein for your plate, not your shaker. 20g protein per 40g serving.",
    siteName: "SAVR Nutrition",
    locale: "en_ZA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {children}
      </body>
    </html>
  );
}
