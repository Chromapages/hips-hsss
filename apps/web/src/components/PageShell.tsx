import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  ["Services", "/services"],
  ["Packages", "/packages"],
  ["Scholarship", "/scholarship"],
  ["Donate", "/donate"],
  ["Organizations", "/organizations"],
] as const;

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[var(--color-neutral-50)] text-[var(--color-neutral-900)]">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--color-brand-primary)] focus:px-4 focus:py-3 focus:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
      >
        Skip to content
      </a>
      <header className="border-b border-[var(--color-neutral-200)] bg-white sticky top-0 z-40">
        <nav className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8">
          <Link
            href="/"
            className="text-lg font-semibold text-[var(--color-brand-deep)] hover:opacity-80 transition-opacity"
          >
            H.I.P.S. Foundation
          </Link>
          <div className="flex flex-wrap gap-2 text-sm">
            {navItems.map(([label, href]) => (
              <Link
                className="rounded-md px-3 py-2 text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-brand-primary)] transition-colors"
                href={href}
                key={href}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      </header>
      <div id="content">{children}</div>
    </main>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-brand-secondary)]">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-4xl font-bold leading-tight text-[var(--color-brand-deep)] md:text-5xl">
        {title}
      </h1>
      <p className="mt-4 text-lg leading-8 text-[var(--color-neutral-600)]">
        {body}
      </p>
    </div>
  );
}

export function StatusPanel({ state }: { state: "loading" | "empty" | "error" | "success" | "disabled" }) {
  const content = {
    loading: "Loading state",
    empty: "No sessions yet",
    error: "Something went wrong. Retry",
    success: "Done. Your next step is ready.",
    disabled: "Unavailable until requirements are met",
  }[state];

  return (
    <div
      className={[
        "rounded-md border p-4 text-sm",
        state === "error"
          ? "border-[var(--color-error)] bg-red-50 text-[var(--color-error)]"
          : "",
        state === "success"
          ? "border-[var(--color-success)] bg-emerald-50 text-[var(--color-success)]"
          : "",
        state === "disabled"
          ? "cursor-not-allowed border-[var(--color-neutral-200)] opacity-50"
          : "",
        state === "loading"
          ? "animate-pulse border-[var(--color-neutral-200)] bg-[var(--color-neutral-100)] text-transparent"
          : "",
        state === "empty"
          ? "border-[var(--color-neutral-200)] bg-white text-[var(--color-neutral-600)]"
          : "",
      ].join(" ")}
    >
      {content}
    </div>
  );
}
