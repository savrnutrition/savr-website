import Link from "next/link";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
      <h1 className="mb-3 font-display text-3xl font-bold text-ink">Thanks for your order</h1>
      <p className="mb-1 text-ink-soft">
        We&apos;ve received your payment and you&apos;ll get a confirmation email shortly.
      </p>
      {orderId && (
        <p className="mb-6 text-xs text-ink-soft">
          Order reference: <span className="font-mono">{orderId}</span>
        </p>
      )}
      <Link
        href="/"
        className="rounded-full bg-tomato px-6 py-3 text-sm font-semibold text-white"
      >
        Back to SAVR
      </Link>
    </main>
  );
}
