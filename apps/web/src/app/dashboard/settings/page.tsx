"use client";

import * as React from "react";
import { Sun, Moon, Monitor, Palette } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTheme, type Theme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/utils";

/**
 * Settings — dashboard page.
 *
 * Currently ships with the Appearance section (three-state theme picker)
 * that drives the global <ThemeProvider />. Other sections will be added
 * as the platform grows (profile, notifications, privacy, sessions).
 */

interface ThemeOption {
  value: Theme;
  id: string;
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  description: string;
}

const themeOptions: ReadonlyArray<ThemeOption> = [
  {
    value: "light",
    id: "theme-light",
    Icon: Sun,
    title: "Light",
    description: "Bright, daytime interface",
  },
  {
    value: "dark",
    id: "theme-dark",
    Icon: Moon,
    title: "Dark",
    description: "Easier on the eyes at night",
  },
  {
    value: "system",
    id: "theme-system",
    Icon: Monitor,
    title: "System",
    description: "Follow your OS preference",
  },
];

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-text">Settings</h1>
        <p className="text-sm text-text-muted">
          Manage your account preferences and how H.I.P.S. Foundation looks for you.
        </p>
      </header>

      <Separator />

      {/* ----------------------------------------------------------------
          Appearance — three-state theme picker
          ---------------------------------------------------------------- */}
      <section aria-labelledby="appearance-heading" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary"
              >
                <Palette className="h-5 w-5" />
              </span>
              <div>
                <CardTitle id="appearance-heading">Appearance</CardTitle>
                <CardDescription>
                  Choose how H.I.P.S. Foundation looks for you. Currently
                  displaying the <strong>{resolvedTheme}</strong> theme
                  {theme === "system" ? " (following your OS preference)" : ""}.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={theme}
              onValueChange={(v) => setTheme(v as Theme)}
              aria-label="Theme preference"
              className="grid gap-3 sm:grid-cols-3"
            >
              {themeOptions.map(({ value, id, Icon, title, description }) => {
                const selected = theme === value;
                return (
                  <Label
                    key={value}
                    htmlFor={id}
                    className={cn(
                      "group relative flex cursor-pointer flex-col gap-3 rounded-lg border p-4 transition-colors",
                      "bg-surface",
                      "border-border hover:bg-surface-offset hover:border-primary/40",
                      "has-[[data-state=checked]]:border-primary",
                      "has-[[data-state=checked]]:bg-primary/5",
                      "has-[[data-state=checked]]:ring-2 has-[[data-state=checked]]:ring-primary/30",
                      "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-bg",
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <Icon
                        className={cn(
                          "h-5 w-5 transition-colors",
                          selected ? "text-primary" : "text-text-muted group-hover:text-text",
                        )}
                        aria-hidden={true}
                      />
                      <RadioGroupItem value={value} id={id} />
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium leading-none text-text">{title}</div>
                      <p className="text-sm text-text-muted">{description}</p>
                    </div>
                  </Label>
                );
              })}
            </RadioGroup>
            <p className="mt-4 text-xs text-text-muted">
              The choice applies to this device and is remembered across sessions. The
              <strong> System </strong>
              option automatically follows your operating system&apos;s light/dark setting
              and updates in real time when you change it at the OS level.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
