"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ForgotPasswordClient() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
      if (err instanceof Error) {
        if (err.message.includes("user-not-found")) {
          setSent(true);
          return;
        }
        setError(err.message);
      } else {
        setError("Failed to send reset email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-full max-w-md px-4 text-center">
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
            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
          >
            Return to sign in
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
          <p className="text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-zinc-300">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500/50 text-white placeholder:text-zinc-500"
              placeholder="you@example.com"
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
        <p className="text-center mt-6 text-gray-400 text-sm">
          Remember your password?{" "}
          <a href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Sign in
          </a>
        </p>
      </div>
    </main>
  );
}
