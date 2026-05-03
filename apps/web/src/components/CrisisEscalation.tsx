"use client";

import { useEffect, useRef } from "react";
import { CRISIS_RESOURCES } from "@hips/types";

import { PhoneCall, MessageSquare, ShieldAlert } from "lucide-react";

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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-6 backdrop-blur-3xl animate-in fade-in duration-500"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.1)_0%,transparent_70%)] pointer-events-none" />
      
      <p className="sr-only" aria-live="assertive">
        Crisis resources. Help is available.
      </p>
      
      <section className="w-full max-w-2xl relative z-10 animate-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(245,158,11,0.2)] animate-pulse">
            <ShieldAlert className="w-10 h-10 text-amber-500" />
          </div>
          <h1 id="crisis-title" className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-4">
            You are not alone.
          </h1>
          <p className="text-xl text-zinc-400">
            Professional help is available right now.
          </p>
        </div>

        <div id="crisis-resources" className="grid gap-4 md:grid-cols-2 mb-10">
          {CRISIS_RESOURCES.map((resource) => (
            <a
              className="flex flex-col items-center justify-center text-center rounded-[2rem] border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/10 hover:border-amber-500/30 group"
              href={resource.href}
              key={resource.href}
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-amber-500/20 group-hover:text-amber-500 transition-all">
                {resource.href.startsWith("tel:") ? (
                  <PhoneCall className="w-5 h-5 text-zinc-400 group-hover:text-amber-500 transition-colors" />
                ) : (
                  <MessageSquare className="w-5 h-5 text-zinc-400 group-hover:text-amber-500 transition-colors" />
                )}
              </div>
              <span className="block font-bold text-white text-xl mb-1">{resource.label}</span>
              <span className="text-sm text-zinc-500 font-bold uppercase tracking-widest">{resource.action}</span>
            </a>
          ))}
          
          <div className="md:col-span-2 rounded-2xl border border-white/5 bg-black/50 p-5 text-center flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Local Resource Fallback</span>
            <span className="text-sm font-medium text-zinc-400">Searching nearest responders in {region}, {country}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row justify-center border-t border-white/10 pt-8">
          <button className="h-14 rounded-2xl border border-white/10 bg-transparent px-8 font-bold text-white transition-all hover:bg-white/5 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black">
            Stay in session
          </button>
          <button className="h-14 rounded-2xl bg-red-600 px-8 font-bold text-white transition-all hover:bg-red-500 shadow-xl shadow-red-900/40">
            End session safely
          </button>
        </div>
      </section>
    </div>
  );
}
