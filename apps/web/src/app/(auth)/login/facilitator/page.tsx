"use client";

import { useState, useEffect, useRef } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";
import { Loader2, Mail, Lock, ArrowRight, Shield, ArrowLeft, Eye, EyeOff, Info } from "lucide-react";
import { ROLES } from "@/lib/roles";
import { setAuthCookie } from "@/lib/auth-cookies";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getSafeRedirect } from "@/lib/redirect-utils";
import { validateRoleDestination } from "@/lib/role-redirect";

type FirebaseAuthError = Error & { code?: string };
type HostErrorType = "credentials" | "not_host" | "suspended" | "generic";

interface HostErrorState {
  type: HostErrorType;
  message: string;
}

const getLoginErrorMessage = (err: unknown): string => {
  const authError = err instanceof Error ? (err as FirebaseAuthError) : null;
  switch (authError?.code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid credentials. Verify your facilitator account email and password.";
    case "auth/network-request-failed":
      return "Connection error. Please check your internet and try again.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/user-disabled":
      return "This facilitator account has been suspended. Contact your coordinator.";
    default:
      return "Authentication temporarily unavailable. Please try again.";
  }
};

export default function FacilitatorLoginPage() {
  const router = useRouter();
  const { user, role, loading: authLoading, firebaseReady } = useAuth();
  const searchParams = useSearchParams();
  const from = getSafeRedirect(searchParams.get("from"), "/host/dashboard");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<HostErrorState | null>(null);

  const errorRef = useRef<HTMLDivElement>(null);

  // If logged in and role is verified as host/facilitator, redirect
  useEffect(() => {
    if (!authLoading && user) {
      if (role === ROLES.FACILITATOR || role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN) {
        const destination = from !== "/host/dashboard"
          ? validateRoleDestination(from, role)
          : "/host/dashboard";
        router.replace(destination);
      } else if (role === ROLES.PARTICIPANT) {
        setError({
          type: "not_host",
          message: "This account does not have facilitator privileges. Contact your coordinator.",
        });
      }
    }
  }, [user, role, authLoading, router, from]);

  useEffect(() => {
    if (error) {
      errorRef.current?.focus();
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!firebaseReady || !auth) {
      setError({
        type: "generic",
        message: "Authentication temporarily unavailable. Please try again.",
      });
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      const syncResponse = await fetch("/api/auth/sync", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const syncData = await syncResponse.json();

      if (!syncResponse.ok || ![ROLES.FACILITATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(syncData.user?.role)) {
        await auth.signOut();
        setError({
          type: "not_host",
          message: "This account does not have facilitator privileges. If you believe this is an error, contact your coordinator.",
        });
        setLoading(false);
        return;
      }

      await setAuthCookie(token);
      router.push("/host/dashboard");
    } catch (err: unknown) {
      const authError = err instanceof Error ? (err as FirebaseAuthError) : null;
      let type: HostErrorType = "generic";
      let message = "Authentication temporarily unavailable. Please try again.";

      if (authError?.code) {
        switch (authError.code) {
          case "auth/invalid-credential":
          case "auth/user-not-found":
          case "auth/wrong-password":
            type = "credentials";
            message = "Invalid credentials. Verify your facilitator account email and password.";
            break;
          case "auth/user-disabled":
            type = "suspended";
            message = "This facilitator account has been suspended. Contact your coordinator.";
            break;
          case "auth/network-request-failed":
            type = "generic";
            message = "Connection error. Please check your internet and try again.";
            break;
          case "auth/too-many-requests":
            type = "generic";
            message = "Too many failed attempts. Please try again later.";
            break;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }

      setError({ type, message });
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-72 items-center justify-center">
        <Loader2 className="h-6 w-6 motion-safe:animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
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
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-accent/40 bg-accent/5">
            <Shield className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-accent font-ui">
              Facilitator Portal
            </span>
          </div>
        </div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-text">
          Facilitator Sign In
        </h1>
        <p className="text-sm font-medium text-text-muted font-body">
          Access is restricted to verified community facilitators.
        </p>
      </div>

      {/* Login form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-2">
          <label
            className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted ml-1 font-ui"
            htmlFor="facilitator-email"
          >
            Facilitator Email
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-text group-focus-within:text-accent transition-colors" />
            <input
              id="facilitator-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="facilitator@example.com"
              aria-label="Facilitator email address"
              aria-invalid={!!error}
              aria-describedby={error ? "facilitator-error" : undefined}
              className="w-full h-14 bg-bg-subtle border border-border rounded-2xl pl-12 pr-4 text-sm font-medium text-text focus:outline-none focus:border-accent/50 focus:bg-surface transition-all placeholder:text-text font-body"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label
            className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted ml-1 font-ui"
            htmlFor="facilitator-password"
          >
            Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-text group-focus-within:text-accent transition-colors" />
            <input
              id="facilitator-password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              aria-label="Facilitator account password"
              aria-invalid={!!error}
              aria-describedby={error ? "facilitator-error" : undefined}
              className="w-full h-14 bg-bg-subtle border border-border rounded-2xl pl-12 pr-12 text-sm font-medium text-text focus:outline-none focus:border-accent/50 focus:bg-surface transition-all placeholder:text-text font-body"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg p-1"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <Alert
            ref={errorRef}
            variant="destructive"
            tabIndex={-1}
            id="facilitator-error"
            className="focus:outline-none focus:ring-1 focus:ring-red-500 rounded-2xl"
          >
            <AlertTitle>
              {error.type === "credentials"
                ? "Invalid Credentials"
                : error.type === "not_host"
                ? "Unauthorized Account"
                : error.type === "suspended"
                ? "Account Suspended"
                : "Authentication Error"}
            </AlertTitle>
            <AlertDescription className="space-y-2">
              <p>{error.message}</p>
              {(error.type === "not_host" || error.type === "suspended") && (
                <p className="text-[11px] font-semibold mt-1 font-body">
                  Need help?{" "}
                  <a
                    href="mailto:coordinator@hips.foundation?subject=Facilitator Access Help"
                    className="underline hover:text-accent transition-colors"
                  >
                    Contact coordinator &rarr;
                  </a>
                </p>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          aria-label="Sign in to facilitator portal"
          className="group flex w-full h-16 items-center justify-center rounded-[1.5rem] bg-primary text-white font-bold tracking-tighter shadow-lg transition-all duration-200 ease-in-out hover:bg-primary-active hover:shadow-xl hover:shadow-primary/30 active:scale-[0.99] disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 font-ui uppercase"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 motion-safe:animate-spin mx-auto" />
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" aria-hidden="true" />
              <span className="text-base">Access Facilitator Portal</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-200 ease-in-out motion-safe:group-hover:translate-x-1" />
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

      {/* Security warning notice box */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-bg-subtle border border-border text-xs text-text-muted font-body">
        <Info className="w-4 h-4 mt-0.5 shrink-0 text-accent animate-pulse" aria-hidden="true" />
        <span>Unauthorized access attempts are logged and reported to the H.I.P.S. security team.</span>
      </div>
    </div>
  );
}
