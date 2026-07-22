"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Loader2, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AvatarCustomizer } from "@/components/session-ui/AvatarCustomizer";
import {
  deleteSessionPersona,
  readSessionPersona,
  saveSessionPersona,
} from "@/lib/protected-persona-storage";

export default function AvatarSetupPage() {
  const [config, setConfig] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const configStr = readSessionPersona();
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
    saveSessionPersona(updatedConfig);
    // Simulate API delay for premium feel
    await new Promise((r) => setTimeout(r, 600));
    setConfig(updatedConfig);
    setSaving(false);
    toast.success("Protected persona saved for this tab only.");
  };

  const handleDeletePersona = () => {
    deleteSessionPersona();
    setConfig(null);
    toast.success("Persona data deleted from this browser session.");
  };

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-accent motion-reduce:animate-none" />
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
            Personalise your protected presence using this tab&apos;s temporary session storage.
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

      <section
        aria-labelledby="persona-storage-title"
        className="mb-8 flex flex-col gap-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex min-w-0 items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />
          <div>
            <h2 id="persona-storage-title" className="text-sm font-bold text-text">
              Session-only persona
            </h2>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-text-muted">
              Saved avatar and voice settings use temporary storage for this tab. They are not designed for cross-session persistence, uploaded for storage, or linked to your account.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDeletePersona}
          disabled={!config}
          className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-red-400/30 px-4 text-xs font-bold text-red-300 transition-colors hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Delete this session&apos;s persona
        </button>
      </section>

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
