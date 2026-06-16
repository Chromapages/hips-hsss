"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";

/**
 * Practice Mode — routes to the existing test-session page with host flags.
 * The test-session infrastructure already works without booking a real session.
 */
export default function HostPracticePage() {
  // Auto-set practice-mode flags in sessionStorage so the session room knows
  useEffect(() => {
    sessionStorage.setItem("hips-practice-mode", "true");

    // Load avatar config from localStorage to pre-populate the session
    const avatarConfig = localStorage.getItem("hips-host-avatar");
    if (avatarConfig) {
      try {
        const parsed = JSON.parse(avatarConfig) as { avatarColor?: string };
        if (parsed.avatarColor) {
          sessionStorage.setItem("hips-avatar-color", parsed.avatarColor);
        }
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-xs text-text-muted font-ui">
          <li>
            <Link href="/host/dashboard" className="hover:text-text transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              Dashboard
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li className="font-bold text-text">Practice Mode</li>
        </ol>
      </nav>

      <div className="flex flex-col items-center justify-center text-center py-16 rounded-2xl border border-dashed border-accent/40 bg-accent/5">
        <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center mb-6">
          <Zap className="w-8 h-8 text-accent" aria-hidden="true" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-text mb-3">
          Practice Session
        </h1>
        <p className="text-text-muted font-body max-w-md mb-2">
          You&apos;re about to enter a sandboxed practice room. This is a solo environment —
          no clients can join.
        </p>
        <p className="text-xs text-text-muted/70 font-ui uppercase tracking-wider mb-8">
          Your avatar and voice settings from setup will be active.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/test-session"
            aria-label="Enter the practice session room"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-bold text-sm uppercase tracking-wider font-ui hover:bg-primary-active shadow-lg shadow-primary/20 transition-all"
          >
            <Zap className="w-5 h-5" aria-hidden="true" />
            Enter Practice Room
          </Link>
          <Link
            href="/host/avatar-setup"
            aria-label="Adjust avatar settings before entering"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-accent text-accent font-bold text-sm uppercase tracking-wider font-ui hover:bg-accent hover:text-white transition-all"
          >
            Adjust Setup First
          </Link>
        </div>

        <p className="mt-8 text-[10px] text-text-muted/50 font-ui uppercase tracking-wider">
          Practice sessions are not saved or billed.
        </p>
      </div>
    </div>
  );
}
