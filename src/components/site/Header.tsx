import Image from "next/image";

const NAV_LINKS = [
  { href: "#shop", label: "Shop" },
  { href: "#recipes", label: "Recipes" },
  { href: "#why", label: "Why SAVR" },
  { href: "#about", label: "About" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Image src="/images/logo.png" alt="SAVR nutrition" height={40} width={52} className="h-10 w-auto" priority />
        <nav className="hidden gap-6 font-body text-sm font-medium text-ink md:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:opacity-70">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#shop"
          className="rounded-full bg-tomato px-4 py-2 font-body text-sm font-semibold text-white hover:bg-tomato-dark"
        >
          Shop now
        </a>
      </div>
    </header>
  );
}
