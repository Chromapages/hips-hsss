import * as React from "react";
import { cn } from "@/lib/utils";

interface NotFoundShellProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function NotFoundShell({
  title,
  description,
  icon,
  children,
  className,
}: NotFoundShellProps) {
  const defaultIcon = (
    <svg
      className="h-12 w-12"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
      />
    </svg>
  );

  return (
    <main
      id="main"
      tabIndex={-1}
      className="grid min-h-screen place-items-center bg-black p-6 text-white"
    >
      <div
        className={cn(
          "flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in-95 duration-500 bg-surface/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl max-w-lg mx-auto shadow-2xl shadow-black/50",
          className
        )}
      >
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-text mb-6 ring-1 ring-primary/20 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
          {icon || defaultIcon}
        </div>
        <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
        <p className="mt-4 text-text leading-relaxed">{description}</p>
        {children && <div className="mt-8 flex gap-3">{children}</div>}
      </div>
    </main>
  );
}
