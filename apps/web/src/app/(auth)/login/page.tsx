"use client";

import { useState, useEffect, useRef } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";
import { Loader2, Mail, Lock, ArrowRight, Shield, ChevronDown, X, Eye, EyeOff } from "lucide-react";
import { getSafeRedirect } from "@/lib/redirect-utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type FirebaseAuthError = Error & { code?: string };



const getLoginErrorMessage = (err: unknown): string => {
  const authError = err instanceof Error ? (err as FirebaseAuthError) : null;

  switch (authError?.code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid email or password. Please check your credentials and try again.";
    case "auth/network-request-failed":
      return "Connection error. Please check your internet and try again.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/user-disabled":
      return "This account has been disabled. Contact support for assistance.";
    case "auth/unauthorized-domain":
      return "Sign-in is not available from this domain. Please try again later.";
    default:
      return authError?.code
        ? authError.message || "An unexpected error occurred. Please try again."
        : "Authentication temporarily unavailable. Please try again.";
  }
};

export default function LoginPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, role, loading: authLoading, firebaseReady } = useAuth();
  const searchParams = useSearchParams();
  const from = getSafeRedirect(searchParams.get("from"), "/dashboard");

  const showForm = pathname === "/login" || pathname === "/signup";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const errorRef = useRef<HTMLDivElement>(null);
  const hostErrorRef = useRef<HTMLDivElement>(null);

  // Host access gate state
  const [showHostGate, setShowHostGate] = useState(false);
  const [hostCode, setHostCode] = useState("");
  const [hostCodeError, setHostCodeError] = useState<string | null>(null);
  const [hostCodeLoading, setHostCodeLoading] = useState(false);
  const hostCodeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (error) {
      errorRef.current?.focus();
    }
  }, [error]);

  useEffect(() => {
    if (hostCodeError) {
      hostErrorRef.current?.focus();
    }
  }, [hostCodeError]);

  useEffect(() => {
    if (!authLoading && user) {
      const destination = from !== "/dashboard"
        ? from
        : role === "SUPER_ADMIN" || role === "ADMIN"
          ? "/admin"
          : role === "FACILITATOR"
            ? "/facilitator"
            : "/dashboard";
      router.replace(destination);
    }
  }, [user, role, authLoading, router, from]);

  useEffect(() => {
    if (showHostGate) {
      setTimeout(() => hostCodeRef.current?.focus(), 100);
    }
  }, [showHostGate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!firebaseReady || !auth) {
      setError("Authentication temporarily unavailable. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      // Layer 4: after Firebase auth, decide whether MFA is required.
      // We hit /api/auth/mfa/session with the freshly-issued ID token.
      const idToken = await credential.user.getIdToken();
      const mfaRes = await fetch("/api/auth/mfa/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ destination: from }),
      });

      if (!mfaRes.ok) {
        // If the MFA session check itself fails, treat the user as
        // authenticated and let the existing redirect logic run.
        setLoading(false);
        return;
      }

      const mfaData = (await mfaRes.json()) as {
        status: "authenticated" | "mfa_required" | "mfa_setup_required";
        pendingToken?: string;
        destination?: string | null;
      };

      if (mfaData.status === "mfa_required" && mfaData.pendingToken) {
        // Persist the pendingToken across the redirect via query string —
        // the /mfa-verify page reads it back. Do NOT store in localStorage.
        const verifyUrl = new URL("/mfa-verify", window.location.origin);
        verifyUrl.searchParams.set("token", mfaData.pendingToken);
        if (mfaData.destination) {
          verifyUrl.searchParams.set("from", mfaData.destination);
        }
        window.location.href = verifyUrl.toString();
        return;
      }

      if (mfaData.status === "mfa_setup_required") {
        const setupUrl = new URL("/mfa-setup", window.location.origin);
        if (mfaData.destination) setupUrl.searchParams.set("from", mfaData.destination);
        window.location.href = setupUrl.toString();
        return;
      }

      // status === "authenticated" — fall through to the role-based redirect
      // in the existing useEffect.
      setLoading(false);
    } catch (err: unknown) {
      setError(getLoginErrorMessage(err));
      setLoading(false);
    }
  };

  const handleVerifyHostCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setHostCodeLoading(true);
    setHostCodeError(null);

    try {
      const res = await fetch("/api/auth/host-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: hostCode.trim() }),
      });

      if (res.ok) {
        router.push("/login/host");
      } else {
        setHostCodeError("Incorrect access code. Contact your coordinator for the current code.");
        setHostCodeLoading(false);
      }
    } catch (error) {
      setHostCodeError("An error occurred. Please try again.");
      setHostCodeLoading(false);
    }
  };

  const handleToggleHostGate = () => {
    setShowHostGate((prev) => !prev);
    setHostCode("");
    setHostCodeError(null);
  };

  if (authLoading && !showForm) {
    return (
      <div className="flex min-h-72 items-center justify-center">
        <Loader2 className="h-6 w-6 motion-safe:animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-heading text-lg md:text-xl font-bold tracking-tight text-text whitespace-nowrap text-center">
          Welcome back.
        </h1>
        <p className="text-sm font-medium text-text-muted font-body text-center">
          Enter your credentials to access your account.
        </p>
      </div>

      {/* Main client login form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted ml-1 font-ui"
            htmlFor="login-email"
          >
            Email Address
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text group-focus-within:text-primary transition-colors" />
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              aria-label="Email address"
              aria-invalid={!!error}
              aria-describedby={error ? "login-error" : undefined}
              autoComplete="email"
              className="w-full h-14 bg-bg-subtle border border-border rounded-2xl pl-12 pr-4 text-sm font-medium text-text focus:outline-none focus:border-primary/50 focus:bg-surface transition-all placeholder:text-text font-body"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted font-ui"
              htmlFor="login-password"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:text-primary font-ui"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text group-focus-within:text-primary transition-colors" />
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              aria-label="Password"
              aria-invalid={!!error}
              aria-describedby={error ? "login-error" : undefined}
              autoComplete="current-password"
              className="w-full h-14 bg-bg-subtle border border-border rounded-2xl pl-12 pr-12 text-sm font-medium text-text focus:outline-none focus:border-primary/50 focus:bg-surface transition-all placeholder:text-text font-body"
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
            id="login-error"
            className="focus:outline-none focus:ring-1 focus:ring-red-500 rounded-2xl"
          >
            <AlertTitle>Login Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <button
          type="submit"
          disabled={loading}
          aria-label="Sign in to your account"
          className="group flex w-full h-16 items-center justify-center rounded-[1.5rem] border border-border bg-surface font-bold tracking-tighter text-black shadow-sm transition-all duration-200 ease-in-out hover:border-primary hover:bg-primary hover:text-white hover:shadow-xl hover:shadow-primary/25 active:scale-[0.99] disabled:opacity-30 disabled:hover:border-border disabled:hover:bg-surface disabled:hover:text-black disabled:hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 font-ui uppercase"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 motion-safe:animate-spin mx-auto" />
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">Sign In</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-200 ease-in-out group-hover:translate-x-1" />
            </div>
          )}
        </button>
      </form>

      {/* Create account link */}
      <div className="text-center">
        <p className="text-xs font-medium text-text-muted font-body">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-text font-bold hover:text-accent transition-colors">
            Create Account
          </Link>
        </p>
      </div>

      {/* Host Access Gate — subtle, bottom of card */}
      <div className="border-t border-border pt-5">
        <button
          type="button"
          onClick={handleToggleHostGate}
          aria-expanded={showHostGate}
          aria-controls="host-gate-panel"
          className="flex items-center justify-center gap-1.5 w-full text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted/60 hover:text-text-muted transition-colors duration-200 font-ui group"
        >
          {showHostGate ? (
            <X className="w-3 h-3" />
          ) : (
            <Shield className="w-3 h-3 group-hover:text-accent transition-colors" />
          )}
          {showHostGate ? "Cancel Host Access" : "Are you a host? Access the host portal →"}
          {!showHostGate && (
            <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
          )}
        </button>

        {/* Collapsible host code form */}
        <div
          id="host-gate-panel"
          aria-hidden={!showHostGate}
          inert={!showHostGate}
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showHostGate ? "max-h-80 opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-accent" aria-hidden="true" />
              <p className="text-xs font-bold text-text uppercase tracking-wider font-ui">
                Host Portal Access
              </p>
            </div>
            <p className="text-[11px] text-text-muted font-body mb-4">
              Enter the access code provided by your coordinator to proceed to the host login.
            </p>

            <form onSubmit={handleVerifyHostCode} className="space-y-3">
              <div className="relative">
                <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-accent" />
                <input
                  ref={hostCodeRef}
                  id="host-access-code"
                  type="text"
                  value={hostCode}
                  onChange={(e) => setHostCode(e.target.value)}
                  placeholder="Enter host access code"
                  aria-label="Host access code"
                  aria-invalid={!!hostCodeError}
                  aria-describedby={hostCodeError ? "host-code-error" : undefined}
                  autoComplete="off"
                  className="w-full h-12 bg-surface border border-accent/40 rounded-xl pl-10 pr-4 text-sm font-mono font-medium text-text focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all placeholder:text-text uppercase tracking-widest"
                />
              </div>

              {hostCodeError && (
                <Alert
                  ref={hostErrorRef}
                  variant="destructive"
                  tabIndex={-1}
                  id="host-code-error"
                  className="focus:outline-none focus:ring-1 focus:ring-red-500 rounded-xl p-3"
                >
                  <AlertDescription>{hostCodeError}</AlertDescription>
                </Alert>
              )}

              <button
                type="submit"
                disabled={hostCodeLoading || !hostCode.trim()}
                aria-label="Verify host access code"
                className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-wider font-ui transition-all hover:bg-primary-active disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {hostCodeLoading ? (
                  <Loader2 className="w-4 h-4 motion-safe:animate-spin" />
                ) : (
                  <>
                    <Shield className="w-3.5 h-3.5" />
                    Verify Code
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
