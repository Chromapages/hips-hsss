"use client";

import { useMemo, useState } from "react";
import { CreditCard } from "lucide-react";

import { formatCurrency as formatCurrencyCent } from "@/lib/format";

const tiers = [0, 10, 25, 50] as const;

function formatCurrency(amount: number) {
  return formatCurrencyCent(amount * 100);
}

export function CheckoutShell() {
  const [donation, setDonation] = useState(0);
  const [ack, setAck] = useState(false);
  const total = useMemo(() => 50 + donation, [donation]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_400px] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="rounded-[2.5rem] border border-white/5 bg-zinc-950 p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-[60px]" />
        
        <div className="relative z-10">
          <h2 className="font-heading text-3xl font-extrabold tracking-tighter text-white mb-8">Payment Method</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1" htmlFor="cardholder-name">Cardholder Name</label>
                <input
                  id="cardholder-name"
                  type="text"
                  autoComplete="cc-name"
                  className="h-14 bg-surface/5 border border-white/5 rounded-2xl px-4 text-sm font-medium focus:outline-none focus:border-primary/50 focus:bg-surface/10 transition-all placeholder:text-text"
                  placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1" htmlFor="card-number">Card Number</label>
                <input
                  id="card-number"
                  type="text"
                  autoComplete="cc-number"
                  inputMode="numeric"
                  pattern="[0-9\s]{13,19}"
                  maxLength={19}
                  className="h-14 bg-surface/5 border border-white/5 rounded-2xl px-4 text-sm font-medium focus:outline-none focus:border-primary/50 focus:bg-surface/10 transition-all placeholder:text-text"
                  placeholder="•••• •••• •••• ••••"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1" htmlFor="expiry-date">Expiry Date</label>
                <input
                  id="expiry-date"
                  type="text"
                  autoComplete="cc-exp"
                  inputMode="numeric"
                  placeholder="MM / YY"
                  className="h-14 bg-surface/5 border border-white/5 rounded-2xl px-4 text-sm font-medium focus:outline-none focus:border-primary/50 focus:bg-surface/10 transition-all placeholder:text-text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1" htmlFor="cvc">CVC</label>
                <input
                  id="cvc"
                  type="text"
                  autoComplete="cc-csc"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="•••"
                  className="h-14 bg-surface/5 border border-white/5 rounded-2xl px-4 text-sm font-medium focus:outline-none focus:border-primary/50 focus:bg-surface/10 transition-all placeholder:text-text"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 p-6 rounded-3xl bg-primary/5 border border-primary/10">
            <label className="flex gap-4 cursor-pointer group">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={ack}
                  onChange={(e) => setAck(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-5 h-5 rounded-md border-2 border-white/10 transition-all peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-surface opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
              </div>
              <span className="text-xs font-medium text-text leading-relaxed group-hover:text-text-muted transition-colors">
                I understand that H.I.P.S. provides coaching and peer support. This is not medical advice or emergency medical care.
              </span>
            </label>
          </div>

          <button
            disabled={!ack}
            className="mt-8 group relative w-full h-16 items-center justify-center overflow-hidden rounded-[1.5rem] bg-surface font-bold tracking-tighter text-black transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-30 disabled:hover:scale-100"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#173B57] to-gold opacity-0 transition-opacity group-hover:opacity-10" />
            <span className="relative z-10 text-lg">Complete Booking • {formatCurrency(total)}</span>
          </button>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="rounded-[2rem] border border-white/5 bg-text/50 p-8 backdrop-blur-3xl shadow-xl">
          <h2 className="font-heading text-xl font-bold tracking-tight text-white mb-6">Order Summary</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Session Fee</span>
              <span className="text-white font-bold">{formatCurrency(50)}</span>
            </div>

            <div className="pt-6 border-t border-white/5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-text mb-4">Support a Scholarship</p>
              <div className="grid grid-cols-4 gap-2">
                {tiers.map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setDonation(tier)}
                    className={[
                      "h-12 rounded-xl border text-[10px] font-bold tracking-widest transition-all duration-300",
                      donation === tier
                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/40"
                        : "bg-surface/5 border-white/5 text-muted-foreground hover:border-white/20 hover:text-white",
                    ].join(" ")}
                  >
                    {tier === 0 ? "NONE" : formatCurrency(tier)}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Amount</p>
                <p className="text-3xl font-bold tracking-tighter text-white">{formatCurrency(total)}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-text uppercase tracking-widest bg-surface/5 px-2 py-1 rounded-md">USD</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-surface/5 border border-white/5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="text-emerald-500">🛡️</span>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-1">Secure Transaction</p>
            <p className="text-[10px] leading-relaxed text-muted-foreground font-medium italic">
              Your billing data is never linked to your session audio or anonymous handles.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
