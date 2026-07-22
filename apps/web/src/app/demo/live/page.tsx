"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  ChevronRight,
  Fingerprint,
  Loader2,
} from "lucide-react";
import { AvatarCustomizer } from "@/components/session-ui/AvatarCustomizer";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

type DemoAvatarConfig = {
  avatarColor: string;
  avatarStyle: string | number;
  bodyType?: number;
  skinTone: string;
  hairStyle: string | number;
  hairColor: string;
  backgroundColor?: string;
  eyeColor?: string;
  faceShape?: number;
  noseStyle?: number;
  eyeStyle: string | number;
  eyebrowStyle: string | number;
  mouthStyle: string | number;
  clothingType: string | number;
  clothingColor: string;
  accessoryType: string | number;
  avatar2D?: unknown;
  emotion?: string;
  voicePreset?: string;
  semitones?: number;
  reverbLevel?: string;
  anonymizationMode?: string;
  selectedPersona?: string;
  isAntiCadenceEnabled?: boolean;
  isEnhancedNeuralConsentAccepted?: boolean;
  baseForm?: "man" | "woman" | null;
};

export default function LiveDemoPage() {
  const [config, setConfig] = useState<DemoAvatarConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [sessionToken, setSessionToken] = useState("anon_••••");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const configStr = sessionStorage.getItem("hips-demo-config");
      if (configStr) {
        try {
          setConfig(JSON.parse(configStr) as DemoAvatarConfig);
        } catch (err) {
          console.warn("Failed to parse avatar config:", err);
        }
      }
      setHydrated(true);
      const tokenBytes = new Uint8Array(3);
      crypto.getRandomValues(tokenBytes);
      const suffix = Array.from(tokenBytes, (value) => value.toString(36).padStart(2, "0")).join("").slice(0, 4).toUpperCase();
      setSessionToken(`anon_${suffix}`);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleSave = async (updatedConfig: DemoAvatarConfig) => {
    setSaving(true);
    // Simulate verification delay for premium feel
    await new Promise((r) => setTimeout(r, 600));
    setConfig(updatedConfig);
    setSaving(false);

    // Persist to session storage so it carries over to test-session if they join
    sessionStorage.setItem("hips-avatar-color", updatedConfig.avatarColor);
    sessionStorage.setItem("hips-avatar-style", String(updatedConfig.avatarStyle));
    sessionStorage.setItem("hips-avatar-body", String(updatedConfig.bodyType ?? 1));
    sessionStorage.setItem("hips-avatar-base-form", updatedConfig.baseForm || "");
    sessionStorage.setItem("hips-avatar-skin-tone", updatedConfig.skinTone);
    sessionStorage.setItem("hips-avatar-hair", String(updatedConfig.hairStyle));
    sessionStorage.setItem("hips-avatar-hair-color", updatedConfig.hairColor);
    sessionStorage.setItem("hips-avatar-background", updatedConfig.backgroundColor || "#eef0ff");
    sessionStorage.setItem("hips-avatar-eye-color", updatedConfig.eyeColor || "#1c1917");
    sessionStorage.setItem("hips-avatar-face-shape", String(updatedConfig.faceShape ?? 0));
    sessionStorage.setItem("hips-avatar-nose", String(updatedConfig.noseStyle ?? 0));
    sessionStorage.setItem("hips-avatar-eye", String(updatedConfig.eyeStyle));
    sessionStorage.setItem("hips-avatar-eyebrow", String(updatedConfig.eyebrowStyle));
    sessionStorage.setItem("hips-avatar-mouth", String(updatedConfig.mouthStyle));
    sessionStorage.setItem("hips-avatar-clothing", String(updatedConfig.clothingType));
    sessionStorage.setItem("hips-avatar-clothing-color", updatedConfig.clothingColor);
    sessionStorage.setItem("hips-avatar-accessory", String(updatedConfig.accessoryType));
    sessionStorage.setItem("hips-avatar-render-mode", "2d");
    if (updatedConfig.avatar2D) {
      sessionStorage.setItem("hips-avatar-2d", JSON.stringify(updatedConfig.avatar2D));
    }
    sessionStorage.setItem("hips-avatar-emotion", updatedConfig.emotion || "neutral");
    sessionStorage.setItem("hips-voice-preset", updatedConfig.voicePreset || "subtle");
    sessionStorage.setItem("hips-voice-semitones", String(updatedConfig.semitones ?? -2));
    sessionStorage.setItem("hips-voice-reverb", updatedConfig.reverbLevel || "medium");
    sessionStorage.setItem("hips-voice-anonymization", updatedConfig.anonymizationMode || "dsp");
    sessionStorage.setItem("hips-voice-persona", updatedConfig.selectedPersona || "clara");
    sessionStorage.setItem("hips-voice-anticadence", String(updatedConfig.isAntiCadenceEnabled));
    sessionStorage.setItem("hips-voice-enhanced-neural-consent", String(updatedConfig.isEnhancedNeuralConsentAccepted));

    sessionStorage.setItem("hips-demo-config", JSON.stringify(updatedConfig));
  };

  return (
    <main id="main" tabIndex={-1} className="min-h-screen bg-bg text-text-primary">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-white focus:font-bold"
      >
        Skip to main content
      </a>

      {/* ── Minimal nav bar ── */}
      <nav className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <Link
            href="/demo"
            className="flex items-center gap-2 text-xs text-text-muted hover:text-text-secondary font-ui uppercase tracking-wider transition-colors"
            aria-label="Back to demo overview"
          >
            ← Overview
          </Link>
          <div className="h-4 w-px bg-border mx-1" aria-hidden="true" />
          <div className="h-7 w-7 rounded-lg bg-indigo-500/15 ring-1 ring-indigo-500/40 flex items-center justify-center">
            <Shield className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <span className="font-bold text-sm tracking-widest uppercase text-text-primary font-ui">
            H.I.P.S.
          </span>
          <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
            Live Demo
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/demo/crisis"
            className="hidden items-center gap-1.5 rounded-xl border border-border bg-bg-subtle px-4 py-2 text-xs font-bold uppercase tracking-wider text-text-secondary transition-all hover:bg-surface-offset sm:flex"
          >
            Crisis Safety →
          </Link>
          <Link
            href="/book"
            className="flex items-center gap-1.5 rounded-xl bg-accent px-3 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-accent-dark shadow-lg shadow-amber-500/20 sm:px-4"
            aria-label="Book a real session"
          >
            Book a Session
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
          <ThemeToggle className="text-text-secondary hover:text-text-primary" />
        </div>
      </nav>

      <details id="privacy-data" onKeyDown={(event) => { if (event.key === "Escape") event.currentTarget.removeAttribute("open"); }} className="group fixed bottom-20 right-3 z-50 w-auto max-w-sm rounded-2xl border border-indigo-500/40 bg-bg/95 shadow-2xl backdrop-blur [&[open]]:w-[calc(100%-1.5rem)] sm:bottom-6 sm:right-6 sm:[&[open]]:w-full">
        <summary className="flex min-h-[48px] cursor-pointer list-none items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 [&::-webkit-details-marker]:hidden">
          <Shield className="h-4 w-4 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
          Privacy &amp; Data
          <span className="ml-auto text-xs font-normal text-text-muted group-open:hidden">Open</span>
          <span className="ml-auto hidden text-xs font-normal text-text-muted group-open:inline">Close</span>
        </summary>
        <div className="border-t border-border px-4 pb-4 pt-3 text-xs leading-5 text-text-secondary">
          <p className="font-semibold text-text-primary">No photo, camera, or face scan is used. Avatar choices change style, never identity.</p>
          <ul className="mt-3 space-y-2">
            <li><strong className="text-text-primary">Microphone:</strong> processed locally while the voice test is active.</li>
            <li><strong className="text-text-primary">Comparison clips:</strong> held temporarily in this tab&apos;s memory; never uploaded.</li>
            <li><strong className="text-text-primary">Demo setup:</strong> stored only in this tab&apos;s session storage.</li>
            <li><strong className="text-text-primary">Biometrics:</strong> no facial or voice identity model is created.</li>
          </ul>
        </div>
      </details>

      {/* ── Hero ── */}
      <section className="mx-auto max-w-7xl px-4 pt-10 pb-6 text-center sm:px-6 sm:pt-12">
        <p className="brand-caps text-[11px] text-indigo-600 dark:text-indigo-400 mb-4">
          Interactive Demonstration
        </p>
        <h1 className="font-heading text-4xl font-bold text-text-primary md:text-5xl lg:text-6xl mb-4">
          Hiding In Plain Sight
        </h1>
        <p className="mx-auto max-w-xl text-base text-text-secondary font-body leading-relaxed">
          Experience the two core privacy technologies that protect every H.I.P.S. session —
          your <strong className="text-text-primary">anonymous avatar</strong> and the browser-based{" "}
          <strong className="text-text-primary">voice masking controls</strong> — live, right here in your browser.
        </p>
        <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-xs text-indigo-700 dark:text-indigo-200" aria-label={`Temporary in-memory demo token ${sessionToken}`}>
          <Fingerprint className="h-3.5 w-3.5" aria-hidden="true" />
          Temporary demo token <span className="font-mono font-bold tracking-wider">{sessionToken}</span>
        </div>
      </section>

      {/* ── Interactive Customizer Section ── */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {hydrated ? (
          <div className="rounded-3xl border border-border bg-surface-offset dark:bg-zinc-950 p-1">
            <AvatarCustomizer
              initialConfig={config || undefined}
              onSave={handleSave}
              showVoice={true}
              saving={saving}
            />
          </div>
        ) : (
          <div className="flex h-[500px] w-full items-center justify-center bg-surface-offset dark:bg-zinc-950 rounded-3xl border border-border">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        )}
      </section>

      {/* ── Next action ── */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-2xl border border-amber-500/30 dark:border-amber-500/25 bg-gradient-to-br from-amber-500/10 to-amber-600/10 dark:from-amber-500/5 dark:to-amber-600/5 overflow-hidden">
          <div className="p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 brand-caps">Next step</p>
            <h2 className="mt-1 font-heading text-xl font-semibold text-text-primary">Bring your protected setup into a guided session</h2>
            <p className="mb-5 mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">Book a session with a trained facilitator, or preview the board guide before you decide.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/book"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white uppercase tracking-wider font-ui hover:bg-accent-dark transition-all shadow-lg shadow-amber-500/20"
              >
                Book a Real Session →
              </Link>
              <Link
                href="/board-demo"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-bg-subtle px-4 py-3 text-sm font-bold text-text-secondary uppercase tracking-wider font-ui hover:bg-surface-offset transition-all"
              >
                Preview the Board Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
