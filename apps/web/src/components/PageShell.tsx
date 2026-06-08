import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  ["Services", "/services"],
  ["Packages", "/packages"],
  ["Scholarship", "/scholarship"],
  ["Donate", "/donate"],
  ["Organizations", "/opportunities"],
] as const;

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-surface text-primary">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-3 focus:text-white focus:outline-none focus:ring-2 focus:ring-primary"
      >
        Skip to content
      </a>
      <header className="border-b border-border bg-surface sticky top-0 z-40">
        <nav className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8">
          <Link
            href="/"
            className="text-lg font-semibold text-primary hover:opacity-80 transition-opacity font-heading"
          >
            H.I.P.S. Foundation
          </Link>
          <div className="flex flex-wrap gap-2 text-sm font-ui uppercase tracking-wide">
            {navItems.map(([label, href]) => (
              <Link
                className="rounded-md px-3 py-2 text-secondary hover:bg-surface hover:text-primary transition-colors"
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
      {/* Section label - gold uppercase with tracking */}
      <p className="text-sm font-semibold uppercase tracking-wide text-accent brand-caps">
        {eyebrow}
      </p>
      {/* H1 - ceremonial serif heading */}
      <h1 className="mt-3 font-heading text-4xl font-bold leading-tight text-primary md:text-5xl">
        {title}
      </h1>
      {/* Body text */}
      <p className="mt-4 text-lg leading-8 text-secondary font-body">
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
        "rounded-md border p-4 text-sm font-body",
        state === "error"
          ? "border-destructive bg-destructive text-destructive"
          : "",
        state === "success"
          ? "border-success bg-emerald-50 text-success"
          : "",
        state === "disabled"
          ? "cursor-not-allowed border-border opacity-50"
          : "",
        state === "loading"
          ? "animate-pulse border-border bg-surface text-transparent"
          : "",
        state === "empty"
          ? "border-border bg-surface text-secondary"
          : "",
      ].join(" ")}
    >
      {content}
    </div>
  );
}
