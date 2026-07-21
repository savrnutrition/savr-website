export type FlavourStatus = "available" | "comingSoon";
export type FlavourColorway = "tomato" | "olive" | "brown";

export interface NutritionRow {
  label: string;
  per100g: string;
  perServing: string;
}

export interface SanityImageRef {
  asset?: { _ref: string; _id?: string; url?: string };
  alt?: string;
}

export interface Flavour {
  _id: string;
  name: string;
  slug: string;
  status: FlavourStatus;
  colorway: FlavourColorway;
  shortDescription: string;
  image?: SanityImageRef;
  servingSizeG: number;
  servingsPerContainer: number;
  nutrition: NutritionRow[];
  ingredients: string;
  allergens: string;
  storage: string;
  price?: number;
}

export interface Founder {
  _id: string;
  name: string;
  role: string;
  bio: string;
  photo?: SanityImageRef;
}

export interface PortableTextBlock {
  _key: string;
  _type: string;
  [key: string]: unknown;
}

export interface Recipe {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category: string;
  flavourName?: string;
  image?: SanityImageRef;
  body?: PortableTextBlock[];
}

export interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  isTodo?: boolean;
  order?: number;
}

export interface WhyPoint {
  title: string;
  body: string;
}

export interface HeroStat {
  label: string;
  sub: string;
}

export interface DeliveryNote {
  method: "courierguy" | "paxi" | "collect";
  note: string;
}

export interface SiteSettings {
  price: number;
  standardPrice: number;
  heroEyebrow: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroCtaLabel: string;
  heroStats: HeroStat[];
  aboutCopy: string[];
  howToUseSteps: string[];
  shopHeading: string;
  shopIntro: string;
  recipesHeading: string;
  recipesIntro: string;
  whyHeading: string;
  whyPoints: WhyPoint[];
  foundersHeading: string;
  foundersIntro: string;
  faqHeading: string;
  deliveryNotes: DeliveryNote[];
  footerText: string;
  contactEmail: string;
  instagramHandle: string;
  businessAddress: string;
  returnsPolicy: string;
}
