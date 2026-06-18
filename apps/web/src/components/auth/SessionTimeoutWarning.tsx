"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { auth as firebaseAuth } from "@/lib/firebase-client";
import { useRouter } from "next/navigation";
import { AlertTriangle, Clock, LogOut, ShieldAlert } from "lucide-react";

// Inactivity limits: 15 minutes of no activity, then 5 minutes warning countdown.
const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const COUNTDOWN_TIMEOUT = 5 * 60 * 1000; // 5 minutes (300 seconds)

export function SessionTimeoutWarning() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(300); // 300 seconds
  
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const stayButtonRef = useRef<HTMLButtonElement>(null);

  const handleSignOut = useCallback(async () => {
    // Clear all intervals and timers
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    
    setShowWarning(false);
    await logout();
    router.replace("/login?reason=timeout");
  }, [logout, router]);

  const handleStaySignedIn = useCallback(async () => {
    // Reset warning state
    setShowWarning(false);
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    
    // Silently refresh the Firebase auth token to extend both client and server cookie session
    if (firebaseAuth?.currentUser) {
      try {
        await firebaseAuth.currentUser.getIdToken(true);
      } catch (err) {
        console.error("[SessionTimeoutWarning] Failed to refresh token:", err);
      }
    }
    
    // Restart inactivity monitoring
    resetInactivityTimer();
  }, []);

  const startWarningCountdown = useCallback(() => {
    setShowWarning(true);
    setCountdown(300);
    
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    
    countdownTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
          void handleSignOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [handleSignOut]);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    
    // Only monitor if the user is actually signed in
    if (!user) return;
    
    inactivityTimerRef.current = setTimeout(() => {
      startWarningCountdown();
    }, INACTIVITY_TIMEOUT);
  }, [user, startWarningCountdown]);

  // Handle user activity listeners
  useEffect(() => {
    if (!user) {
      // Clear timers if user logged out
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      setShowWarning(false);
      return;
    }

    const handleActivity = () => {
      // Only reset if we are not currently displaying the warning modal
      if (!showWarning) {
        resetInactivityTimer();
      }
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Initial start
    resetInactivityTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [user, showWarning, resetInactivityTimer]);

  // Focus trap inside the warning modal
  useEffect(() => {
    if (!showWarning) return;
    
    // Focus the primary button when modal opens
    setTimeout(() => {
      stayButtonRef.current?.focus();
    }, 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        // Escape defaults to keeping user signed in for accessibility convenience
        void handleStaySignedIn();
        return;
      }

      if (e.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;
        
        const focusable = dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showWarning, handleStaySignedIn]);

  if (!showWarning) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const timeString = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-warning-title"
      aria-describedby="session-warning-desc"
    >
      <div 
        ref={dialogRef}
        className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-xl p-6 md:p-8 space-y-6 animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-warning/10 border border-warning/20 text-warning shrink-0">
            <Clock className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h2 
              id="session-warning-title" 
              className="text-lg md:text-xl font-bold tracking-tight text-text font-heading"
            >
              Session Expiring Soon
            </h2>
            <p 
              id="session-warning-desc" 
              className="text-sm font-medium text-text-muted leading-relaxed font-body"
            >
              You have been inactive for a while. For your security, you will be automatically signed out in{" "}
              <strong className="text-text font-bold" aria-live="polite">
                {timeString}
              </strong>
              .
            </p>
          </div>
        </div>

        {/* Informative Security Notice */}
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-text-muted leading-relaxed font-medium font-body">
            This security feature helps protect your privacy on shared devices by signing out inactive accounts automatically.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex-1 h-12 inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface font-semibold text-sm tracking-wide text-text hover:bg-bg-subtle transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 font-ui uppercase"
            aria-label="Sign out of your account now"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          
          <button
            ref={stayButtonRef}
            type="button"
            onClick={handleStaySignedIn}
            className="flex-1 h-12 inline-flex items-center justify-center gap-2 rounded-xl border border-transparent bg-primary font-bold text-sm tracking-wide text-white hover:bg-primary-hover active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 font-ui uppercase shadow-sm hover:shadow-md"
            aria-label="Stay signed in and continue your session"
          >
            Stay Signed In
          </button>
        </div>
      </div>
    </div>
  );
}
