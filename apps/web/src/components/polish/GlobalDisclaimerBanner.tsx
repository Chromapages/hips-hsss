"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";

import { REQUIRED_DISCLAIMER } from "@hips/types";

export function GlobalDisclaimerBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("hips-disclaimer-dismissed") === "true";
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <aside 
      aria-live="polite" 
      aria-label="Compliance notice" 
      className="sticky top-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-2xl px-4 py-2 text-xs text-zinc-400"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20">
            <span className="text-[10px] font-bold text-amber-500">!</span>
          </div>
          <p className="leading-relaxed">
            <span className="font-semibold text-zinc-200 uppercase tracking-wider mr-1">Notice:</span> 
            {REQUIRED_DISCLAIMER}
          </p>
        </div>
        <button
          aria-label="Dismiss disclaimer"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-white/5 hover:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-700"
          onClick={() => {
            sessionStorage.setItem("hips-disclaimer-dismissed", "true");
            setVisible(false);
          }}
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
