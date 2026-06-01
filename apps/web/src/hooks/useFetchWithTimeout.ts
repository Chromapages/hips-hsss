'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type FetchOptions = {
  method?: HttpMethod;
  body?: unknown;
  timeoutMs?: number;
  enabled?: boolean;
};

type FetchState<T> = {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  refetch: () => void;
};

/**
 * Authenticated fetch with a hard timeout and proper cancellation.
 *
 * Replaces the unguarded `useEffect + fetch + try/catch/finally` pattern that
 * was leaving multiple dashboard/admin pages stuck on infinite spinners when
 * the backend hung or the network blackholed. The 10s default timeout caps
 * the worst-case wait, and the AbortController cancels in-flight work on
 * unmount or dep change.
 */
export function useFetchWithTimeout<T = unknown>(
  url: string | null,
  options: FetchOptions = {}
): FetchState<T> {
  const { getToken, loading: authLoading } = useAuth();
  const {
    method = 'GET',
    body,
    timeoutMs = 10_000,
    enabled = true,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!!url && enabled);
  const [reloadKey, setReloadKey] = useState(0);

  // Stable serialization for object-typed bodies so the effect doesn't
  // re-run on every render when callers pass a fresh literal.
  const bodyKey = body !== undefined ? safeStringify(body) : '';

  const refetch = useCallback(() => {
    setReloadKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (!enabled || !url || authLoading) {
      if (!enabled || !url) setIsLoading(false);
      return;
    }

    // Capture narrowed non-null values for use inside the async IIFE closure
    // (TS narrowing is lost across the async boundary).
    const targetUrl = url;
    const targetMethod = method;
    const targetBody = body;

    let cancelled = false;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    setIsLoading(true);
    setError(null);

    (async () => {
      try {
        const token = await getToken();
        if (cancelled) return;
        if (!token) throw new Error('Unauthorized');

        const res = await fetch(targetUrl, {
          method: targetMethod,
          headers: {
            'Authorization': `Bearer ${token}`,
            ...(targetBody !== undefined ? { 'Content-Type': 'application/json' } : {}),
          },
          body: targetBody !== undefined ? JSON.stringify(targetBody) : null,
          signal: controller.signal,
        });
        if (cancelled) return;
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          const err = new Error(
            json.details || json.error || `Request failed (${res.status})`
          ) as Error & { setupUrl?: string };
          err.setupUrl = json.setupUrl;
          throw err;
        }
        const result = (await res.json()) as T;
        if (!cancelled) {
          setData(result);
        }
      } catch (e) {
        if (cancelled) return;
        if (e instanceof Error && e.name === 'AbortError') {
          setError(new Error(`Request timed out after ${timeoutMs}ms. Please refresh.`));
        } else {
          setError(e instanceof Error ? e : new Error(String(e)));
        }
      } finally {
        clearTimeout(timeoutId);
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, method, bodyKey, enabled, authLoading, reloadKey, timeoutMs, getToken]);

  return { data, error, isLoading, refetch };
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value) ?? '';
  } catch {
    return '';
  }
}
