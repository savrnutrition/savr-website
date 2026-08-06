import type { Metadata } from "next";
import { fetchFaqs, fetchFlavours, fetchFounders, fetchRecipes, fetchSiteSettings } from "@/lib/sanity/fetchContent";
import { Header } from "@/components/site/Header";
import { HeroSection } from "@/components/site/HeroSection";
import { ShopSection } from "@/components/site/ShopSection";
import { RecipesSection } from "@/components/site/RecipesSection";
import { WhySection } from "@/components/site/WhySection";
import { FoundersSection } from "@/components/site/FoundersSection";
import { FaqSection } from "@/components/site/FaqSection";
import { ContactSection } from "@/components/site/ContactSection";
import { Footer } from "@/components/site/Footer";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Content is edited in Sanity Studio by non-technical team members — refetch
// periodically so their changes go live without needing a redeploy.
export const revalidate = 60;

const SITE_URL = "https://www.savrnutrition.co.za";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SAVR Nutrition",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  contactPoint: {
    "@type": "ContactPoint",
    email: "savrnutrition@gmail.com",
    contactType: "customer service",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Lovers' Walk, Rondebosch",
    addressLocality: "Cape Town",
    postalCode: "7700",
    addressCountry: "ZA",
  },
  sameAs: ["https://www.instagram.com/savr.nutrition"],
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "SAVR Tomato Napoletana Savoury Protein Powder",
  description:
    "South Africa's first savoury protein powder. Stir into pasta, curries and stews for 20g protein per serving.",
  image: [
    "https://cdn.sanity.io/images/82tcxo47/production/6940c0e1c4d88f59214bb591ad8a95b8d318ac39-1122x1402.jpg",
  ],
  brand: { "@type": "Brand", name: "SAVR Nutrition" },
  offers: {
    "@type": "Offer",
    priceCurrency: "ZAR",
    price: "299",
    availability: "https://schema.org/InStock",
    url: `${SITE_URL}/#shop`,
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: {
        "@type": "MonetaryAmount",
        currency: "ZAR",
      },
      shippingDestination: {
        "@type": "DefinedRegion",
        addressCountry: "ZA",
      },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        businessDays: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        },
        cutoffTime: "12:00:00Z",
        handlingTime: {
          "@type": "QuantitativeValue",
          minValue: 1,
          maxValue: 2,
          unitCode: "DAY",
        },
        transitTime: {
          "@type": "QuantitativeValue",
          minValue: 2,
          maxValue: 5,
          unitCode: "DAY",
        },
      },
    },
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "ZA",
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 30,
      returnMethod: "https://schema.org/ReturnByMail",
      returnFees: "https://schema.org/FreeReturn",
    },
  },
  nutrition: {
    "@type": "NutritionInformation",
    servingSize: "30g",
    calories: "109 calories",
    proteinContent: "20g",
  },
};

export default async function HomePage() {
  const [settings, flavours, founders, faqs, recipes] = await Promise.all([
    fetchSiteSettings(),
    fetchFlavours(),
    fetchFounders(),
    fetchFaqs(),
    fetchRecipes(),
  ]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs
      .filter((f) => !f.isTodo)
      .map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />
      <main>
        <HeroSection settings={settings} flavours={flavours} />
        <ShopSection flavours={flavours} settings={settings} />
        <RecipesSection
          recipes={recipes}
          heading={settings.recipesHeading}
          intro={settings.recipesIntro}
          emptyMessage={settings.recipesEmptyMessage}
        />
        <WhySection points={settings.whyPoints} heading={settings.whyHeading} />
        <FoundersSection founders={founders} heading={settings.foundersHeading} intro={settings.foundersIntro} />
        <FaqSection faqs={faqs} heading={settings.faqHeading} />
        <ContactSection settings={settings} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
