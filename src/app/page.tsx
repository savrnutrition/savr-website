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

// Content is edited in Sanity Studio by non-technical team members — refetch
// periodically so their changes go live without needing a redeploy.
export const revalidate = 60;

export default async function HomePage() {
  const [settings, flavours, founders, faqs, recipes] = await Promise.all([
    fetchSiteSettings(),
    fetchFlavours(),
    fetchFounders(),
    fetchFaqs(),
    fetchRecipes(),
  ]);

  return (
    <>
      <Header />
      <main>
        <HeroSection settings={settings} flavours={flavours} />
        <ShopSection flavours={flavours} settings={settings} />
        <RecipesSection recipes={recipes} heading={settings.recipesHeading} intro={settings.recipesIntro} />
        <WhySection points={settings.whyPoints} heading={settings.whyHeading} />
        <FoundersSection founders={founders} heading={settings.foundersHeading} intro={settings.foundersIntro} />
        <FaqSection faqs={faqs} heading={settings.faqHeading} />
        <ContactSection settings={settings} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
