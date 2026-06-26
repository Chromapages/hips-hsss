"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  ChevronRight,
  ArrowRight,
  Check,
  Mic,
  EyeOff,
  ScanFace,
  Fingerprint,
  Camera,
  Slash,
  Volume2,
  Loader2,
} from "lucide-react";
import { AvatarCustomizer } from "@/components/session-ui/AvatarCustomizer";

export default function LiveDemoPage() {
  const [config, setConfig] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const configStr = localStorage.getItem("hips-host-avatar") || sessionStorage.getItem("hips-avatar-color");
    if (configStr) {
      try {
        const hostConfig = localStorage.getItem("hips-host-avatar");
        if (hostConfig) {
          setConfig(JSON.parse(hostConfig));
        }
      } catch (err) {
        console.warn("Failed to parse avatar config:", err);
      }
    }
    setHydrated(true);
  }, []);

  const handleSave = async (updatedConfig: any) => {
    setSaving(true);
    // Simulate verification delay for premium feel
    await new Promise((r) => setTimeout(r, 600));
    setConfig(updatedConfig);
    setSaving(false);

    // Persist to session storage so it carries over to test-session if they join
    sessionStorage.setItem("hips-avatar-color", updatedConfig.avatarColor);
    sessionStorage.setItem("hips-avatar-style", String(updatedConfig.avatarStyle));
    sessionStorage.setItem("hips-avatar-body", String(updatedConfig.bodyType ?? 1));
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

    localStorage.setItem("hips-host-avatar", JSON.stringify(updatedConfig));
  };

  return (
    <main id="main" tabIndex={-1} className="min-h-screen bg-[#030712] text-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-white focus:font-bold"
      >
        Skip to main content
      </a>

      {/* ── Minimal nav bar ── */}
      <nav className="flex items-center justify-between border-b border-white/8 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <Link
            href="/demo"
            className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 font-ui uppercase tracking-wider transition-colors"
            aria-label="Back to demo overview"
          >
            ← Overview
          </Link>
          <div className="h-4 w-px bg-white/10 mx-1" aria-hidden="true" />
          <div className="h-7 w-7 rounded-lg bg-indigo-500/20 ring-1 ring-indigo-500/40 flex items-center justify-center">
            <Shield className="h-4 w-4 text-indigo-400" />
          </div>
          <span className="font-bold text-sm tracking-widest uppercase text-white/80 font-ui">
            H.I.P.S.
          </span>
          <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-300 border border-indigo-500/20">
            Live Demo
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/demo/crisis"
            className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/70 transition-all hover:bg-white/10"
          >
            Crisis Safety →
          </Link>
          <Link
            href="/book"
            className="flex items-center gap-1.5 rounded-xl bg-[#C59A35] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#A67F28] shadow-lg shadow-amber-500/20"
            aria-label="Book a real session"
          >
            Book a Session
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-6 text-center">
        <p className="brand-caps text-[11px] text-indigo-400 mb-4">
          Interactive Demonstration
        </p>
        <h1 className="font-heading text-4xl font-bold text-white md:text-5xl lg:text-6xl mb-4">
          Hiding In Plain Sight
        </h1>
        <p className="mx-auto max-w-xl text-base text-white/55 font-body leading-relaxed">
          Experience the two core privacy technologies that protect every H.I.P.S. session —
          your <strong className="text-white/80">anonymous avatar</strong> and the browser-based{" "}
          <strong className="text-white/80">voice masking controls</strong> — live, right here in your browser.
        </p>
      </section>

      {/* ── Interactive Customizer Section ── */}
      <section className="mx-auto max-w-7xl px-6 py-6">
        {hydrated ? (
          <div className="rounded-3xl border border-white/5 bg-zinc-950 p-1">
            <AvatarCustomizer
              initialConfig={config || undefined}
              onSave={handleSave}
              showVoice={true}
              saving={saving}
            />
          </div>
        ) : (
          <div className="flex h-[500px] w-full items-center justify-center bg-zinc-950 rounded-3xl border border-white/5">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        )}
      </section>

      {/* ── Privacy comparison panel ── */}
      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 font-ui">
              What H.I.P.S. never stores — even during this demo
            </p>
          </div>
          <div className="grid md:grid-cols-3 divide-x divide-white/8">
            {/* Column 1 — What your mic captures */}
            <div className="p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 font-ui mb-3">
                Your mic captures
              </p>
              <ul className="space-y-2.5" role="list">
                {[
                  { icon: <Mic className="h-4 w-4" />, label: "Audio waveform" },
                  { icon: <Volume2 className="h-4 w-4" />, label: "Voice amplitude" },
                  { icon: <Fingerprint className="h-4 w-4" />, label: "Vocal pitch contour" },
                ].map((item) => (
                  <li key={item.label} className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-400">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{item.label}</p>
                      <p className="text-[10px] text-emerald-400/70">Used for local processing only</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2 — What H.I.P.S. extracts (and protects) */}
            <div className="p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 font-ui mb-3">
                H.I.P.S. extracts — and discards
              </p>
              <ul className="space-y-2.5" role="list">
                {[
                  { icon: <ScanFace className="h-4 w-4" />, label: "Facial structure" },
                  { icon: <EyeOff className="h-4 w-4" />, label: "Camera feed" },
                  { icon: <Fingerprint className="h-4 w-4" />, label: "Voice biometric ID" },
                  { icon: <Camera className="h-4 w-4" />, label: "Screen / environment" },
                ].map((item) => (
                  <li key={item.label} className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-rose-500/15 text-rose-450">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{item.label}</p>
                      <p className="text-[10px] text-rose-400/70">Never collected — no camera access</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 — Session isolation guarantee */}
            <div className="p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 font-ui mb-3">
                Session isolation
              </p>
              <ul className="space-y-2.5" role="list">
                {[
                  { icon: <Slash className="h-4 w-4" />, label: "Billing identity", detail: "Isolated from session token" },
                  { icon: <EyeOff className="h-4 w-4" />, label: "Real name", detail: "Never enters session DB" },
                  { icon: <ScanFace className="h-4 w-4" />, label: "Facial data", detail: "Zero biometric storage" },
                  { icon: <Shield className="h-4 w-4" />, label: "Session token", detail: "Random per session, e.g. anon_4KQ9" },
                ].map((item) => (
                  <li key={item.label} className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-500/15 text-indigo-400">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{item.label}</p>
                      <p className="text-[10px] text-indigo-300/60">{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom reassurance strip */}
          <div className="px-6 py-3 bg-emerald-500/5 border-t border-emerald-500/15 flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" aria-hidden="true" />
            <p className="text-xs text-emerald-300/80 font-body">
              All audio processing happens locally in your browser. No audio data is transmitted, stored, or accessible to H.I.P.S. staff.
            </p>
          </div>
        </div>
      </section>

      {/* ── Next step narrative card ── */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-500/5 to-amber-600/5 overflow-hidden">
          <div className="px-6 py-5 border-b border-amber-500/15">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400 brand-caps">
              You just experienced
            </p>
            <h2 className="font-heading text-lg font-semibold text-white mt-1">
              Anonymous avatars + local Effects Mode voice processing
            </h2>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6 mb-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                  <Shield className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Your avatar is anonymous</p>
                  <p className="text-xs text-white/45 font-body mt-0.5">
                    Generated from a random token per session — no camera, no facial recognition, no biometric data.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
                  <Mic className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Your voice is processed locally</p>
                  <p className="text-xs text-white/45 font-body mt-0.5">
                    Pitch-shifted in real time via AudioWorklet. This is the available browser fallback, not full neural voice replacement.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-white/50 font-body mb-5 leading-relaxed">
              The avatar system is live today, and Effects Mode is the current local audio fallback.
              Enhanced Neural voice replacement is a separate backend path that stays locked until returned audio is ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/board-demo"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C59A35] px-6 py-3 text-sm font-bold text-white uppercase tracking-wider font-ui hover:bg-[#A67F28] transition-all shadow-lg shadow-amber-500/20"
              >
                Continue to Board Guide →
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-white/60 uppercase tracking-wider font-ui hover:bg-white/10 transition-all"
              >
                ← Back to overview
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA strip ── */}
      <footer className="border-t border-white/8 px-6 py-10">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-bold text-white text-lg">Ready to experience it in a real session?</p>
            <p className="text-white/45 text-sm font-body mt-1">
              Live sessions connect you with a trained facilitator — fully anonymous, fully protected.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              href="/contact"
              aria-label="Contact us with questions"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white/70 font-ui hover:bg-white/10 transition-all"
            >
              Questions? Contact Us
            </Link>
            <Link
              href="/book"
              aria-label="Book a real H.I.P.S. session"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#C59A35] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white font-ui hover:bg-[#A67F28] transition-all shadow-lg shadow-amber-500/20"
            >
              Book a Session
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
