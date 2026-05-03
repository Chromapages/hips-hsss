"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Loader2, ShieldCheck } from "lucide-react";

export function CheckoutForm({ amount }: { amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard?payment_success=true`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "An unexpected error occurred.");
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="rounded-[2rem] border border-white/5 bg-zinc-950 p-6 shadow-2xl">
        <PaymentElement options={{ layout: "tabs" }} />
      </div>
      
      <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/10 p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-1">Encrypted Gateway</p>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">
            Your connection is secured with 256-bit encryption. Payment details are handled exclusively by Stripe.
          </p>
        </div>
      </div>

      <button
        disabled={isLoading || !stripe || !elements}
        className="group relative w-full h-16 items-center justify-center overflow-hidden rounded-[1.5rem] bg-white font-black tracking-tighter text-black transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-30 disabled:hover:scale-100"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 transition-opacity group-hover:opacity-10" />
        {isLoading ? (
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Authorizing...</span>
          </div>
        ) : (
          <span className="relative z-10 text-lg">Pay Securely • ${amount / 100}.00</span>
        )}
      </button>

      {message && (
        <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-400 text-xs font-bold uppercase tracking-widest text-center animate-in shake-in duration-300">
          {message}
        </div>
      )}
    </form>
  );
}
