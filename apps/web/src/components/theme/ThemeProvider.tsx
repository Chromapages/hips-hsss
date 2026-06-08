"use client";

import * as React from "react";

/**
 * ThemeProvider — three-state theme system: "light" | "dark" | "system".
 *
 * Persists the user preference to localStorage under STORAGE_KEY. When the
 * preference is "system", the resolved theme follows the OS
 * `prefers-color-scheme` media query and updates live if the OS preference
 * changes.
 *
 * The actual data-theme attribute is set on <html> so the rest of the app
 * can react via CSS. The initial resolved value MUST be synced with the
 * inline pre-paint script in app/layout.tsx — otherwise the page would flash
 * the wrong theme on first render.
 */

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";
export const STORAGE_KEY = "hips-theme";

interface ThemeContextValue {
  /** User-stored preference (light / dark / system). */
  theme: Theme;
  /** The actual applied theme after resolving "system" against the OS. */
  resolvedTheme: ResolvedTheme;
  /** Sets the user preference; persists to localStorage. */
  setTheme: (t: Theme) => void;
  /** Cycles light → dark → system → light. */
  toggle: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function readInitialResolved(): ResolvedTheme {
  if (typeof document === "undefined") return "light";
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "dark" ? "dark" : "light";
}

function readInitialPreference(): Theme {
  if (typeof window === "undefined") return "system";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // localStorage may be disabled — fall through
  }
  return "system";
}

function resolveTheme(t: Theme): ResolvedTheme {
  if (t === "light" || t === "dark") return t;
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
}

function applyTheme(resolved: ResolvedTheme) {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", resolved);
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initial resolved value MUST come from the pre-paint script so first
  // render matches the painted DOM (no flicker). The user preference
  // (light/dark/system) is read from localStorage on mount.
  const [theme, setThemeState] = React.useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>(
    () => readInitialResolved(),
  );

  // On mount, hydrate the stored preference (if any).
  React.useEffect(() => {
    const stored = readInitialPreference();
    setThemeState(stored);
    // resolvedTheme is already correct from the pre-paint script, but if the
    // user previously chose "system" and the OS preference changed between
    // first paint and mount, we want to pick that up immediately.
    if (stored === "system") {
      const next = resolveTheme("system");
      setResolvedTheme(next);
      applyTheme(next);
    }
  }, []);

  const setTheme = React.useCallback((next: Theme) => {
    setThemeState(next);
    const resolved = resolveTheme(next);
    setResolvedTheme(resolved);
    applyTheme(resolved);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // localStorage may be disabled — silent fallback to in-memory state
      }
    }
  }, []);

  const toggle = React.useCallback(() => {
    setThemeState((current) => {
      // Cycle: light → dark → system → light
      const next: Theme =
        current === "light" ? "dark" : current === "dark" ? "system" : "light";
      const resolved = resolveTheme(next);
      setResolvedTheme(resolved);
      applyTheme(resolved);
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
          /* ignore */
        }
      }
      return next;
    });
  }, []);

  // System preference listener — only meaningful when theme === "system".
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      // Only react if the user is currently on "system" mode.
      setThemeState((current) => {
        if (current === "system") {
          const next: ResolvedTheme = e.matches ? "dark" : "light";
          setResolvedTheme(next);
          applyTheme(next);
        }
        return current;
      });
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Cross-tab sync — if the user changes theme in another tab, follow it.
  React.useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      if (
        e.newValue !== "light" &&
        e.newValue !== "dark" &&
        e.newValue !== "system"
      ) {
        return;
      }
      const next = e.newValue as Theme;
      setThemeState(next);
      const resolved = resolveTheme(next);
      setResolvedTheme(resolved);
      applyTheme(resolved);
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = React.useMemo(
    () => ({ theme, resolvedTheme, setTheme, toggle }),
    [theme, resolvedTheme, setTheme, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return ctx;
}
