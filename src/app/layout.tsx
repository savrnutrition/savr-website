import type { Metadata } from "next";
import { Fraunces, Playfair_Display, Inter } from "next/font/google";
import { draftMode } from "next/headers";
import { VisualEditingClient } from "@/components/site/VisualEditingClient";
import Script from "next/script";
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

const SITE_URL = "https://www.savrnutrition.co.za";
const OG_IMAGE = `${SITE_URL}/images/pouch-tomato.png`;

export const metadata: Metadata = {
  title: "SAVR Nutrition | South Africa's First Savoury Protein Powder",
  description:
    "SAVR is South Africa's first savoury protein powder. Add 20g protein to pasta, curries & stews. No shakes, no sweet flavours. Pre-order now.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "REPLACE_WITH_YOUR_CODE",
  },
  openGraph: {
    title: "SAVR Nutrition | South Africa's First Savoury Protein Powder",
    description:
      "South Africa's first savoury protein powder. Add 20g protein to pasta, curries & stews. No shakes, no sweet flavours.",
    siteName: "SAVR Nutrition",
    locale: "en_ZA",
    type: "website",
    url: SITE_URL,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "SAVR Tomato Napoletana 510g savoury protein powder pouch",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SAVR Nutrition | South Africa's First Savoury Protein Powder",
    description:
      "South Africa's first savoury protein powder. Add 20g protein to pasta, curries & stews.",
    images: [OG_IMAGE],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {children}
        {isDraftMode && <VisualEditingClient />}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YDXJ147K5K"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YDXJ147K5K');
          `}
        </Script>
      </body>
    </html>
  );
}
