"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ShieldAlert, Phone, Heart, Lock } from "lucide-react";

interface CrisisEscalationProps {
  reason?: string;
  region?: string;
  country?: string;
  onStayInSession?: () => void;
  onEndSession?: () => void;
}

export const CrisisEscalation: React.FC<CrisisEscalationProps> = ({
  reason,
  region = "your area",
  country = "United States",
  onStayInSession,
  onEndSession,
}) => {
  const [breathStage, setBreathStage] = useState<"Inhale" | "Hold" | "Exhale" | "HoldOut">("Inhale");
  const [countdown, setCountdown] = useState(4);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Breathing timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setBreathStage((current) => {
            switch (current) {
              case "Inhale": return "Hold";
              case "Hold": return "Exhale";
              case "Exhale": return "HoldOut";
              case "HoldOut": return "Inhale";
            }
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Focus trap — Tab cycles within overlay, Escape does NOT close (safety)
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        return;
      }
      if (event.key !== "Tab" || !overlay) return;

      const controls = Array.from(
        overlay.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]'),
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

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    // Focus first element on mount
    const focusable = overlay.querySelector<HTMLElement>('a[href], button:not([disabled])');
    focusable?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-2xl overflow-hidden"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="crisis-title"
      aria-describedby="crisis-desc"
    >
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/crisis-bg.png"
          alt=""
          fill
          className="object-cover opacity-40"
          aria-hidden="true"
          sizes="100vw"
          priority
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl p-6 mx-4 bg-white/5 border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center text-center space-y-6">
          <div
            className="p-4 bg-red-500/20 rounded-full border border-red-500/30 animate-pulse"
            aria-hidden="true"
          >
            <ShieldAlert className="w-12 h-12 text-red-500" />
          </div>

          <div className="space-y-2">
            <h1 id="crisis-title" className="text-3xl font-bold text-white tracking-tight">
              Crisis Support Protocol Activated
            </h1>
            <p id="crisis-desc" className="text-zinc-400 text-lg">
              A serious safety concern was detected. This session is currently paused for your well-being.
            </p>
            {reason && (
              <p className="text-sm text-red-200/80">Reason: {reason}</p>
            )}
          </div>

          {/* Breathing Exercise */}
          <div
            className="w-full py-8 bg-black/20 rounded-2xl border border-white/5"
            role="region"
            aria-label="Guided breathing exercise"
          >
            <div className="flex flex-col items-center space-y-4">
              <div
                className={`w-32 h-32 rounded-full border-4 border-teal-500/50 flex items-center justify-center transition-all duration-[4000ms] ease-in-out ${
                  breathStage === "Inhale" ? "scale-125 bg-teal-500/20" :
                  breathStage === "Exhale" ? "scale-75 bg-transparent" :
                  "scale-100"
                }`}
              >
                <span aria-live="polite" className="text-4xl font-bold text-teal-400">
                  {countdown}
                </span>
              </div>
              <p className="text-xl font-medium text-teal-400 uppercase tracking-widest animate-pulse">
                {breathStage.replace("HoldOut", "Hold")}
              </p>
              <p className="text-sm text-zinc-500">Box Breathing for grounding</p>
            </div>
          </div>

          {/* Action Resources */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <a
              href="tel:988"
              className="flex items-center justify-center gap-3 p-4 bg-teal-600 hover:bg-teal-500 text-white rounded-xl transition-all font-bold shadow-lg shadow-teal-900/40"
              aria-label="Call 988 Suicide and Crisis Lifeline"
            >
              <Phone className="w-5 h-5" />
              Call 988 Lifeline
            </a>
            <a
              href="https://988lifeline.org/chat/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 p-4 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all font-medium border border-white/10"
              aria-label="Chat online with 988 Suicide and Crisis Lifeline"
            >
              <Heart className="w-5 h-5" />
              Chat Support
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Lock className="w-3 h-3" />
            <span>Your safety is our priority. This support state is non-dismissible for your protection.</span>
          </div>

          <div className="flex flex-col gap-3 w-full pt-2 border-t border-white/10">
            <button
              className="h-12 rounded-xl border border-white/10 bg-transparent px-6 font-bold text-white transition-all hover:bg-white/5 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
              onClick={onStayInSession}
              type="button"
            >
              Stay in session
            </button>
            <button
              className="h-12 rounded-xl bg-red-600 px-6 font-bold text-white transition-all hover:bg-red-500 shadow-lg shadow-red-900/40"
              onClick={onEndSession}
              type="button"
            >
              End session safely
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};