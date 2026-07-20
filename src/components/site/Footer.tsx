import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/lib/content/types";
import { TodoTag } from "@/components/ui/TodoTag";

const LEGAL_LINKS = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/returns", label: "Shipping & Returns" },
];

export function Footer({ settings }: { settings: SiteSettings }) {
  const isPlaceholder = settings.footerText.startsWith("Returns/delivery policy");

  return (
    <footer className="border-t border-line py-10 text-center font-body text-sm text-ink-soft">
      <Image
        src="/images/logo.png"
        alt="SAVR nutrition"
        height={32}
        width={42}
        className="mx-auto mb-3 h-8 w-auto"
      />
      <p>
        © {new Date().getFullYear()} SAVR Nutrition.{" "}
        {isPlaceholder ? <TodoTag>{settings.footerText}</TodoTag> : settings.footerText}
      </p>
      <nav className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
        {LEGAL_LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="hover:opacity-70">
            {l.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
