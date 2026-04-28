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
    <aside aria-live="polite" aria-label="Compliance notice" className="sticky top-0 z-40 border-b border-amber-900/50 bg-amber-950/80 px-4 py-3 text-sm text-amber-100/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <p><strong>Important:</strong> {REQUIRED_DISCLAIMER}</p>
        <button
          aria-label="Dismiss disclaimer"
          className="rounded-md p-2 text-gray-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
