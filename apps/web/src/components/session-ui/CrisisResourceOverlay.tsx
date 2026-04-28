"use client";

import { useEffect, useRef } from "react";

export function CrisisResourceOverlay({ onClose }: { onClose: () => void }) {
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    firstLink.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

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
          <a ref={firstLink} className="rounded-lg border border-white/30 p-4 focus:outline-none focus:ring-2 focus:ring-white" href="tel:988">
            988 Suicide & Crisis Lifeline. Call or text 988.
          </a>
          <a className="rounded-lg border border-white/30 p-4 focus:outline-none focus:ring-2 focus:ring-white" href="sms:741741">
            Crisis Text Line. Text HOME to 741741.
          </a>
          <p className="rounded-lg border border-white/30 p-4">Local emergency number: 911.</p>
        </div>
        <button className="mt-8 min-h-11 rounded-md bg-white px-4 font-semibold text-red-950" onClick={onClose} type="button">
          I am safe, close this
        </button>
      </section>
    </div>
  );
}
