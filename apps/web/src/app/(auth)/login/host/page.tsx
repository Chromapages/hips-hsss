"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";
import { Loader2, Mail, Lock, ArrowRight, Shield, ArrowLeft } from "lucide-react";
import { ROLES } from "@/lib/roles";

type FirebaseAuthError = Error & { code?: string };

const getLoginErrorMessage = (err: unknown): string => {
  const authError = err instanceof Error ? (err as FirebaseAuthError) : null;
  switch (authError?.code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid credentials. Verify your host account email and password.";
    case "auth/network-request-failed":
      return "Connection error. Please check your internet and try again.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/user-disabled":
      return "This host account has been suspended. Contact your administrator.";
    default:
      return "Authentication temporarily unavailable. Please try again.";
  }
};

export default function HostLoginPage() {
  const router = useRouter();
  const { user, role, loading: authLoading, firebaseReady } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in as a host/admin, redirect to host dashboard
  useEffect(() => {
    if (!authLoading && user) {
      if (role === ROLES.FACILITATOR || role === ROLES.ADMIN) {
        router.replace("/host/dashboard");
      } else if (role === ROLES.PARTICIPANT) {
        // Logged in but not a host — show unauthorized message
        setError("This account does not have host privileges. Contact your coordinator.");
      }
    }
  }, [user, role, authLoading, router]);

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (process.env.NODE_ENV === "development" && password === "password") {
      if (email === "host@hips.org") {
        document.cookie = "hips-auth-token=mock-token-host; path=/; max-age=86400";
        window.location.href = "/host/dashboard";
        return;
      }
      if (email === "admin@hips.org") {
        document.cookie = "hips-auth-token=mock-token-admin; path=/; max-age=86400";
        window.location.href = "/admin";
        return;
      }
    }

    if (!firebaseReady || !auth) {
      setError("Authentication temporarily unavailable. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idTokenResult = await userCredential.user.getIdTokenResult();
      const userRole = idTokenResult.claims.role as string | undefined;

      if (userRole !== ROLES.FACILITATOR && userRole !== ROLES.ADMIN) {
        // Sign them back out immediately — wrong role
        await auth.signOut();
        setError(
          "This account does not have host privileges. If you believe this is an error, contact your coordinator."
        );
        setLoading(false);
        return;
      }

      router.push("/host/dashboard");
    } catch (err: unknown) {
      setError(getLoginErrorMessage(err));
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-72 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Host Portal badge */}
      <div className="space-y-3 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/40 bg-accent/10">
            <Shield className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent font-ui">
              Host Portal
            </span>
          </div>
        </div>
        <h1 className="font-heading text-lg md:text-xl font-bold tracking-tight text-text">
          Host Sign In
        </h1>
        <p className="text-sm font-medium text-text-muted font-body">
          Access is restricted to verified H.I.P.S. hosts.
        </p>
      </div>

      {/* Login form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted ml-1 font-ui"
            htmlFor="host-email"
          >
            Host Email
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text group-focus-within:text-accent transition-colors" />
            <input
              id="host-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="host@example.com"
              aria-label="Host email address"
              className="w-full h-14 bg-bg-subtle border border-border rounded-2xl pl-12 pr-4 text-sm font-medium text-text focus:outline-none focus:border-accent/50 focus:bg-surface transition-all placeholder:text-text font-body"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted ml-1 font-ui"
            htmlFor="host-password"
          >
            Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text group-focus-within:text-accent transition-colors" />
            <input
              id="host-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              aria-label="Host account password"
              className="w-full h-14 bg-bg-subtle border border-border rounded-2xl pl-12 pr-4 text-sm font-medium text-text focus:outline-none focus:border-accent/50 focus:bg-surface transition-all placeholder:text-text font-body"
            />
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-destructive border border-destructive text-destructive text-[10px] font-bold uppercase tracking-widest text-center font-ui"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          aria-label="Sign in to host portal"
          className="group flex w-full h-16 items-center justify-center rounded-[1.5rem] bg-primary text-white font-bold tracking-tighter shadow-lg transition-all duration-200 ease-in-out hover:bg-primary-active hover:shadow-xl hover:shadow-primary/30 active:scale-[0.99] disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 font-ui uppercase"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" aria-hidden="true" />
              <span className="text-base">Access Host Portal</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-200 ease-in-out group-hover:translate-x-1" />
            </div>
          )}
        </button>
      </form>

      {/* Back to client login */}
      <div className="text-center border-t border-border pt-5">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-text transition-colors font-body"
          aria-label="Return to client sign in page"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          Back to Client Sign In
        </Link>
      </div>

      {/* Security notice */}
      <p className="text-[10px] text-center text-text-muted/60 font-ui uppercase tracking-wider">
        Unauthorized access attempts are logged.
      </p>
    </div>
  );
}
