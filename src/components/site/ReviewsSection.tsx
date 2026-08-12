import type { Review } from "@/lib/content/types";
import { ReviewForm } from "@/components/site/ReviewForm";

function Stars({ rating }: { rating: number }) {
  return (
    <p className="mb-3 text-base leading-none text-tomato" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </p>
  );
}

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  return (
    <section id="reviews" className="mx-auto max-w-5xl scroll-mt-16 px-6 py-16">
      {reviews.length > 0 && (
        <>
          <h2 className="mb-8 font-display text-3xl font-bold">Reviews</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <figure
                key={r._id}
                className="flex flex-col rounded-2xl border border-line bg-white p-6"
              >
                {r.rating != null && <Stars rating={r.rating} />}
                <blockquote className="flex-1 font-body text-sm leading-relaxed text-ink-soft">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 border-t border-line pt-4">
                  <p className="font-body text-sm font-semibold text-ink">{r.name}</p>
                  {r.role && (
                    <p className="font-body text-xs text-ink-soft">{r.role}</p>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        </>
      )}
      <ReviewForm />
    </section>
  );
}
