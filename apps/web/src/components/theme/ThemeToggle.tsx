"use client";

import * as React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme, type Theme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/utils";

/**
 * ThemeToggle — three-state icon button that cycles
 *   light → dark → system → light
 *
 * The icon for the current state is shown; the next click advances the
 * cycle. The icon element is keyed on the current `theme` value so it
 * remounts on each transition and triggers the `.theme-icon-enter`
 * keyframe defined in globals.css.
 *
 * Accessibility:
 *   - `aria-label` describes the CURRENT state and what the next click does.
 *   - The button is keyboard-focusable and shows a focus ring via the
 *     `hips-theme-toggle` class.
 *   - The icon is decorative (`aria-hidden`).
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  function cycle() {
    setTheme(theme === "light" ? "dark" : theme === "dark" ? "system" : "light");
  }

  const { Icon, label, nextLabel } = (() => {
    if (theme === "light") {
      return { Icon: Sun, label: "Light mode", nextLabel: "dark" as const };
    }
    if (theme === "dark") {
      return { Icon: Moon, label: "Dark mode", nextLabel: "system" as const };
    }
    return { Icon: Monitor, label: "System theme", nextLabel: "light" as const };
  })();

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Theme: ${label} (click to switch to ${nextLabel})`}
      title={label}
      data-theme-toggle=""
      className={cn("hips-theme-toggle", className)}
    >
      <Icon
        key={theme as Theme}
        className="theme-icon-enter h-5 w-5"
        aria-hidden="true"
      />
    </button>
  );
}

export default ThemeToggle;
