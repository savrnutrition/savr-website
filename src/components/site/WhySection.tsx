import type { WhyPoint } from "@/lib/content/types";

export function WhySection({ points }: { points: WhyPoint[] }) {
  return (
    <section id="why" className="scroll-mt-16 border-y border-line bg-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-8 font-display text-3xl font-bold">Why savoury?</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {points.map((p) => (
            <div key={p.title}>
              <p className="mb-2 font-body font-semibold text-olive">{p.title}</p>
              <p className="font-body text-sm text-ink-soft">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
