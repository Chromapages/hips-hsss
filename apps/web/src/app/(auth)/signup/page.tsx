"use client";

import { useState, useEffect, useRef } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock, User, ArrowRight, ShieldCheck, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type FirebaseAuthError = Error & { code?: string };

const getSignupErrorMessage = (err: unknown): string => {
  const authError = err instanceof Error ? (err as FirebaseAuthError) : null;
  if (!authError) return "Sign-up temporarily unavailable. Please try again.";

  if (!authError.code) {
    return authError.message;
  }

  switch (authError.code) {
    case "auth/email-already-in-use":
      return "An account already exists with this email address. Please sign in instead.";
    case "auth/invalid-email":
      return "Invalid email address. Please check and try again.";
    case "auth/operation-not-allowed":
      return "Sign-up is temporarily disabled. Please contact support.";
    case "auth/weak-password":
      return "Password is too weak. It must be at least 8 characters.";
    case "auth/network-request-failed":
      return "Connection error. Please check your internet and try again.";
    case "auth/user-disabled":
      return "This account has been disabled. Contact support for assistance.";
    case "auth/unauthorized-domain":
      return "Sign-up is not available from this domain. Please try again later.";
    default:
      return authError.message || "An unexpected error occurred. Please try again.";
  }
};

const getPasswordStrength = (pwd: string): 0 | 1 | 2 | 3 | 4 => {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score as 0 | 1 | 2 | 3 | 4;
};

const strengthLabels = ["", "Weak", "Fair", "Strong", "Very Strong"];

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Blur & Validation States
  const [emailBlurred, setEmailBlurred] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  
  const [passwordBlurred, setPasswordBlurred] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) {
      errorRef.current?.focus();
    }
  }, [error]);

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

  const validatePassword = (val: string) => {
    if (!val) {
      setPasswordError("Password is required.");
      return false;
    }
    if (val.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return false;
    }
    const hasUpper = /[A-Z]/.test(val);
    const hasNum = /[0-9]/.test(val);
    const hasSpecial = /[^A-Za-z0-9]/.test(val);
    
    if (!hasUpper || !hasNum || !hasSpecial) {
      setPasswordError("Password must meet all complexity requirements below.");
      return false;
    }
    
    setPasswordError(null);
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

  const handlePasswordBlur = () => {
    setPasswordBlurred(true);
    validatePassword(password);
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (passwordBlurred) {
      validatePassword(val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      setError("Please fix the errors in the form before submitting.");
      setLoading(false);
      return;
    }

    try {
      if (!auth) throw new Error("Firebase auth not initialized");
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });
      
      const syncRes = await fetch("/api/auth/sync", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${await user.getIdToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!syncRes.ok) {
        const syncData = await syncRes.json().catch(() => ({}));
        throw new Error(syncData.error || syncData.message || "Failed to sync account credentials. Please try again.");
      }

      router.push("/dashboard?welcome=1");
    } catch (err: unknown) {
      console.error("Signup error:", err);
      setError(getSignupErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(password);
  const activeColor =
    strength === 1
      ? "bg-destructive"
      : strength === 2
      ? "bg-warning"
      : strength >= 3
      ? "bg-success"
      : "bg-border";

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
          New Account.
        </h1>
        <p className="text-sm font-medium text-text-muted font-body">
          Create your account to join our secure peer support community.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Field */}
        <div className="space-y-2">
          <label
            className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted ml-1 font-ui"
            htmlFor="signup-display-name"
          >
            Display Name
          </label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-text group-focus-within:text-primary transition-colors" />
            <input
              id="signup-display-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Anonymous Voyager"
              aria-invalid={!!error}
              aria-describedby={error ? "signup-error" : undefined}
              autoComplete="nickname"
              className="w-full h-14 bg-bg-subtle border border-border rounded-2xl pl-12 pr-4 text-sm font-medium text-text focus:outline-none focus:border-primary/50 focus:bg-surface transition-all placeholder:text-text font-body"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label
            className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted ml-1 font-ui"
            htmlFor="signup-email"
          >
            Email Address
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-text group-focus-within:text-primary transition-colors" />
            <input
              id="signup-email"
              type="email"
              required
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={handleEmailBlur}
              placeholder="name@example.com"
              aria-invalid={!!emailError}
              aria-describedby={emailError ? "email-error" : undefined}
              autoComplete="email"
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

        {/* Password Field */}
        <div className="space-y-2">
          <label
            className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted ml-1 font-ui"
            htmlFor="signup-password"
          >
            Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-text group-focus-within:text-primary transition-colors" />
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              onBlur={handlePasswordBlur}
              placeholder="••••••••"
              aria-invalid={!!passwordError}
              aria-describedby={passwordError ? "password-error" : undefined}
              autoComplete="new-password"
              className={`w-full h-14 bg-bg-subtle border border-border rounded-2xl pl-12 pr-12 text-sm font-medium text-text focus:outline-none focus:border-primary/50 focus:bg-surface transition-all placeholder:text-text font-body ${
                passwordBlurred && passwordError ? "user-invalid-fallback" : ""
              }`}
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
          {passwordBlurred && passwordError && (
            <p id="password-error" className="text-xs text-destructive mt-1 font-body ml-1" role="alert">
              {passwordError}
            </p>
          )}

          {/* Password Strength Meter & Explicit Constraints */}
          <div className="space-y-2 mt-2 px-1">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                    strength >= step ? activeColor : "bg-border/30"
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider font-ui">
              <span className="text-text-muted">Strength:</span>
              {password ? (
                <span className={
                  strength === 1
                    ? "text-destructive"
                    : strength === 2
                    ? "text-warning"
                    : "text-success"
                }>
                  {strengthLabels[strength]}
                </span>
              ) : (
                <span className="text-text-muted">None</span>
              )}
            </div>
            
            {/* Visual Checklist for Password Rules */}
            <ul className="text-xs space-y-1 mt-2 font-body text-text-muted" aria-label="Password complexity checklist">
              <li className={`flex items-center gap-1.5 ${password.length >= 8 ? "text-success font-medium" : ""}`}>
                <span className="font-mono">{password.length >= 8 ? "✓" : "○"}</span> At least 8 characters
              </li>
              <li className={`flex items-center gap-1.5 ${/[A-Z]/.test(password) ? "text-success font-medium" : ""}`}>
                <span className="font-mono">{/[A-Z]/.test(password) ? "✓" : "○"}</span> At least one uppercase letter
              </li>
              <li className={`flex items-center gap-1.5 ${/[0-9]/.test(password) ? "text-success font-medium" : ""}`}>
                <span className="font-mono">{/[0-9]/.test(password) ? "✓" : "○"}</span> At least one number
              </li>
              <li className={`flex items-center gap-1.5 ${/[^A-Za-z0-9]/.test(password) ? "text-success font-medium" : ""}`}>
                <span className="font-mono">{/[^A-Za-z0-9]/.test(password) ? "✓" : "○"}</span> At least one special character
              </li>
            </ul>
          </div>
        </div>

        {/* Terms of Service Checkbox */}
        <div className="flex items-center gap-3 py-1">
          <div className="flex items-center justify-center w-11 h-11 shrink-0">
            <input
              type="checkbox"
              id="signup-tos"
              required
              className="w-6 h-6 rounded border-border accent-primary cursor-pointer focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <label
            htmlFor="signup-tos"
            className="text-xs text-text-muted select-none cursor-pointer leading-tight font-body font-medium"
          >
            I agree to the{" "}
            <Link href="/terms" className="text-primary underline font-semibold hover:text-accent">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary underline font-semibold hover:text-accent">
              Privacy Policy
            </Link>
            .
          </label>
        </div>

        {/* Privacy Info Notice */}
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-text shrink-0 mt-0.5" />
          <p className="text-xs text-text-muted leading-relaxed font-medium font-body">
            Your personal information is used only for account management. Your activity in support groups remains completely private.
          </p>
        </div>

        {error && (
          <Alert
            ref={errorRef}
            variant="destructive"
            tabIndex={-1}
            id="signup-error"
            className="focus:outline-none focus:ring-1 focus:ring-red-500 rounded-2xl"
          >
            <AlertTitle>Signup Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          aria-label="Create new account"
          className="group flex w-full h-16 items-center justify-center rounded-[1.5rem] border border-border bg-surface font-bold tracking-tighter text-black shadow-sm transition-all duration-200 ease-in-out hover:border-primary hover:bg-primary hover:text-white hover:shadow-xl hover:shadow-primary/25 active:scale-[0.99] disabled:opacity-30 disabled:hover:border-border disabled:hover:bg-surface disabled:hover:text-black disabled:hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 font-ui uppercase"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 motion-safe:animate-spin mx-auto" />
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">Create Account</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-200 ease-in-out motion-safe:group-hover:translate-x-1" />
            </div>
          )}
        </button>
      </form>

      {/* Redirect to sign in */}
      <div className="pt-4 text-center">
        <p className="text-xs font-medium text-text-muted font-body">
          Already have an account?{" "}
          <Link href="/login" className="text-text font-bold hover:text-accent transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
