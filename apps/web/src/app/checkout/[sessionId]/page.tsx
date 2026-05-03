"use client";

import { use, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { useAuth } from "@/components/auth/AuthProvider";
import { Lock } from "lucide-react";
import { Navbar } from "@/components/polish/Navbar";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const { getToken } = useAuth();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initCheckout() {
      try {
        const token = await getToken();
        if (!token) return;

        const res = await fetch("/api/checkout/create-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
          setAmount(data.amount);
        }
      } catch (error) {
        console.error("Checkout init failed:", error);
      } finally {
        setLoading(false);
      }
    }
    initCheckout();
  }, [sessionId, getToken]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black pt-32 pb-24 px-6 selection:bg-indigo-500/30">
        <div className="max-w-2xl mx-auto">
          <header className="mb-16 text-center">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Secure Payment Terminal</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.9] text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Confirm your <br />
              <span className="text-zinc-600">session access.</span>
            </h1>
            <p className="text-zinc-500 font-medium max-w-md mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
              Securely finalize your peer support booking. Your privacy is protected by our hard anonymity boundaries.
            </p>
          </header>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-t-2 border-indigo-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                </div>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 animate-pulse">Initializing Gateway</p>
            </div>
          ) : clientSecret ? (
            <div className="animate-in fade-in zoom-in-95 duration-700">
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm amount={amount} />
              </Elements>
            </div>
          ) : (
            <div className="p-12 rounded-[2rem] border border-red-500/10 bg-red-500/5 text-center">
              <span className="text-3xl mb-4 block">⚠️</span>
              <p className="text-red-400 font-black tracking-tight mb-2">Initialization Failed</p>
              <p className="text-sm text-zinc-600 font-medium max-w-xs mx-auto">Please return to your dashboard and attempt the checkout flow again.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
