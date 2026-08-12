'use client'
import { useState } from "react";

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1" role="group" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n === value ? 0 : n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          className="text-2xl leading-none transition-colors"
          style={{ color: n <= (hovered || value) ? "#c0392b" : "#d1ccc4" }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

type Status = "idle" | "submitting" | "success" | "error";

export function ReviewForm() {
  const [name, setName]   = useState("");
  const [role, setRole]   = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/submit-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role: role || undefined, quote, rating: rating || undefined }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mt-10 rounded-2xl border border-line bg-white p-8 text-center">
        <p className="mb-1 font-body text-sm font-semibold text-ink">Takk for anmeldelsen! 🎉</p>
        <p className="font-body text-sm text-ink-soft">
          Vi gjennomgår den og publiserer den snart på siden.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 rounded-2xl border border-line bg-white p-8">
      <h3 className="mb-1 font-display text-xl font-bold">Leave a review</h3>
      <p className="mb-6 font-body text-sm text-ink-soft">
        Your review will appear here after a quick check by our team.
      </p>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block font-body text-xs font-semibold uppercase tracking-wider text-ink">
            Name <span className="text-tomato">*</span>
          </label>
          <input
            required
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-tomato"
          />
        </div>
        <div>
          <label className="mb-1 block font-body text-xs font-semibold uppercase tracking-wider text-ink">
            Role / title
          </label>
          <input
            maxLength={150}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Angel Investor"
            className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-tomato"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block font-body text-xs font-semibold uppercase tracking-wider text-ink">
            Your review <span className="text-tomato">*</span>
          </label>
          <textarea
            required
            minLength={10}
            maxLength={2000}
            rows={4}
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="Share your experience..."
            className="w-full resize-none rounded-xl border border-line bg-paper px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-tomato"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-2 block font-body text-xs font-semibold uppercase tracking-wider text-ink">
            Rating (optional)
          </label>
          <StarPicker value={rating} onChange={setRating} />
        </div>
        <div className="sm:col-span-2">
          {status === "error" && (
            <p className="mb-3 font-body text-sm text-tomato">
              Something went wrong — please try again.
            </p>
          )}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="rounded-full bg-tomato px-6 py-3 font-body text-sm font-semibold text-white hover:bg-tomato-dark disabled:opacity-60"
          >
            {status === "submitting" ? "Submitting…" : "Submit review"}
          </button>
        </div>
      </form>
    </div>
  );
}
