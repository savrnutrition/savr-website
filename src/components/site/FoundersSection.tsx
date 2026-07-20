import Image from "next/image";
import type { Founder } from "@/lib/content/types";
import { urlForImage } from "@/sanity/image";
import { TodoTag } from "@/components/ui/TodoTag";

export function FoundersSection({ founders }: { founders: Founder[] }) {
  return (
    <section id="about" className="mx-auto max-w-5xl scroll-mt-16 px-6 py-16">
      <h2 className="mb-2 font-display text-3xl font-bold">Meet the founders</h2>
      <p className="mb-8 font-body text-sm text-ink-soft">Founder photos, names, and bios to be added by the team.</p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {founders.map((f) => {
          const photoUrl = urlForImage(f.photo)?.width(160).height(160).url();
          return (
            <div key={f._id} className="rounded-2xl border border-line p-5 text-center">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={f.name}
                  width={80}
                  height={80}
                  className="mx-auto mb-3 h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="mx-auto mb-3 h-20 w-20 rounded-full bg-tan" />
              )}
              <p className="font-body text-sm font-semibold">{f.name}</p>
              {f.bio.startsWith("Bio —") ? (
                <div className="mt-1">
                  <TodoTag>{f.bio}</TodoTag>
                </div>
              ) : (
                <p className="mt-1 font-body text-xs text-ink-soft">{f.bio}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
