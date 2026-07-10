"use client";

/**
 * Client-side helper to enter sudo mode for a destructive action.
 *
 * Flow:
 *  1. POST /api/auth/sudo/request → get a pendingToken
 *  2. Show the user a 6-digit code prompt (this is a modal in the page)
 *  3. POST /api/auth/sudo with { pendingToken, code } → set sudo cookie
 *  4. The caller retries the original destructive action
 *
 * The pendingToken + code go to /api/auth/sudo. On success, the server
 * sets an HttpOnly sudo_token cookie. Subsequent destructive API calls
 * from the same origin will be authorized.
 */

import { useState, useCallback } from "react";

export type SudoState = "idle" | "requesting" | "awaiting_code" | "verifying" | "ready" | "error";

export type UseSudoReturn = {
  state: SudoState;
  error: string | null;
  /** Call when the user clicks a destructive action. Returns true if sudo
   *  is ready (either already was, or the user just verified). */
  ensureSudo: () => Promise<boolean>;
  /** Reset state — used when the user dismisses the prompt. */
  reset: () => void;
};

// Stash the pendingToken on the window so it survives between the
// request and the code-submit. Single-shot — cleared on success.
declare global {
  interface Window {
    __sudoPendingToken?: string;
  }
}

export function useSudo(): UseSudoReturn {
  const [state, setState] = useState<SudoState>("idle");
  const [error, setError] = useState<string | null>(null);

  const ensureSudo = useCallback(async (): Promise<boolean> => {
    if (state === "ready") return true;
    setError(null);
    setState("requesting");
    try {
      const req = await fetch("/api/auth/sudo/request", { method: "POST" });
      if (!req.ok) {
        const body = (await req.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "Failed to request sudo challenge");
        setState("error");
        return false;
      }
      const { pendingToken } = (await req.json()) as { pendingToken: string };
      setState("awaiting_code");
      window.__sudoPendingToken = pendingToken;
      return true;
    } catch {
      setError("Network error");
      setState("error");
      return false;
    }
  }, [state]);

  const reset = useCallback(() => {
    setState("idle");
    setError(null);
    delete window.__sudoPendingToken;
  }, []);

  return { state, error, ensureSudo, reset };
}

export async function completeSudo(code: string): Promise<boolean> {
  const pendingToken = window.__sudoPendingToken;
  if (!pendingToken) return false;
  const res = await fetch("/api/auth/sudo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pendingToken, code: code.trim() }),
  });
  if (!res.ok) return false;
  delete window.__sudoPendingToken;
  return true;
}
