"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Lock } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

import { DemoPaymentForm } from "@/components/checkout/DemoPaymentForm";

function DonateCheckoutContent() {
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get("secret");

  if (!clientSecret) {
    return (
      <div className="p-8 rounded-xl border border-destructive/20 bg-destructive/5 text-center">
        <p className="text-destructive font-medium">Invalid donation session.</p>
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
            <Lock className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Secure Donation</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Complete Your Contribution</h1>
          <p className="mt-3 text-text">Your support helps provide anonymous peer support to those in need.</p>
        </header>

        <Suspense fallback={<div className="text-center text-muted-foreground">Loading donation gateway...</div>}>
          <DonateCheckoutContent />
        </Suspense>
      </div>
    </main>
  );
}