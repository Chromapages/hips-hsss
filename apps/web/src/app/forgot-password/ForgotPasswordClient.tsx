"use client";

import { useState, useEffect, useRef } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type FirebaseAuthError = Error & { code?: string };

const getResetErrorMessage = (err: unknown): string => {
  const authError = err instanceof Error ? (err as FirebaseAuthError) : null;

  switch (authError?.code) {
    case "auth/invalid-email":
      return "Invalid email address. Please check and try again.";
    case "auth/user-not-found":
      // Return a general message to prevent user enumeration
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
      <main id="main" tabIndex={-1} className="min-h-screen bg-black text-white flex items-center justify-center">
        <div
          ref={successRef}
          tabIndex={-1}
          className="w-full max-w-md px-4 text-center focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-2xl p-6"
          role="status"
          aria-live="polite"
        >
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">Check your inbox</h1>
            <p className="text-gray-400">
              If an account exists for <strong className="text-white">{email}</strong>, we've sent a password reset link.
            </p>
          </div>
          <button
            onClick={() => router.push("/login")}
            className="text-text hover:text-text text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg px-3 py-1.5"
          >
            Return to sign in
          </button>
        </div>
      </main>
    );
  }

  return (
    <main id="main" tabIndex={-1} className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
          <p className="text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-text-muted">
              Email Address
            </label>
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
              className="w-full px-4 py-3 bg-text border border-border-strong rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 text-white placeholder:text-muted-foreground"
              placeholder="you@example.com"
            />
          </div>
          {error && (
            <Alert
              ref={errorRef}
              variant="destructive"
              tabIndex={-1}
              id="reset-error"
              className="focus:outline-none focus:ring-1 focus:ring-red-500 rounded-xl"
            >
              <AlertTitle>Reset Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 motion-safe:animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
        <p className="text-center mt-6 text-gray-400 text-sm">
          Remember your password?{" "}
          <a href="/login" className="text-text hover:text-text font-medium">
            Sign in
          </a>
        </p>
      </div>
    </main>
  );
}
