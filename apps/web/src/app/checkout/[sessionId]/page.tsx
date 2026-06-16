"use client";

import { use, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Lock } from "lucide-react";
import { Navbar } from "@/components/polish/Navbar";
import dynamic from "next/dynamic";

const PaymentGateway = dynamic(
  () => import("@/components/checkout/PaymentGateway"),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center py-20 gap-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-t-2 border-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text animate-pulse">Loading Secure Gateway</p>
      </div>
    ),
  }
);

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
      <main id="main" tabIndex={-1} className="min-h-screen bg-black pt-32 pb-24 px-6 selection:bg-primary/30">
        <div className="max-w-2xl mx-auto">
          <header className="mb-16 text-center">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-surface/5 border border-white/10 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Secure Payment Terminal</span>
            </div>
            
            <h1 className="font-heading text-4xl md:text-6xl font-extrabold tracking-tighter leading-[0.9] text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Confirm your <br />
              <span className="text-text">session access.</span>
            </h1>
            <p className="text-muted-foreground font-medium max-w-md mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000">
              Securely finalize your peer support booking. Your privacy is protected by our hard anonymity boundaries.
            </p>
          </header>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-t-2 border-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                </div>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text animate-pulse">Initializing Gateway</p>
            </div>
          ) : clientSecret ? (
            <div className="animate-in fade-in zoom-in-95 duration-700">
              <PaymentGateway clientSecret={clientSecret} amount={amount} />
            </div>
          ) : (
            <div className="p-12 rounded-[2rem] border border-destructive/10 bg-destructive/5 text-center">
              <span className="text-3xl mb-4 block">⚠️</span>
              <p className="text-destructive font-bold tracking-tight mb-2">Initialization Failed</p>
              <p className="text-sm text-text font-medium max-w-xs mx-auto">Please return to your dashboard and attempt the checkout flow again.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
