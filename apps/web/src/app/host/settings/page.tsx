"use client";

import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";

export default function HostSettingsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-xs text-text-muted font-ui">
          <li>
            <Link href="/host/dashboard" className="hover:text-text transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              Dashboard
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li className="font-bold text-text">Settings</li>
        </ol>
      </nav>

      <h1 className="font-heading text-3xl font-bold text-text mb-8 flex items-center gap-3">
        <Settings className="w-7 h-7 text-accent" aria-hidden="true" />
        Host Settings
      </h1>

      <div className="rounded-2xl border border-dashed border-border bg-surface p-12 flex flex-col items-center justify-center text-center">
        <Settings className="w-10 h-10 text-text-muted mb-4" aria-hidden="true" />
        <p className="font-bold text-text text-sm">Settings — Coming in V2</p>
        <p className="text-xs text-text-muted mt-2 font-body max-w-xs">
          Notification preferences, availability schedule, and account management will be available here.
        </p>
      </div>
    </div>
  );
}
