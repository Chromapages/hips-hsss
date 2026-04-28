"use client";

import { useMemo, useState } from "react";
import { CreditCard } from "lucide-react";

const tiers = [0, 10, 25, 50] as const;

export function CheckoutShell() {
  const [donation, setDonation] = useState(0);
  const [ack, setAck] = useState(false);
  const total = useMemo(() => 50 + donation, [donation]);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
      <section className="rounded-lg border border-white/10 bg-gray-950 p-6">
        <h2 className="text-2xl font-bold">Payment</h2>
        <div className="mt-6 grid gap-4">
          {["Card number", "MM / YY", "CVC", "ZIP"].map((label) => (
            <label className="grid gap-2" key={label}>
              <span className="text-sm font-medium text-gray-300">{label}</span>
              <div className="flex min-h-11 items-center rounded-md border border-white/10 bg-black px-3 text-gray-500">
                <CreditCard className="mr-3 h-4 w-4" />
                Stripe field placeholder
              </div>
            </label>
          ))}
        </div>
        <label className="mt-6 flex gap-3 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
          <input
            aria-required="true"
            checked={ack}
            className="mt-1 h-4 w-4 accent-indigo-500"
            onChange={(event) => setAck(event.target.checked)}
            type="checkbox"
          />
          <span>
            I understand that H.I.P.S. provides coaching and peer support, not emergency care or medical advice.
          </span>
        </label>
        <button
          className="mt-6 min-h-11 w-full rounded-md bg-indigo-500 px-4 font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!ack}
          type="button"
        >
          Complete purchase
        </button>
      </section>
      <aside className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <h2 className="text-2xl font-bold">Order summary</h2>
        <dl className="mt-6 space-y-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-400">Peer support session</dt>
            <dd>$50</dd>
          </div>
          <div>
            <dt className="text-gray-400">Donation add-on</dt>
            <dd className="mt-3 grid grid-cols-4 gap-2">
              {tiers.map((tier) => (
                <button
                  className={[
                    "min-h-11 rounded-md border text-sm transition",
                    donation === tier
                      ? "border-indigo-500 bg-indigo-500/15 text-indigo-200"
                      : "border-white/10 text-gray-300 hover:bg-white/10",
                  ].join(" ")}
                  key={tier}
                  onClick={() => setDonation(tier)}
                  type="button"
                >
                  {tier === 0 ? "No" : `$${tier}`}
                </button>
              ))}
            </dd>
          </div>
          <div className="flex justify-between border-t border-white/10 pt-4 text-lg font-bold">
            <dt>Total</dt>
            <dd>${total}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
