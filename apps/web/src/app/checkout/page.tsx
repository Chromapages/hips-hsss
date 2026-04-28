import { CheckoutShell } from "@/components/checkout/CheckoutShell";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-5 py-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-300">
          Checkout
        </p>
        <h1 className="mt-3 text-4xl font-bold">Complete your booking.</h1>
        <p className="mt-3 max-w-2xl text-gray-400">
          This shell is ready for Stripe Elements while preserving the required acknowledgement step.
        </p>
        <div className="mt-8">
          <CheckoutShell />
        </div>
      </section>
    </main>
  );
}
