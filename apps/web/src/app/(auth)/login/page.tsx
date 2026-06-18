"use client";

import { useState, useEffect, useRef } from "react";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";
import { Loader2, Mail, Lock, ArrowRight, Eye, EyeOff, ArrowLeft, HelpCircle, ChevronDown } from "lucide-react";
import { getSafeRedirect } from "@/lib/redirect-utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getRoleDefaultDestination, validateRoleDestination } from "@/lib/role-redirect";

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
  const { user, role, loading: authLoading, firebaseReady } = useAuth();
  const searchParams = useSearchParams();
  const from = getSafeRedirect(searchParams.get("from"), "/dashboard");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Email Validation on Blur
  const [emailBlurred, setEmailBlurred] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) {
      errorRef.current?.focus();
    }
  }, [error]);

  useEffect(() => {
    if (!authLoading && user) {
      const destination = from !== "/dashboard"
        ? validateRoleDestination(from, role)
        : getRoleDefaultDestination(role);
      router.replace(destination);
    }
  }, [user, role, authLoading, router, from]);

  const validateEmail = (val: string) => {
    if (!val) {
      setEmailError("Email address is required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      setEmailError("Please enter a valid email address (e.g., name@example.com).");
      return false;
    }
    setEmailError(null);
    return true;
  };

  const handleEmailBlur = () => {
    setEmailBlurred(true);
    validateEmail(email);
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (emailBlurred) {
      validateEmail(val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const isEmailValid = validateEmail(email);
    if (!isEmailValid) {
      setError("Please fix the errors in the form before submitting.");
      setLoading(false);
      return;
    }

    if (!firebaseReady || !auth) {
      setError("Authentication temporarily unavailable. Please try again.");
      setLoading(false);
      return;
    }

    try {
      // Configure session persistence based on user preference
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      
      const credential = await signInWithEmailAndPassword(auth, email, password);
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
        const errData = await mfaRes.json().catch(() => ({}));
        setError(errData.error || "MFA session initiation failed. Please try again.");
        setLoading(false);
        return;
      }

      const mfaData = (await mfaRes.json()) as {
        status: "authenticated" | "mfa_required" | "mfa_setup_required";
        pendingToken?: string;
        destination?: string | null;
      };

      if (mfaData.status === "mfa_required" && mfaData.pendingToken) {
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

      setLoading(false);
    } catch (err: unknown) {
      setError(getLoginErrorMessage(err));
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-72 items-center justify-center">
        <Loader2 className="h-6 w-6 motion-safe:animate-spin text-primary" />
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
        <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-text">
          Welcome back.
        </h1>
        <p className="text-sm font-medium text-text-muted font-body">
          Enter your email and password to sign in.
        </p>
      </div>

      {/* Main client login form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Address */}
        <div className="space-y-2">
          <label
            className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted ml-1 font-ui"
            htmlFor="login-email"
          >
            Email Address
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-text group-focus-within:text-primary transition-colors" />
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={handleEmailBlur}
              placeholder="name@example.com"
              aria-label="Email address"
              aria-invalid={!!emailError}
              aria-describedby={emailError ? "email-error" : undefined}
              autoComplete="username"
              className={`w-full h-14 bg-bg-subtle border border-border rounded-2xl pl-12 pr-4 text-sm font-medium text-text focus:outline-none focus:border-primary/50 focus:bg-surface transition-all placeholder:text-text font-body ${
                emailBlurred && emailError ? "user-invalid-fallback" : ""
              }`}
            />
          </div>
          {emailBlurred && emailError && (
            <p id="email-error" className="text-xs text-destructive mt-1 font-body ml-1" role="alert">
              {emailError}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label
              className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted font-ui"
              htmlFor="login-password"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-bold uppercase tracking-[0.2em] text-primary hover:text-accent transition-colors font-ui"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-text group-focus-within:text-primary transition-colors" />
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg p-3"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Remember this Device */}
        <div className="flex items-center gap-3 py-1">
          <div className="flex items-center justify-center w-11 h-11 shrink-0">
            <input
              type="checkbox"
              id="login-remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-6 h-6 rounded border-border accent-primary cursor-pointer focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <label
            htmlFor="login-remember"
            className="text-sm text-text-muted select-none cursor-pointer leading-tight font-body font-medium"
          >
            Remember this device
          </label>
        </div>

        {/* MFA Explainer dropdown */}
        <details className="group p-4 rounded-2xl bg-primary/5 border border-primary/10 transition-all font-body text-xs text-text-muted">
          <summary className="flex items-center justify-between font-ui font-bold tracking-wide uppercase cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-1">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-primary" />
              <span>Why is extra security (MFA) required?</span>
            </div>
            <ChevronDown className="w-4 h-4 text-primary transition-transform group-open:rotate-180" />
          </summary>
          <div className="mt-3 leading-relaxed space-y-2 text-xs">
            <p>
              Multi-Factor Authentication adds an extra layer of protection to your account by requesting a secure verification code, ensuring that only you can access your account even if someone else learns your password.
            </p>
            <p>
              Your verification details are used only for account recovery and are never linked to your peer group activity.
            </p>
          </div>
        </details>

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
              <ArrowRight className="w-5 h-5 transition-transform duration-200 ease-in-out motion-safe:group-hover:translate-x-1" />
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

      {/* Access Host Portal Link */}
      <div className="border-t border-border pt-5 text-center">
        <p className="text-xs text-text-muted">
          Are you a host?{" "}
          <Link href="/login/host" className="font-semibold text-accent hover:underline">
            Access Host Portal →
          </Link>
        </p>
      </div>
    </div>
  );
}
