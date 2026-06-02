"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";

type FirebaseAuthError = Error & { code?: string };

function getLoginErrorMessage(err: unknown) {
  const authError = err instanceof Error
    ? err as FirebaseAuthError
    : null;

  switch (authError?.code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return "Invalid email or password. Please check your credentials and try again.";
    case 'auth/network-request-failed':
      return "Connection error. Please check your internet and try again.";
    case 'auth/too-many-requests':
      return "Too many failed attempts. Please try again later.";
    case 'auth/user-disabled':
      return "This account has been disabled. Contact support for assistance.";
    case 'auth/unauthorized-domain':
      return "Sign-in is not available from this domain. Please try again later.";
    default:
      return authError?.code
        ? authError.message || "An unexpected error occurred. Please try again."
        : "Authentication temporarily unavailable. Please try again.";
  }
}

export default function LoginPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading, firebaseReady } = useAuth();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/dashboard";

  // CRITICAL: On /login, render the form immediately even while AuthProvider is still
  // resolving onAuthStateChanged. Gating the form behind authLoading causes a permanent
  // loading spinner if Firebase's first auth-state callback is delayed or blocked.
  // The auto-redirect useEffect below still handles the "already signed in" case.
  const showForm = pathname === "/login" || pathname === "/signup";

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
      console.warn("[Login] Firebase not ready or auth is null");
      setError("Authentication temporarily unavailable. Please try again.");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push(from);
    } catch (err: unknown) {
      setError(getLoginErrorMessage(err));
      setLoading(false);
    }
  };

  if (authLoading && !showForm) {
    return (
      <div className="flex min-h-72 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        {/* H1 - serif heading */}
        <h1 className="font-heading text-lg md:text-xl font-bold tracking-tight text-[#173B57] whitespace-nowrap text-center">Welcome back.</h1>
        <p className="text-sm font-medium text-[#6F8291] font-body text-center">Enter your credentials to access your account.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6F8291] ml-1 font-ui" htmlFor="login-email">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full h-14 bg-zinc-50 border border-zinc-200 rounded-2xl pl-12 pr-4 text-sm font-medium text-[#173B57] focus:outline-none focus:border-primary/50 focus:bg-white transition-all placeholder:text-zinc-400 font-body"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6F8291] font-ui" htmlFor="login-password">Password</label>
            <Link href="/forgot-password" className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:text-primary font-ui">
              Forgot?
            </Link>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-14 bg-zinc-50 border border-zinc-200 rounded-2xl pl-12 pr-4 text-sm font-medium text-[#173B57] focus:outline-none focus:border-primary/50 focus:bg-white transition-all placeholder:text-zinc-400 font-body"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[10px] font-bold uppercase tracking-widest text-center animate-in shake-in duration-300 font-ui">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="group flex w-full h-16 items-center justify-center rounded-[1.5rem] border border-zinc-200 bg-white font-bold tracking-tighter text-black shadow-sm transition-all duration-200 ease-in-out hover:border-[#173B57] hover:bg-[#173B57] hover:text-white hover:shadow-xl hover:shadow-[#173B57]/25 active:scale-[0.99] disabled:opacity-30 disabled:hover:border-zinc-200 disabled:hover:bg-white disabled:hover:text-black disabled:hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173B57] focus-visible:ring-offset-2 font-ui uppercase"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">Sign In</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-200 ease-in-out group-hover:translate-x-1" />
            </div>
          )}
        </button>
      </form>

      <div className="pt-4 text-center">
        <p className="text-xs font-medium text-[#6F8291] font-body">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#173B57] font-bold hover:text-[#bb9644] transition-colors">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
