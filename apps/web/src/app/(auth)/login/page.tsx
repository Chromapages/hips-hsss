"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading, firebaseReady } = useAuth();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.replace(from);
    }
  }, [user, authLoading, router, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Guard: Check Firebase is ready before attempting auth
    if (!firebaseReady || !auth) {
      console.error("[Login] Firebase not ready or auth is null");
      setError("Authentication temporarily unavailable. Please try again.");
      setLoading(false);
      return;
    }

    try {
      console.log("[Login] Attempting sign in with:", email);
      await signInWithEmailAndPassword(auth, email, password);
      console.log("[Login] Firebase auth success, wait for AuthProvider sync...");
      router.push(from);
    } catch (err: unknown) {
      const authError = err instanceof Error
        ? err as Error & { code?: string }
        : { message: "An unexpected error occurred. Please try again." };

      console.error("[Login] Error details:", authError.code, authError.message);

      // Halt on null app error - do not retry silently
      if (!authError.code) {
        setError("Authentication temporarily unavailable. Please try again.");
        setLoading(false);
        return;
      }

      // Handle specific Firebase error codes
      switch (authError.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError("Invalid email or password. Please check your credentials and try again.");
          break;
        case 'auth/network-request-failed':
          setError("Connection error. Please check your internet and try again.");
          break;
        case 'auth/too-many-requests':
          setError("Too many failed attempts. Please try again later.");
          break;
        case 'auth/user-disabled':
          setError("This account has been disabled. Contact support for assistance.");
          break;
        case 'auth/unauthorized-domain':
          setError("Sign-in is not available from this domain. Please try again later.");
          break;
        default:
          setError(authError.message || "An unexpected error occurred. Please try again.");
      }
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-72 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white">Welcome back.</h1>
        <p className="text-sm font-medium text-zinc-500">Enter your credentials to access your sanctuary.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1" htmlFor="login-email">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" />
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all placeholder:text-zinc-700"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500" htmlFor="login-password">Password</label>
            <Link href="/forgot-password" className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 hover:text-indigo-300">
              Forgot?
            </Link>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" />
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all placeholder:text-zinc-700"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-widest text-center animate-in shake-in duration-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="group relative w-full h-16 items-center justify-center overflow-hidden rounded-[1.5rem] bg-white font-black tracking-tighter text-black transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-30 disabled:hover:scale-100"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 transition-opacity group-hover:opacity-10" />
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">Sign In</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </div>
          )}
        </button>
      </form>

      <div className="pt-4 text-center">
        <p className="text-xs font-medium text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-white font-bold hover:text-indigo-400 transition-colors">
            Create Sanctuary
          </Link>
        </p>
      </div>
    </div>
  );
}
