"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Lock, Shield } from "lucide-react";
import { DemoPaymentForm } from "@/components/checkout/DemoPaymentForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function DonateCheckoutContent() {
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get("secret");

  if (!clientSecret) {
    return (
      <div className="p-8 rounded-xl border border-destructive/20 bg-destructive/5 text-center">
        <p className="text-destructive font-medium font-body">Invalid donation session.</p>
      </div>
    );
  }

  const isDemo = clientSecret.startsWith('demo_');

  if (isDemo) {
    return (
      <DemoPaymentForm
        clientSecret={clientSecret}
        onSuccess={() => {
          window.location.href = `${window.location.origin}/dashboard?payment_success=true`;
        }}
      />
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm amount={0} />
      </Elements>
    </div>
  );
}

export default function DonateCheckoutClient() {
  return (
    <main id="main" tabIndex={-1} className="min-h-screen bg-black pt-24 pb-12 px-6">
      <div className="max-w-xl mx-auto">
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Lock className="w-4 h-4 text-zinc-500" />
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">Secure Donation</span>
          </div>
          <h1 className="text-3xl font-bold text-white font-heading">Complete Your Contribution</h1>
          <p className="mt-3 text-sm font-medium text-zinc-300 font-body">
            Your support helps provide anonymous peer support to those in need.
          </p>
        </header>

        <Suspense fallback={<div className="text-center text-zinc-400 font-body">Loading donation gateway...</div>}>
          <DonateCheckoutContent />
        </Suspense>

        {/* Donor Privacy Guarantee */}
        <div className="mt-8 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-left space-y-3">
          <div className="flex items-center gap-2 text-accent font-heading font-bold text-sm">
            <Shield className="w-5 h-5 text-accent" aria-hidden="true" />
            <h2>Donor Privacy Guarantee</h2>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed font-body">
            We value your support and trust. The H.I.P.S. Foundation guarantees that we do not sell, share, or trade our donors' names or personal information with any other entity, nor send mailings to our donors on behalf of other organizations. Your contribution remains completely confidential and secure.
          </p>
        </div>
      </div>
    </main>
  );
}