"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PricingSwitcherProps {
  standardPrice: string;
}

export function PricingSwitcher({ standardPrice }: PricingSwitcherProps) {
  const [mode, setMode] = useState<"standard" | "scholarship">("standard");

  return (
    <div className="space-y-6">
      <div className="flex p-1 rounded-2xl bg-white/5 border border-white/10 w-full">
        <button
          onClick={() => setMode("standard")}
          className={cn(
            "flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
            mode === "standard" 
              ? "bg-white text-black" 
              : "text-zinc-500 hover:text-white"
          )}
        >
          Standard Rate
        </button>
        <button
          onClick={() => setMode("scholarship")}
          className={cn(
            "flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
            mode === "scholarship" 
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20" 
              : "text-zinc-500 hover:text-white"
          )}
        >
          Scholarship
        </button>
      </div>

      <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 relative overflow-hidden group">
        {mode === "scholarship" && (
          <div className="absolute top-0 right-0 px-4 py-1 bg-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-bl-xl animate-in slide-in-from-top-2 duration-300">
            Available
          </div>
        )}
        
        <div className="flex items-end gap-2 mb-6 transition-all duration-500">
          <span className="text-5xl font-black tracking-tighter text-white">
            {mode === "standard" ? standardPrice : "$0"}
          </span>
          <span className="text-zinc-500 font-bold uppercase text-[10px] pb-2 tracking-widest">
            {mode === "standard" ? "Per Session" : "With Approved Scholarship"}
          </span>
        </div>

        <ul className="space-y-3 mb-8">
          {[
            mode === "standard" ? "Immediate booking access" : "Requires application & review",
            "Confidential peer support",
            "Camera-free 3D environment",
            "Access to session materials",
          ].map((feature, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-zinc-400">
              <Check className="w-4 h-4 text-emerald-500" />
              {feature}
            </li>
          ))}
        </ul>

        {mode === "standard" ? (
          <Button asChild className="w-full h-14 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-500 font-bold text-lg shadow-xl shadow-indigo-900/20 group">
            <Link href="#">
              Book Standard Session
              <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline" className="w-full h-14 rounded-2xl border-white/10 text-white hover:bg-white/10 font-bold text-lg">
            <Link href="/scholarship">Apply for Scholarship</Link>
          </Button>
        )}
      </div>
      
      <p className="text-[10px] text-center text-zinc-600 uppercase tracking-widest leading-relaxed">
        {mode === "standard" 
          ? "Payments are securely processed via Stripe. 100% of proceeds fund our scholarship program."
          : "Scholarships are funded by donors and assigned based on financial need and availability."}
      </p>
    </div>
  );
}
