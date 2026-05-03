"use client";

import { useMemo, useState } from "react";
import { CreditCard } from "lucide-react";

const tiers = [0, 10, 25, 50] as const;

export function CheckoutShell() {
  const [donation, setDonation] = useState(0);
  const [ack, setAck] = useState(false);
  const total = useMemo(() => 50 + donation, [donation]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_400px] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="rounded-[2.5rem] border border-white/5 bg-zinc-950 p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-[60px]" />
        
        <div className="relative z-10">
          <h2 className="text-3xl font-black tracking-tighter text-white mb-8">Payment Method</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Cardholder Name</label>
                <div className="h-14 rounded-2xl border border-white/5 bg-white/5 flex items-center px-4 text-zinc-400 font-medium">
                  Stripe Field Placeholder
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Card Number</label>
                <div className="h-14 rounded-2xl border border-white/5 bg-white/5 flex items-center px-4 text-zinc-400 font-medium">
                  <CreditCard className="mr-3 h-4 w-4 opacity-50" />
                  •••• •••• •••• ••••
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Expiry Date</label>
                <div className="h-14 rounded-2xl border border-white/5 bg-white/5 flex items-center px-4 text-zinc-400 font-medium">
                  MM / YY
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">CVC</label>
                <div className="h-14 rounded-2xl border border-white/5 bg-white/5 flex items-center px-4 text-zinc-400 font-medium">
                  •••
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10">
            <label className="flex gap-4 cursor-pointer group">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={ack}
                  onChange={(e) => setAck(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-5 h-5 rounded-md border-2 border-white/10 transition-all peer-checked:bg-indigo-500 peer-checked:border-indigo-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
              </div>
              <span className="text-xs font-medium text-zinc-400 leading-relaxed group-hover:text-zinc-200 transition-colors">
                I understand that H.I.P.S. provides coaching and peer support. This is not medical advice or emergency medical care.
              </span>
            </label>
          </div>

          <button
            disabled={!ack}
            className="mt-8 group relative w-full h-16 items-center justify-center overflow-hidden rounded-[1.5rem] bg-white font-black tracking-tighter text-black transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-30 disabled:hover:scale-100"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 transition-opacity group-hover:opacity-10" />
            <span className="relative z-10 text-lg">Complete Booking • ${total}</span>
          </button>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="rounded-[2rem] border border-white/5 bg-zinc-900/50 p-8 backdrop-blur-3xl shadow-xl">
          <h2 className="text-xl font-black tracking-tight text-white mb-6">Order Summary</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Session Fee</span>
              <span className="text-white font-black">$50.00</span>
            </div>

            <div className="pt-6 border-t border-white/5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-4">Support a Scholarship</p>
              <div className="grid grid-cols-4 gap-2">
                {tiers.map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setDonation(tier)}
                    className={[
                      "h-12 rounded-xl border text-[10px] font-black tracking-widest transition-all duration-300",
                      donation === tier
                        ? "bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-900/40"
                        : "bg-white/5 border-white/5 text-zinc-500 hover:border-white/20 hover:text-white",
                    ].join(" ")}
                  >
                    {tier === 0 ? "NONE" : `$${tier}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Total Amount</p>
                <p className="text-3xl font-black tracking-tighter text-white">${total}.00</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">USD</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-500">🛡️</span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-1">Secure Transaction</p>
            <p className="text-[10px] leading-relaxed text-zinc-500 font-medium italic">
              Your billing data is never linked to your session audio or anonymous handles.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
