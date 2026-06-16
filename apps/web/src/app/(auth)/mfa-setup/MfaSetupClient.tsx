"use client";

/**
 * MFA setup client.
 *
 * Three steps:
 *  1. POST /api/auth/mfa/setup → server stores encrypted secret, returns
 *     QR data URL + plaintext secret for manual entry.
 *  2. User scans the QR (or types the secret), then enters the 6-digit
 *     code from their authenticator.
 *  3. POST /api/auth/mfa/verify with the code → server flips mfaEnabled
 *     to true and returns 10 backup codes. We display them once with a
 *     clear warning to store them safely, then redirect to the destination.
 */

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck, Copy, Check, AlertTriangle, ArrowRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getSafeRedirect } from "@/lib/redirect-utils";

type Step = "loading" | "scan" | "verify" | "backup" | "done" | "error";

export default function MfaSetupClient() {
  const router = useRouter();
  const params = useSearchParams();
  const from = getSafeRedirect(params.get("from"), "/admin");

  const [step, setStep] = useState<Step>("loading");
  const [error, setError] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  // Step 1: call /api/auth/mfa/setup
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const idToken = await (async () => {
          const { auth } = await import("@/lib/firebase-client");
          if (!auth?.currentUser) return null;
          return await auth.currentUser.getIdToken();
        })();
        if (!idToken) {
          setError("Your session expired. Please sign in again.");
          setStep("error");
          return;
        }
        const res = await fetch("/api/auth/mfa/setup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        });
        if (cancelled) return;
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { error?: string };
          setError(body.error ?? "Failed to start MFA setup. Try again later.");
          setStep("error");
          return;
        }
        const data = (await res.json()) as { qrDataUrl: string; secret: string };
        setQrDataUrl(data.qrDataUrl);
        setSecret(data.secret);
        setStep("scan");
      } catch {
        if (!cancelled) {
          setError("Network error. Please try again.");
          setStep("error");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Step 3: verify the code
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const idToken = await (async () => {
        const { auth } = await import("@/lib/firebase-client");
        if (!auth?.currentUser) return null;
        return await auth.currentUser.getIdToken();
      })();
      if (!idToken) {
        setError("Your session expired. Please sign in again.");
        setStep("error");
        return;
      }
      const res = await fetch("/api/auth/mfa/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ code: code.trim() }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "That code didn't work. Try the next one from your app.");
        return;
      }
      const data = (await res.json()) as { backupCodes: string[] };
      setBackupCodes(data.backupCodes);
      setStep("backup");
    } catch {
      setError("Network error. Please try again.");
    }
  };

  const copyBackupCodes = () => {
    void navigator.clipboard.writeText(backupCodes.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const finish = () => {
    router.replace(from);
  };

  if (step === "loading") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12">
        <Loader2 className="w-6 h-6 motion-safe:animate-spin text-primary" />
        <p className="text-sm text-text-muted">Preparing your secure setup…</p>
      </div>
    );
  }

  if (step === "error") {
    return (
      <Alert ref={errorRef} variant="destructive" className="rounded-2xl">
        <AlertTitle>Setup Failed</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (step === "scan") {
    return (
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-heading text-lg md:text-xl font-bold tracking-tight text-text">
            Set up two-factor authentication
          </h1>
          <p className="text-sm font-medium text-text-muted font-body">
            Scan this QR code with Google Authenticator, Authy, or 1Password.
          </p>
        </div>

        {qrDataUrl && (
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUrl}
              alt="MFA QR code"
              className="rounded-2xl border border-border bg-white p-4 w-56 h-56"
            />
          </div>
        )}

        {secret && (
          <details className="rounded-xl border border-border bg-bg-subtle p-3 text-xs font-mono">
            <summary className="cursor-pointer text-text-muted">Can't scan? Enter the secret manually.</summary>
            <p className="mt-2 break-all text-text">{secret}</p>
          </details>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <label
            htmlFor="mfa-verify-code"
            className="block text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted ml-1 font-ui"
          >
            Enter the 6-digit code from your app
          </label>
          <input
            id="mfa-verify-code"
            type="text"
            inputMode="numeric"
            required
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            maxLength={6}
            placeholder="123456"
            className="w-full h-14 bg-bg-subtle border border-border rounded-2xl px-4 text-center text-2xl font-mono font-bold tracking-widest text-text focus:outline-none focus:border-primary/50 focus:bg-surface"
          />
          {error && (
            <Alert ref={errorRef} variant="destructive" tabIndex={-1} className="rounded-2xl">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <button
            type="submit"
            disabled={code.length !== 6}
            className="w-full h-16 rounded-[1.5rem] border border-border bg-surface text-black font-bold uppercase tracking-tighter font-ui shadow-sm transition-all hover:border-primary hover:bg-primary hover:text-white hover:shadow-xl hover:shadow-primary/25 active:scale-[0.99] disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <span className="text-lg">Confirm and enable</span>
          </button>
        </form>
      </div>
    );
  }

  if (step === "backup") {
    return (
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
          </div>
          <h1 className="font-heading text-lg md:text-xl font-bold tracking-tight text-text">
            Save your backup codes
          </h1>
          <p className="text-sm font-medium text-text-muted font-body">
            These ten codes are the only way to access your account if you
            lose your authenticator device. Each code works once. Store
            them somewhere safe now — they will not be shown again.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 font-mono text-sm">
          {backupCodes.map((c) => (
            <div key={c} className="text-text tracking-wider select-all">{c}</div>
          ))}
        </div>

        <button
          type="button"
          onClick={copyBackupCodes}
          className="w-full h-12 rounded-xl border border-border bg-bg-subtle text-text font-medium font-ui transition-all hover:bg-surface inline-flex items-center justify-center gap-2"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy all codes"}
        </button>

        <button
          type="button"
          onClick={finish}
          className="w-full h-16 rounded-[1.5rem] border border-border bg-surface text-black font-bold uppercase tracking-tighter font-ui shadow-sm transition-all hover:border-primary hover:bg-primary hover:text-white hover:shadow-xl hover:shadow-primary/25 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 inline-flex items-center justify-center gap-2"
        >
          <span className="text-lg">I've saved them — continue</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return null;
}
