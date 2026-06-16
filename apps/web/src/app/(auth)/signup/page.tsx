"use client";

import { useState, useEffect, useRef } from "react";

export const dynamic = "force-dynamic";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock, User, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type FirebaseAuthError = Error & { code?: string };

const getSignupErrorMessage = (err: unknown): string => {
  const authError = err instanceof Error ? (err as FirebaseAuthError) : null;

  switch (authError?.code) {
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
      return authError?.code
        ? authError.message || "An unexpected error occurred. Please try again."
        : "Sign-up temporarily unavailable. Please try again.";
  }
};

export default function SignupPage() {
  const router = useRouter();
  const pathname = usePathname();
  const showForm = pathname === "/login" || pathname === "/signup";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const errorRef = useRef<HTMLDivElement>(null);

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
      if (!auth) throw new Error("Firebase auth not initialized");
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });
      
      // Note: Custom claims (role) are managed server-side.
      // We sync with the Commerce DB which will assign the default role.
      // If sync fails, throw an error to alert the user.
      const syncRes = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!syncRes.ok) {
        const syncData = await syncRes.json().catch(() => ({}));
        throw new Error(syncData.error || syncData.message || "Failed to sync account credentials. Please try again.");
      }

      router.push("/dashboard");
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(getSignupErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold tracking-tighter text-white">New Account.</h1>
        <p className="text-sm font-medium text-muted-foreground">Begin your journey with hard anonymity protection.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1" htmlFor="signup-display-name">Display Name</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text group-focus-within:text-text transition-colors" />
            <input
              id="signup-display-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Anonymous Voyager"
              aria-invalid={!!error}
              aria-describedby={error ? "signup-error" : undefined}
              autoComplete="name"
              className="w-full h-14 bg-surface/5 border border-white/5 rounded-2xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-primary/50 focus:bg-surface/10 transition-all placeholder:text-text font-body text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1" htmlFor="signup-email">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text group-focus-within:text-text transition-colors" />
            <input
              id="signup-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              aria-invalid={!!error}
              aria-describedby={error ? "signup-error" : undefined}
              autoComplete="email"
              className="w-full h-14 bg-surface/5 border border-white/5 rounded-2xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-primary/50 focus:bg-surface/10 transition-all placeholder:text-text font-body text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1" htmlFor="signup-password">Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text group-focus-within:text-text transition-colors" />
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              aria-invalid={!!error}
              aria-describedby={error ? "signup-error" : undefined}
              autoComplete="new-password"
              className="w-full h-14 bg-surface/5 border border-white/5 rounded-2xl pl-12 pr-12 text-sm font-medium focus:outline-none focus:border-primary/50 focus:bg-surface/10 transition-all placeholder:text-text font-body text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg p-1"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4">
          <ShieldCheck className="w-5 h-5 text-text shrink-0 mt-0.5" />
          <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
            Your credentials are used solely for billing and account management. 
            Session data remains strictly decoupled and anonymous.
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

        <button
          disabled={loading}
          className="group relative w-full h-16 items-center justify-center overflow-hidden rounded-[1.5rem] bg-surface font-bold tracking-tighter text-black transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-30 disabled:hover:scale-100"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#173B57] to-gold opacity-0 transition-opacity group-hover:opacity-10" />
          {loading ? (
            <Loader2 className="w-5 h-5 motion-safe:animate-spin mx-auto" />
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">Create Account</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </div>
          )}
        </button>
      </form>

      <div className="pt-4 text-center">
        <p className="text-xs font-medium text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-white font-bold hover:text-text transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
