"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/lib/content/types";
import { TodoTag } from "@/components/ui/TodoTag";

export function FaqSection({ faqs, heading }: { faqs: FaqItem[]; heading: string }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="faq" className="scroll-mt-16 border-y border-line bg-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-8 font-display text-3xl font-bold">{heading}</h2>
        <div className="divide-y divide-line">
          {faqs.map((f, i) => (
            <div key={f._id} className="py-4">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between text-left"
              >
                <span className="font-body font-medium">{f.question}</span>
                <ChevronDown
                  className="h-4 w-4 text-ink-soft transition"
                  style={{ transform: openFaq === i ? "rotate(180deg)" : "none" }}
                />
              </button>
              {openFaq === i && (
                <div className="mt-2 font-body text-sm text-ink-soft">
                  {f.isTodo ? <TodoTag>{f.answer}</TodoTag> : f.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
