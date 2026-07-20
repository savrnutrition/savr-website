import Link from "next/link";

export default async function OrderFailedPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
      <h1 className="mb-3 font-display text-3xl font-bold text-ink">Payment didn&apos;t go through</h1>
      <p className="mb-1 text-ink-soft">
        No charge was made. You can try again, or contact us if this keeps happening.
      </p>
      {orderId && (
        <p className="mb-6 text-xs text-ink-soft">
          Order reference: <span className="font-mono">{orderId}</span>
        </p>
      )}
      <Link href="/#shop" className="rounded-full bg-tomato px-6 py-3 text-sm font-semibold text-white">
        Try again
      </Link>
    </main>
  );
}
