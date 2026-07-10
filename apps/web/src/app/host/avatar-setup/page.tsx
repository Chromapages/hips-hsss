"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AvatarCustomizer } from "@/components/session-ui/AvatarCustomizer";

export default function AvatarSetupPage() {
  const [config, setConfig] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const configStr = localStorage.getItem("hips-host-avatar");
    if (configStr) {
      try {
        setConfig(JSON.parse(configStr));
      } catch (err) {
        console.warn("Failed to parse host avatar config:", err);
      }
    }
    setHydrated(true);
  }, []);

  const handleSave = async (updatedConfig: any) => {
    setSaving(true);
    // Persist to localStorage
    localStorage.setItem("hips-host-avatar", JSON.stringify(updatedConfig));
    // Simulate API delay for premium feel
    await new Promise((r) => setTimeout(r, 600));
    setConfig(updatedConfig);
    setSaving(false);
    toast.success("Avatar and voice configuration updated successfully.");
  };

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* ── Breadcrumb ── */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-xs text-text-muted font-ui">
          <li>
            <Link href="/host/dashboard" className="hover:text-text transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              Dashboard
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li className="font-bold text-text">Avatar &amp; Voice Setup</li>
        </ol>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-text mb-2">
            Avatar &amp; Voice Setup
          </h1>
          <p className="text-text-muted font-body">
            Personalise your host presence. Your avatar and voice settings apply to all sessions on this device.
          </p>
        </div>

        {/* Test your setup */}
        <div className="shrink-0">
          <Link
            href="/host/practice"
            aria-label="Test your avatar and voice in a practice session"
            className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-primary/10 border border-primary/20 text-text text-xs font-bold uppercase tracking-wider font-ui hover:bg-primary hover:text-white transition-all duration-200"
          >
            <Play className="w-4 h-4" aria-hidden="true" />
            Test Your Setup
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-white/5 bg-zinc-900/10 p-1">
        <AvatarCustomizer
          initialConfig={config || undefined}
          onSave={handleSave}
          showVoice={true}
          saving={saving}
        />
      </div>
    </div>
  );
}
