import Image from "next/image";

const TEAM_DESCRIPTION =
  "Behind SAVR is a team of seven University of Cape Town entrepreneurship students with one shared goal: to rethink the way people consume protein. Each founder brought a unique perspective and skill set, allowing us to transform an overlooked market gap into South Africa's first savoury protein powder. A product designed to fit seamlessly into everyday meals, not around them.";

export function FoundersSection({ heading }: { heading: string }) {
  return (
    <section id="about" className="mx-auto max-w-5xl scroll-mt-16 px-6 py-16">
      <h2 className="mb-6 font-display text-3xl font-bold">{heading}</h2>
      <Image
        src="/images/team.png"
        alt="The SAVR Nutrition team — seven UCT entrepreneurship students"
        width={1200}
        height={800}
        className="w-full rounded-2xl object-cover"
      />
      <p className="mt-6 max-w-2xl font-body text-sm leading-relaxed text-ink-soft">
        {TEAM_DESCRIPTION}
      </p>
    </section>
  );
}
