import Image from "next/image";
import type { Flavour, SiteSettings } from "@/lib/content/types";
import { TOMATO_ALLERGENS, TOMATO_INGREDIENTS, TOMATO_NUTRITION, TOMATO_STORAGE } from "@/lib/content/defaults";
import { urlForImage } from "@/sanity/image";

export function HeroSection({ settings, flavours }: { settings: SiteSettings; flavours: Flavour[] }) {
  const heroFlavour = flavours.find((f) => f.slug === "tomato-napoletana");
  const heroImageUrl = urlForImage(heroFlavour?.image)?.width(480).height(600).url();

  return (
    <section className="mx-auto max-w-5xl px-6 pb-16 pt-14">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.2em] text-tomato">
            Savoury protein · Tomato Napoletana
          </p>
          <h1 className="font-display text-5xl font-black leading-[1.03] tracking-tight md:text-6xl">
            {settings.heroHeadline}
          </h1>
          <p className="mt-5 font-body text-lg text-ink-soft">{settings.heroSubheadline}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#shop"
              className="rounded-full bg-tomato px-6 py-3 font-body text-base font-semibold text-white hover:bg-tomato-dark"
            >
              Shop Tomato Napoletana
            </a>
            <span className="font-body text-lg font-semibold">R{settings.price}</span>
          </div>
        </div>
        <div className="relative flex justify-center">
          <Image
            src={heroImageUrl || "/images/pouch-tomato.png"}
            alt="SAVR Tomato Napoletana pouch"
            width={480}
            height={600}
            className="w-full max-w-sm rounded-2xl"
            priority
          />
        </div>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-6 border-t border-line pt-10 sm:grid-cols-4">
        {BENEFITS.map((b) => (
          <div key={b.label}>
            <p className="font-display text-xl font-bold text-tomato">{b.label}</p>
            <p className="font-body text-xs text-ink-soft">{b.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 max-w-2xl rounded-2xl border border-line bg-white p-6">
        <h2 className="mb-4 font-display text-2xl font-bold">About SAVR</h2>
        {settings.aboutCopy.map((para, i) => (
          <p key={i} className="mb-3 font-body text-sm leading-relaxed text-ink-soft last:mb-0">
            {para}
          </p>
        ))}
      </div>

      <div className="mt-14">
        <h2 className="mb-6 font-display text-2xl font-bold">How to use it</h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {settings.howToUseSteps.map((step, i) => (
            <div key={i}>
              <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-tomato font-body text-sm font-semibold text-white">
                {i + 1}
              </span>
              <p className="font-body text-sm text-ink-soft">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 rounded-2xl border border-line bg-white p-8 grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="rounded-2xl bg-ink p-6 text-paper">
          <p className="mb-1 font-body text-xs uppercase tracking-widest text-tan">
            Typical nutritional information
          </p>
          <p className="mb-4 font-body text-xs text-tan">Serving size: 40g · Servings per container: 13</p>
          <table className="w-full font-body text-sm">
            <thead>
              <tr className="border-b border-[#4a443c]">
                <th className="py-2 text-left font-medium text-tan"></th>
                <th className="py-2 text-right font-medium text-tan">Per 100g</th>
                <th className="py-2 text-right font-medium text-tan">Per serving</th>
              </tr>
            </thead>
            <tbody>
              {TOMATO_NUTRITION.map((row) => (
                <tr key={row.label} className="border-b border-[#3a362e]">
                  <td className="py-1.5">{row.label}</td>
                  <td className="py-1.5 text-right">{row.per100g}</td>
                  <td className="py-1.5 text-right">{row.perServing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h3 className="mb-3 font-body text-lg font-semibold">Ingredients</h3>
          <p className="mb-4 font-body text-sm text-ink-soft">{TOMATO_INGREDIENTS}</p>
          <h3 className="mb-2 mt-6 font-body text-lg font-semibold">Allergens</h3>
          <p className="mb-4 font-body text-sm text-ink-soft">{TOMATO_ALLERGENS}</p>
          <h3 className="mb-2 font-body text-lg font-semibold">Storage</h3>
          <p className="font-body text-sm text-ink-soft">{TOMATO_STORAGE}</p>
        </div>
      </div>
    </section>
  );
}

const BENEFITS = [
  { label: "20g protein", sub: "per 40g serving" },
  { label: "13 servings", sub: "per 500g pouch" },
  { label: "445 kJ", sub: "per serving" },
  { label: "Made for real meals", sub: "sauces, stews, curries, soups" },
];
