"use client";

import { useEffect, useRef } from "react";
import { CRISIS_RESOURCES } from "@hips/types";

export function CrisisEscalation({
  region = "local emergency resources",
  country = "your area",
}: {
  region?: string;
  country?: string;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const focusable = overlay?.querySelector<HTMLElement>("a, button");
    focusable?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
      }

      if (event.key !== "Tab" || !overlay) {
        return;
      }

      const controls = Array.from(
        overlay.querySelectorAll<HTMLElement>("a, button"),
      );
      const first = controls.at(0);
      const last = controls.at(-1);

      if (!first || !last) {
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      ref={overlayRef}
      role="alertdialog"
      aria-labelledby="crisis-title"
      aria-describedby="crisis-resources"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-crisis)] p-6 text-white"
    >
      <p className="sr-only" aria-live="assertive">
        Crisis resources. Help is available.
      </p>
      <section className="w-full max-w-2xl">
        <h1 id="crisis-title" className="text-3xl font-bold leading-tight">
          You are not alone. Help is available right now.
        </h1>
        <div id="crisis-resources" className="mt-8 space-y-4 text-xl">
          {CRISIS_RESOURCES.map((resource) => (
            <a
              className="block rounded-md border border-white/40 p-4 underline-offset-4 hover:bg-white/10 hover:underline focus:outline-none focus:ring-2 focus:ring-white"
              href={resource.href}
              key={resource.href}
            >
              <span className="block font-semibold">{resource.label}</span>
              <span>{resource.action}</span>
            </a>
          ))}
          <div className="rounded-md border border-white/40 p-4">
            Local resource: {region}, {country}
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button className="min-h-11 rounded-md bg-white px-5 py-3 font-semibold text-[var(--color-crisis)] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[var(--color-crisis)]">
            Stay in session
          </button>
          <button className="min-h-11 rounded-md border border-white px-5 py-3 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-white">
            End session safely
          </button>
        </div>
      </section>
    </div>
  );
}
