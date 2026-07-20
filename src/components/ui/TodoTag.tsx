export function TodoTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-dashed border-ink-soft px-2.5 py-0.5 font-body text-xs text-ink-soft">
      {children}
    </span>
  );
}
