"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Hash, Shield, Sparkles, LifeBuoy } from "lucide-react";

export const dynamic = "force-dynamic";

export default function JoinPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState("");
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = sessionId.trim();
    if (trimmed) {
      router.push(`/join/${encodeURIComponent(trimmed)}`);
    }
  };

  const handleTryDemo = async () => {
    setIsDemoLoading(true);
    try {
      router.push("/demo-room");
    } catch (err) {
      console.error("Demo session error:", err);
      setIsDemoLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground antialiased flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-4">
            <Shield className="w-3 h-3 text-accent" />
            Direct Session Access
          </div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-primary">
            Join a Session
          </h1>
          <p className="text-sm text-text-muted">
            Enter your session ID to connect directly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted ml-1"
              htmlFor="session-id"
            >
              Session ID
            </label>
            <div className="relative group">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
              <input
                id="session-id"
                type="text"
                required
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                placeholder="e.g. abc-123-def"
                autoComplete="off"
                spellCheck={false}
                aria-describedby="session-id-hint"
                className="w-full h-14 bg-surface border border-border rounded-2xl pl-12 pr-4 text-sm font-medium text-foreground focus:outline-none focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-text-muted/60"
              />
            </div>
            <p id="session-id-hint" className="ml-1 text-[11px] text-text-muted">
              The ID was shared with you by your facilitator.
            </p>
          </div>

          <button
            type="submit"
            disabled={!sessionId.trim() || isDemoLoading}
            className="group relative w-full h-14 items-center justify-center overflow-hidden rounded-2xl bg-primary font-bold text-primary-foreground transition-colors hover:bg-primary-dark disabled:opacity-30 disabled:hover:bg-primary"
          >
            <span className="flex items-center justify-center gap-2">
              Join Session
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-4 text-xs uppercase tracking-widest text-text-muted">
              or
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleTryDemo}
          disabled={isDemoLoading}
          className="group relative w-full h-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 font-bold text-white shadow-sm shadow-emerald-600/20 transition-all hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center justify-center gap-2">
            <Sparkles className={`w-4 h-4 ${isDemoLoading ? "animate-spin" : ""}`} />
            {isDemoLoading ? "Preparing Demo..." : "Try a Demo Session"}
          </span>
        </button>

        <p className="text-center text-xs text-text-muted">
          No account required — sessions are anonymous.
        </p>

        <div
          role="note"
          aria-label="Crisis support resources"
          className="rounded-2xl border border-warning/30 bg-warning/5 p-4 text-xs text-foreground"
        >
          <p className="flex items-start gap-2">
            <LifeBuoy className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
            <span>
              In immediate danger?{" "}
              <a
                href="https://988lifeline.org"
                className="font-semibold text-warning underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                988 Suicide &amp; Crisis Lifeline
              </a>{" "}
              (US, call or text 988).{" "}
              <a
                href="https://findahelpline.com"
                className="font-semibold text-warning underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                International directory
              </a>
              .
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}
