"use client";

import { useState, useEffect, useRef } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type FirebaseAuthError = Error & { code?: string };

const getResetErrorMessage = (err: unknown): string => {
  const authError = err instanceof Error ? (err as FirebaseAuthError) : null;

  switch (authError?.code) {
    case "auth/invalid-email":
      return "Invalid email address. Please check and try again.";
    case "auth/user-not-found":
      return "If an account exists for this email, we have sent a reset link.";
    case "auth/network-request-failed":
      return "Connection error. Please check your internet and try again.";
    default:
      return authError?.code
        ? authError.message || "An unexpected error occurred. Please try again."
        : "Failed to send reset email. Please try again.";
  }
};

export default function ForgotPasswordClient() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const successRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sent) {
      successRef.current?.focus();
    }
  }, [sent]);

  useEffect(() => {
    if (error) {
      errorRef.current?.focus();
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!auth) {
        setError("Authentication service not available.");
        return;
      }
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: unknown) {
      const authError = err as FirebaseAuthError;
      if (authError?.code === "auth/user-not-found") {
        setSent(true);
        return;
      }
      setError(getResetErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="space-y-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div
          ref={successRef}
          tabIndex={-1}
          className="space-y-6 focus:outline-none"
          role="status"
          aria-live="polite"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 border border-success/20">
            <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text">Check your email</h1>
            <p className="text-sm text-text-muted font-body leading-relaxed max-w-md mx-auto">
              Check your email for a password reset link from <strong className="text-text font-semibold">noreply@hipsfoundation.org</strong>. Please check your inbox and spam folder.
            </p>
          </div>
          <button
            onClick={() => router.push("/login")}
            className="group flex w-full h-14 items-center justify-center rounded-xl border border-border bg-surface font-bold text-sm tracking-wide text-text transition-all duration-200 hover:bg-bg-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 font-ui uppercase"
          >
            Return to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back to Home Escape Route */}
      <div className="flex justify-start">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-text-muted hover:text-text transition-colors font-ui"
          aria-label="Return to homepage"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          Back to Home
        </Link>
      </div>

      {/* Decorative Line */}
      <div className="h-0.5 w-12 bg-accent rounded-full" />

      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-text">Reset Password</h1>
        <p className="text-sm font-medium text-text-muted font-body">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted ml-1 font-ui">
            Email Address
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-text group-focus-within:text-primary transition-colors" />
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-invalid={!!error}
              aria-describedby={error ? "reset-error" : undefined}
              autoComplete="email"
              className="w-full h-14 bg-bg-subtle border border-border rounded-2xl pl-12 pr-4 text-sm font-medium text-text focus:outline-none focus:border-primary/50 focus:bg-surface transition-all placeholder:text-text font-body"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {error && (
          <Alert
            ref={errorRef}
            variant="destructive"
            tabIndex={-1}
            id="reset-error"
            className="focus:outline-none focus:ring-1 focus:ring-red-500 rounded-2xl"
          >
            <AlertTitle>Reset Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <button
          type="submit"
          disabled={loading}
          className="group flex w-full h-16 items-center justify-center rounded-[1.5rem] border border-border bg-surface font-bold tracking-tighter text-black shadow-sm transition-all duration-200 ease-in-out hover:border-primary hover:bg-primary hover:text-white hover:shadow-xl hover:shadow-primary/25 active:scale-[0.99] disabled:opacity-30 disabled:hover:border-border disabled:hover:bg-surface disabled:hover:text-black disabled:hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 font-ui uppercase"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 motion-safe:animate-spin mx-auto" />
          ) : (
            <span className="text-lg">Send Reset Link</span>
          )}
        </button>
      </form>

      {/* Back to sign in */}
      <div className="text-center border-t border-border pt-5">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-text transition-colors font-body"
          aria-label="Return to sign in page"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          Remembered your password? Sign in
        </Link>
      </div>
    </div>
  );
}
