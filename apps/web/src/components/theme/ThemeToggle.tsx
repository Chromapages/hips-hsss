"use client";

import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/utils";

/**
 * ThemeToggle — binary light/dark toggle.
 *
 * The icon reflects the CURRENT theme; the button's aria-label describes
 * the ACTION the next click will perform, not the current state. This is
 * the accessible pattern for theme switches — a screen-reader-friendly
 * instruction rather than a debug-style narration of where the toggle is
 * pointing.
 *
 * Accessibility:
 *   - `aria-label` describes the action ("Switch to dark mode" /
 *     "Switch to light mode").
 *   - `aria-pressed` reflects whether dark mode is currently active so
 *     assistive tech can announce the toggle's state.
 *   - The button is keyboard-focusable and shows a focus ring via the
 *     `hips-theme-toggle` class.
 *   - The icon is decorative (`aria-hidden`).
 */
type ThemeToggleProps = {
  className?: string;
  showLabel?: boolean;
  tabIndex?: number;
};

export function ThemeToggle({ className, showLabel = false, tabIndex }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const Icon = isDark ? Moon : Sun;
  const ariaLabel = isDark ? "Switch to light mode" : "Switch to dark mode";
  const tooltip = isDark ? "Light mode" : "Dark mode";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={ariaLabel}
      aria-pressed={isDark}
      tabIndex={tabIndex}
      title={tooltip}
      data-theme-toggle=""
      className={cn("hips-theme-toggle", className)}
    >
      <Icon
        key={theme}
        className="theme-icon-enter h-5 w-5"
        aria-hidden="true"
      />
      {showLabel && <span className="hips-theme-label" aria-hidden="true">{tooltip}</span>}
    </button>
  );
}

export default ThemeToggle;
