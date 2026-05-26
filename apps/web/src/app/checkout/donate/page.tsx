"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Lock } from "lucide-react";
import { RouteChrome } from "@/components/polish/RouteChrome";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function DonateCheckoutContent() {
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get("secret");

  if (!clientSecret) {
    return (
      <div className="p-8 rounded-xl border border-red-500/20 bg-red-500/5 text-center">
        <p className="text-red-400 font-medium">Invalid donation session.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm amount={0} /> {/* Amount is handled by PaymentIntent */}
      </Elements>
    </div>
  );
}

export default function DonateCheckoutPage() {
  return (
    <RouteChrome>
      <main className="min-h-screen bg-black pt-24 pb-12 px-6">
        <div className="max-w-xl mx-auto">
          <header className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-zinc-500" />
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Secure Donation</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Complete Your Contribution</h1>
            <p className="mt-3 text-zinc-400">Your support helps provide anonymous peer support to those in need.</p>
          </header>

          <Suspense fallback={<div className="text-center text-zinc-500">Loading donation gateway...</div>}>
            <DonateCheckoutContent />
          </Suspense>
        </div>
      </main>
    </RouteChrome>
  );
}
