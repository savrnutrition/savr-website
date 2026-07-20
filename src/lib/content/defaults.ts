import type {
  DeliveryNote,
  FaqItem,
  Flavour,
  Founder,
  NutritionRow,
  SiteSettings,
  WhyPoint,
} from "./types";

/**
 * Fallback content — used when a field hasn't been set in Sanity yet (or
 * Sanity isn't configured at all, e.g. local dev without env vars). Copy is
 * taken verbatim from SAVR_Website_Tech_Spec.md so nothing here is a
 * developer paraphrase. Once the team edits the equivalent field in Sanity
 * Studio, the CMS value takes over — see src/lib/sanity/fetchContent.ts.
 */

export const TOMATO_NUTRITION: NutritionRow[] = [
  { label: "Energy", per100g: "1113 kJ", perServing: "445 kJ" },
  { label: "Protein", per100g: "50 g", perServing: "20 g" },
  { label: "Carbohydrate", per100g: "38 g", perServing: "15 g" },
  { label: "— of which sugar", per100g: "<1 g", perServing: "0 g" },
  { label: "Total fat", per100g: "6 g", perServing: "2 g" },
  { label: "— of which saturated", per100g: "2 g", perServing: "1 g" },
  { label: "Dietary fibre", per100g: "6 g", perServing: "3 g" },
  { label: "Sodium", per100g: "364 mg", perServing: "146 mg" },
  { label: "Potassium", per100g: "290 mg", perServing: "116 mg" },
  { label: "Iron", per100g: "7 mg", perServing: "3 mg" },
  { label: "Calcium", per100g: "16 mg", perServing: "6 mg" },
  { label: "Phosphorus", per100g: "4 mg", perServing: "2 mg" },
];

// Ingredient names are printed exactly as they appear on the current
// packaging artwork (incl. "Fimbridian Salt", "Di-Iotassium Phosphate",
// "Stevia D Bittered"). The tech spec flags these as likely label typos —
// verify with the manufacturer before the next print run, then update this
// field (or the Sanity `flavour.ingredients` field once packaging is fixed).
export const TOMATO_INGREDIENTS =
  "Soy Protein 90%, Fava Bean Protein 90%, Maize Starch Powder, Tomato Powder, MCT Oil, Garlic Powder, Onion Powder, Sunflower Lecithin, Thyme Powder, Sodium Chloride, Fimbridian Salt, Di-Iotassium Phosphate, Stevia D Bittered, and Black Pepper Powder.";

export const TOMATO_ALLERGENS =
  "Contains Soy. Manufactured in a facility that may also process milk, egg, wheat, peanuts and tree nuts.";

export const TOMATO_STORAGE =
  "Store in a cool, dry place below 25°C. Reseal after opening. Protect from moisture.";

export const DEFAULT_FLAVOURS: Flavour[] = [
  {
    _id: "default-tomato",
    name: "Tomato Napoletana",
    slug: "tomato-napoletana",
    status: "available",
    colorway: "tomato",
    shortDescription:
      "Our launch flavour — a rich, real tomato base that disappears straight into mince, pasta sauce, or rice.",
    servingSizeG: 40,
    servingsPerContainer: 13,
    nutrition: TOMATO_NUTRITION,
    ingredients: TOMATO_INGREDIENTS,
    allergens: TOMATO_ALLERGENS,
    storage: TOMATO_STORAGE,
  },
  {
    _id: "default-pesto",
    name: "Creamy Basil Pesto",
    slug: "creamy-basil-pesto",
    status: "comingSoon",
    colorway: "olive",
    shortDescription:
      "A creamy basil pesto protein blend for pasta, chicken, or roasted veg.",
    servingSizeG: 40,
    servingsPerContainer: 13,
    nutrition: [],
    ingredients: "",
    allergens: "",
    storage: "",
  },
  {
    _id: "default-pepper",
    name: "Pepper Sauce",
    slug: "pepper-sauce",
    status: "comingSoon",
    colorway: "brown",
    shortDescription:
      "A bold pepper sauce blend, built for steak, mince, and hearty dinners.",
    servingSizeG: 40,
    servingsPerContainer: 13,
    nutrition: [],
    ingredients: "",
    allergens: "",
    storage: "",
  },
];

export const DEFAULT_FOUNDERS: Founder[] = [1, 2, 3].map((i) => ({
  _id: `placeholder-founder-${i}`,
  name: "Founder name — add via CMS",
  role: "",
  bio: "Bio — add via CMS",
}));

export const DEFAULT_WHY_POINTS: WhyPoint[] = [
  {
    title: "The problem with shakes",
    body: "Most protein powders are sweet and artificial-tasting, meant to be drunk apart from your meals.",
  },
  {
    title: "A simpler list",
    body: "We keep the ingredient list short on purpose — every extra additive is something you'd have to trust.",
  },
  {
    title: "Meals, not substitutes",
    body: "Stir it into what you already cook, so protein becomes part of the meal, not another thing to remember.",
  },
];

export const DEFAULT_FAQS: FaqItem[] = [
  {
    _id: "faq-1",
    question: "What is SAVR?",
    answer:
      "SAVR is a high-protein meal enhancer — stir it into sauces, stews, curries, and soups for a protein boost without compromising on flavour.",
  },
  {
    _id: "faq-2",
    question: "How much protein is in each serving?",
    answer: "20g of protein per 40g serving (445 kJ per serving).",
  },
  {
    _id: "faq-3",
    question: "Does it taste like protein powder?",
    answer:
      "No — it's built around real savoury flavours (starting with tomato), designed to taste like the meal, not like a shake.",
  },
  {
    _id: "faq-4",
    question: "Can it be reheated?",
    answer:
      "Yes — mix it in while your dish is heating and stir until smooth and heated through.",
  },
  {
    _id: "faq-5",
    question: "Is it gluten free?",
    answer: "Not stated on current packaging copy — confirm with the team before publishing.",
    isTodo: true,
  },
  {
    _id: "faq-6",
    question: "Is it vegetarian?",
    answer:
      "The formulation is plant-based (soy and fava bean protein) — confirm final vegetarian/vegan claim wording with the team before publishing.",
    isTodo: true,
  },
  {
    _id: "faq-7",
    question: "How long does it last?",
    answer: "Best before date is set per batch at production — add once available.",
    isTodo: true,
  },
  {
    _id: "faq-8",
    question: "How should it be stored?",
    answer:
      "Store in a cool, dry place below 25°C. Reseal after opening and protect from moisture.",
  },
  {
    _id: "faq-9",
    question: "How many servings are in a pouch?",
    answer: "Each 500g pouch contains 13 servings of 40g each.",
  },
  {
    _id: "faq-10",
    question: "What are the ingredients?",
    answer: `${TOMATO_INGREDIENTS} Contains soy. Manufactured in a facility that may also process milk, egg, wheat, peanuts and tree nuts.`,
  },
];

export const DEFAULT_DELIVERY_NOTES: DeliveryNote[] = [
  { method: "courierguy", note: "Live rate calculated at checkout" },
  { method: "paxi", note: "Collect at your nearest PEP store" },
  { method: "collect", note: "Free — we'll be in touch to coordinate" },
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  price: 299,
  standardPrice: 349,
  heroHeadline: "Protein for your plate, not your shaker.",
  heroSubheadline:
    "SAVR is a savoury protein powder you stir into rice, pasta, mince or sauce — 20g of protein added to a meal you're already cooking. No shaker, no sweetness, no fuss.",
  aboutCopy: [
    "SAVR is a high-protein meal enhancer designed to effortlessly boost the protein content of your favourite dishes. Simply stir it into sauces, stews, curries, soups and more for a delicious protein boost, without compromising on flavour.",
    "Whether you're cooking for yourself or the whole family, SAVR makes hitting your protein goals simple, convenient and delicious.",
  ],
  howToUseSteps: [
    "Prepare your favourite sauce, stew, soup or curry.",
    "Stir in 1 serving (40g) of SAVR.",
    "Mix until smooth and heated through.",
    "Enjoy a protein-packed meal.",
  ],
  whyPoints: DEFAULT_WHY_POINTS,
  deliveryNotes: DEFAULT_DELIVERY_NOTES,
  footerText: "Proudly made in Cape Town, South Africa.",
  contactEmail: "savrnutrition@gmail.com",
  instagramHandle: "",
  businessAddress: "Lovers' Walk, Rondebosch, Cape Town, 7700, South Africa",
  returnsPolicy: "",
};
