import Image from "next/image";
import type { SiteSettings } from "@/lib/content/types";
import { TodoTag } from "@/components/ui/TodoTag";

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
    </footer>
  );
}
