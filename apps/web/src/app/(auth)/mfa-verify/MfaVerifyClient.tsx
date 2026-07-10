"use client";

/**
 * MFA verify client component.
 *
 * Two entry points:
 *  - /mfa-verify?token=<pendingToken>&from=<destination>  (login flow)
 *  - /mfa-verify?sudo=1                                  (sudo entry)
 *
 * Submits the 6-digit TOTP code (or 10-char backup code) to
 * /api/auth/mfa/challenge. On success, if the original purpose was
 * 'login', redirects to `from`. If 'sudo', submits the result to
 * /api/auth/sudo which sets the sudo cookie and the parent re-tries
 * the destructive action.
 *
 * The pendingToken is passed in the URL — it's a one-time use bearer
 * token, and 5-minute TTL.
 */

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck, KeyRound } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getSafeRedirect } from "@/lib/redirect-utils";

export default function MfaVerifyClient() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const from = getSafeRedirect(params.get("from"), "/dashboard");
  const isSudo = params.get("sudo") === "1";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useBackup, setUseBackup] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [useBackup]);

  if (!token) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Missing challenge token</AlertTitle>
        <AlertDescription>
          This page requires a valid challenge token. Please return to the
          previous step and try again.
        </AlertDescription>
      </Alert>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = isSudo ? "/api/auth/sudo" : "/api/auth/mfa/challenge";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pendingToken: token, code: code.trim() }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        const reason = body.error ?? "Invalid code";
        if (reason.includes("expired") || reason.includes("not_found")) {
          setError("This challenge has expired. Please sign in again.");
        } else {
          setError("That code didn't work. Try again or use a backup code.");
        }
        setLoading(false);
        return;
      }

      if (isSudo) {
        // Parent page is waiting for the sudo cookie. Send it back to the
        // origin page that initiated the sudo request.
        const back = new URL(window.location.href);
        const ret = back.searchParams.get("return") ?? "/admin";
        window.location.href = ret;
        return;
      }

      // Login flow success — go to the originally-requested destination.
      router.replace(from);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
        <h1 className="font-heading text-lg md:text-xl font-bold tracking-tight text-text">
          {isSudo ? "Confirm it's you" : "Two-factor verification"}
        </h1>
        <p className="text-sm font-medium text-text-muted font-body">
          {useBackup
            ? "Enter one of your saved backup codes (format: ABCDE-FGHJK)."
            : "Open your authenticator app and enter the 6-digit code."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="mfa-code"
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted ml-1 font-ui"
          >
            {useBackup ? "Backup Code" : "Authenticator Code"}
          </label>
          <input
            ref={inputRef}
            id="mfa-code"
            type="text"
            inputMode={useBackup ? "text" : "numeric"}
            autoComplete="one-time-code"
            required
            value={code}
            onChange={(e) => setCode(useBackup ? e.target.value.toUpperCase() : e.target.value.replace(/\D/g, ""))}
            placeholder={useBackup ? "ABCDE-FGHJK" : "123456"}
            maxLength={useBackup ? 11 : 6}
            aria-label={useBackup ? "Backup code" : "Authenticator code"}
            className="w-full h-14 bg-bg-subtle border border-border rounded-2xl px-4 text-center text-2xl font-mono font-bold tracking-widest text-text focus:outline-none focus:border-primary/50 focus:bg-surface transition-all"
          />
        </div>

        {error && (
          <Alert ref={errorRef} variant="destructive" tabIndex={-1} className="rounded-2xl">
            <AlertTitle>Verification Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <button
          type="submit"
          disabled={loading || (useBackup ? code.replace(/-/g, "").length !== 10 : code.length !== 6)}
          aria-label="Verify code"
          className="w-full h-16 rounded-[1.5rem] border border-border bg-surface text-black font-bold uppercase tracking-tighter font-ui shadow-sm transition-all duration-200 hover:border-primary hover:bg-primary hover:text-white hover:shadow-xl hover:shadow-primary/25 active:scale-[0.99] disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 motion-safe:animate-spin mx-auto" />
          ) : (
            <span className="text-lg">Verify</span>
          )}
        </button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            setUseBackup((p) => !p);
            setCode("");
            setError(null);
          }}
          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted/60 hover:text-text-muted transition-colors font-ui"
        >
          <KeyRound className="w-3 h-3" />
          {useBackup ? "Use authenticator code instead" : "Lost your device? Use a backup code"}
        </button>
      </div>
    </div>
  );
}
