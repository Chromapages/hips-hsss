"use client";

import { CheckoutShell } from "@/components/checkout/CheckoutShell";
import { Navbar } from "@/components/polish/Navbar";

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
        {/* Ambient Glow */}
        <div className="fixed top-0 right-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />

        <section className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-24">
          <div className="max-w-3xl mb-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-400 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
              Final Step
            </p>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Complete your <br />
              <span className="text-zinc-600">reservation.</span>
            </h1>
            <p className="text-lg text-zinc-500 font-medium max-w-xl leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
              Your billing information is handled securely via Stripe. H.I.P.S. ensures
              that this data is never connected to your session participation.
            </p>
          </div>

          <CheckoutShell />
        </section>
      </main>
    </>
  );
}