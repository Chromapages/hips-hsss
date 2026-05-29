"use client";

import { useEffect, useRef } from "react";
import { CRISIS_RESOURCES } from "@hips/types";

import { PhoneCall, MessageSquare, ShieldAlert } from "lucide-react";

interface CrisisOverlayProps {
  region?: string;
  country?: string;
  onStayInSession?: () => void;
  onEndSession?: () => void;
}

/**
 * CrisisEscalation overlay — full-screen modal for immediate crisis support.
 *
 * Accessibility:
 * - role="alertdialog" with aria-labelledby (heading) and aria-describedby (resource list)
 * - sr-only aria-live region announces crisis resources to screen readers
 * - Focus trap: Tab/Shift+Tab cycle within overlay only
 * - Escape does NOT close overlay (intentional — user must explicitly choose)
 * - Phone numbers as <a href="tel:..."> for mobile accessibility
 */
export function CrisisOverlay({
  region = "local emergency resources",
  country = "your area",
  onStayInSession,
  onEndSession,
}: CrisisOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Focus the first interactive element on mount
    const focusable = overlayRef.current?.querySelector<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    focusable?.focus();
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    function handleKeyDown(event: KeyboardEvent) {
      // Escape does NOT close the overlay
      if (event.key === "Escape") {
        event.preventDefault();
        return;
      }

      if (event.key !== "Tab" || !overlay) return;

      const controls = Array.from(
        overlay.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex="0"]',
        ),
      );
      if (controls.length === 0) return;

      const first = controls[0]!;
      const last = controls[controls.length - 1]!;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    // Prevent body scroll behind overlay
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="crisis-title"
      aria-describedby="crisis-resources"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-6 backdrop-blur-3xl animate-in fade-in duration-500"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.1)_0%,transparent_70%)] pointer-events-none" />

      {/* Screen reader announcement */}
      <p className="sr-only" aria-live="assertive" role="alert">
        Crisis resources. Help is available right now. 988 Suicide and Crisis
        Lifeline: call or text 988. Crisis Text Line: text HOME to 741741.
      </p>

      <section className="w-full max-w-2xl relative z-10 animate-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(245,158,11,0.2)] animate-pulse">
            <ShieldAlert className="w-10 h-10 text-amber-500" aria-hidden="true" />
          </div>
          <h1 id="crisis-title" className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-4">
            You are not alone.
          </h1>
          <p className="text-xl text-zinc-400">
            Professional help is available right now.
          </p>
        </div>

        <ul
          id="crisis-resources"
          aria-label="Crisis support resources"
          className="grid gap-4 md:grid-cols-2 mb-10 list-none"
        >
          {CRISIS_RESOURCES.map((resource) => (
            <li key={resource.href}>
              <a
                className="flex flex-col items-center justify-center text-center rounded-[2rem] border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/10 hover:border-amber-500/30 group"
                href={resource.href}
                aria-label={`${resource.label} — ${resource.action}`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-amber-500/20 group-hover:text-amber-500 transition-all">
                  {resource.href.startsWith("tel:") ? (
                    <PhoneCall className="w-5 h-5 text-zinc-400 group-hover:text-amber-500 transition-colors" aria-hidden="true" />
                  ) : (
                    <MessageSquare className="w-5 h-5 text-zinc-400 group-hover:text-amber-500 transition-colors" aria-hidden="true" />
                  )}
                </div>
                <span className="block font-bold text-white text-xl mb-1">{resource.label}</span>
                <span className="text-sm text-zinc-500 font-bold uppercase tracking-widest">{resource.action}</span>
              </a>
            </li>
          ))}
          <li className="md:col-span-2 rounded-2xl border border-white/5 bg-black/50 p-5 text-center flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Local Resource Fallback</span>
            <span className="text-sm font-medium text-zinc-400">Searching nearest responders in {region}, {country}</span>
          </li>
        </ul>

        <div className="flex flex-col gap-4 sm:flex-row justify-center border-t border-white/10 pt-8">
          <button
            className="h-14 rounded-2xl border border-white/10 bg-transparent px-8 font-bold text-white transition-all hover:bg-white/5 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
            onClick={onStayInSession}
            ref={closeButtonRef}
          >
            Stay in session
          </button>
          <button
            className="h-14 rounded-2xl bg-red-600 px-8 font-bold text-white transition-all hover:bg-red-500 shadow-xl shadow-red-900/40"
            onClick={onEndSession}
          >
            End session safely
          </button>
        </div>
      </section>
    </div>
  );
}