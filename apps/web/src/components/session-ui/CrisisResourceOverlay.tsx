"use client";

import { useEffect, useRef } from "react";

export function CrisisResourceOverlay({ onClose }: { onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // Focus the first link on mount
    firstLinkRef.current?.focus();

    // Focus trap: keep focus within the overlay
    function trapFocus(event: KeyboardEvent) {
      if (event.key === "Tab") {
        const focusable = overlayRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;

        const first = focusable[0]!;
        const last = focusable[focusable.length - 1]!;

        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }

      // Allow Escape to close when user explicitly wants out
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", trapFocus);
    // Prevent background scrolling
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", trapFocus);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      aria-describedby="crisis-body"
      aria-labelledby="crisis-heading"
      aria-modal="true"
      className="fixed inset-0 z-[9999] grid place-items-center bg-red-950 p-6 text-white"
      role="alertdialog"
    >
      <section className="max-w-2xl">
        <h2 className="text-3xl font-bold" id="crisis-heading">Help is available right now.</h2>
        <div className="mt-6 grid gap-3 text-xl" id="crisis-body">
          <a ref={firstLinkRef} className="rounded-lg border border-white/30 p-4 focus:outline-none focus:ring-2 focus:ring-white" href="tel:988">
            988 Suicide & Crisis Lifeline. Call or text 988.
          </a>
          <a className="rounded-lg border border-white/30 p-4 focus:outline-none focus:ring-2 focus:ring-white" href="sms:741741">
            Crisis Text Line. Text HOME to 741741.
          </a>
          <p className="rounded-lg border border-white/30 p-4">Local emergency number: 911.</p>
        </div>
        <button className="mt-8 min-h-11 rounded-xl bg-white px-4 font-semibold text-red-950" onClick={onClose} type="button">
          I am safe, close this
        </button>
      </section>
    </div>
  );
}
