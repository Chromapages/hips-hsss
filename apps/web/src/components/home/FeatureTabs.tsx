'use client';

import React, { useState } from 'react';
import { Lock, EyeOff, Shield, Key, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function FeatureTabs() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % 4;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + 4) % 4;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = 3;
    } else {
      return;
    }
    e.preventDefault();
    setActiveIndex(nextIndex);
    const nextTab = document.getElementById(`tab-${nextIndex}`);
    if (nextTab) {
      nextTab.focus();
    }
  };

  return (
    <div className="space-y-12">
      {/* Tab Strip */}
      <div role="tablist" aria-label="Feature categories" aria-orientation="horizontal" className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Tab 0 — Identity Vault */}
        <button
          id="tab-0"
          role="tab"
          aria-selected={activeIndex === 0}
          aria-controls="panel-0"
          tabIndex={activeIndex === 0 ? 0 : -1}
          onClick={() => setActiveIndex(0)}
          onKeyDown={(e) => handleKeyDown(e, 0)}
          className={`relative flex flex-col items-start gap-2 rounded-xl p-5 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
            activeIndex === 0
              ? "bg-accent/10 border border-accent/30 shadow-sm"
              : "bg-surface border border-border hover:bg-muted"
          }`}
        >
          {activeIndex === 0 && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-accent rounded-t-xl" />
          )}
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Lock className="w-4 h-4 text-accent" />
          </div>
          <span className="text-base font-bold text-primary font-heading leading-tight">Identity Vault</span>
          <span className="text-sm text-muted-foreground font-body leading-snug">Isolated, encrypted PII storage — zero trace</span>
        </button>

        {/* Tab 1 — Avatar Privacy */}
        <button
          id="tab-1"
          role="tab"
          aria-selected={activeIndex === 1}
          aria-controls="panel-1"
          tabIndex={activeIndex === 1 ? 0 : -1}
          onClick={() => setActiveIndex(1)}
          onKeyDown={(e) => handleKeyDown(e, 1)}
          className={`relative flex flex-col items-start gap-2 rounded-xl p-5 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
            activeIndex === 1
              ? "bg-accent/10 border border-accent/30 shadow-sm"
              : "bg-surface border border-border hover:bg-muted"
          }`}
        >
          {activeIndex === 1 && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-accent rounded-t-xl" />
          )}
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <EyeOff className="w-4 h-4 text-accent" />
          </div>
          <span className="text-base font-bold text-primary font-heading leading-tight">Avatar Privacy</span>
          <span className="text-sm text-muted-foreground font-body leading-snug">No cameras. Curated 3D avatars only.</span>
        </button>

        {/* Tab 2 — Safety Engine */}
        <button
          id="tab-2"
          role="tab"
          aria-selected={activeIndex === 2}
          aria-controls="panel-2"
          tabIndex={activeIndex === 2 ? 0 : -1}
          onClick={() => setActiveIndex(2)}
          onKeyDown={(e) => handleKeyDown(e, 2)}
          className={`relative flex flex-col items-start gap-2 rounded-xl p-5 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
            activeIndex === 2
              ? "bg-accent/10 border border-accent/30 shadow-sm"
              : "bg-surface border border-border hover:bg-muted"
          }`}
        >
          {activeIndex === 2 && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-accent rounded-t-xl" />
          )}
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Shield className="w-4 h-4 text-accent" />
          </div>
          <span className="text-base font-bold text-primary font-heading leading-tight">Safety Engine</span>
          <span className="text-sm text-muted-foreground font-body leading-snug">Human-in-the-loop monitoring, zero identity exposure</span>
        </button>

        {/* Tab 3 — Session Token */}
        <button
          id="tab-3"
          role="tab"
          aria-selected={activeIndex === 3}
          aria-controls="panel-3"
          tabIndex={activeIndex === 3 ? 0 : -1}
          onClick={() => setActiveIndex(3)}
          onKeyDown={(e) => handleKeyDown(e, 3)}
          className={`relative flex flex-col items-start gap-2 rounded-xl p-5 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
            activeIndex === 3
              ? "bg-accent/10 border border-accent/30 shadow-sm"
              : "bg-surface border border-border hover:bg-muted"
          }`}
        >
          {activeIndex === 3 && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-accent rounded-t-xl" />
          )}
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Key className="w-4 h-4 text-accent" />
          </div>
          <span className="text-base font-bold text-primary font-heading leading-tight">Hard Anonymity</span>
          <span className="text-sm text-muted-foreground font-body leading-snug">Cryptographically enforced session tokens</span>
        </button>
      </div>

      {/* Two-Column Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 lg:gap-12 items-start">
        {/* Left: Accordion Column */}
        <div className="flex flex-col gap-3">
          {/* Accordion Item 0 */}
          <div
            className={`rounded-xl border transition-all duration-200 ${
              activeIndex === 0
                ? "bg-surface border-primary/30 shadow-md"
                : "bg-surface border-border hover:border-primary/20"
            }`}
          >
            <button
              onClick={() => setActiveIndex(0)}
              className="flex items-center justify-between w-full px-6 py-5 text-left focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
              aria-expanded={activeIndex === 0}
              aria-controls="panel-0"
              id="accordion-tab-0"
            >
              <span className="text-sm font-bold text-primary font-heading">Identity Vault</span>
              <ChevronRight className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${activeIndex === 0 ? "rotate-90" : ""}`} />
            </button>
            <div
              id="panel-0"
              role="region"
              aria-labelledby="accordion-tab-0"
              className={`overflow-hidden transition-all duration-300 ${activeIndex === 0 ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
            >
              <div className="px-6 pb-6">
                <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4">
                  Your PII is stored in an isolated, encrypted vault that never touches session servers. No email, no name, no trace — ever. The architecture was designed by security engineers who understand that protection requires isolation, not just obfuscation.
                </p>
                <Button variant="ghost" asChild className="h-9 px-5 rounded-lg border border-primary/40 text-primary hover:bg-primary hover:text-white text-xs font-bold transition-all duration-200">
                  <Link href="/features#identity-vault">
                    Learn more
                    <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Accordion Item 1 */}
          <div
            className={`rounded-xl border transition-all duration-200 ${
              activeIndex === 1
                ? "bg-surface border-primary/30 shadow-md"
                : "bg-surface border-border hover:border-primary/20"
            }`}
          >
            <button
              onClick={() => setActiveIndex(1)}
              className="flex items-center justify-between w-full px-6 py-5 text-left focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
              aria-expanded={activeIndex === 1}
              aria-controls="panel-1"
              id="accordion-tab-1"
            >
              <span className="text-sm font-bold text-primary font-heading">Avatar Privacy</span>
              <ChevronRight className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${activeIndex === 1 ? "rotate-90" : ""}`} />
            </button>
            <div
              id="panel-1"
              role="region"
              aria-labelledby="accordion-tab-1"
              className={`overflow-hidden transition-all duration-300 ${activeIndex === 1 ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
            >
              <div className="px-6 pb-6">
                <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4">
                  No cameras. You are represented by a curated 3D abstract avatar that protects your visual identity completely. Choose from a library of non-identifiable personas, each designed to express emotion without revealing anything about your real appearance.
                </p>
                <Button variant="ghost" asChild className="h-9 px-5 rounded-lg border border-primary/40 text-primary hover:bg-primary hover:text-white text-xs font-bold transition-all duration-200">
                  <Link href="/features#avatar-native">
                    Learn more
                    <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Accordion Item 2 */}
          <div
            className={`rounded-xl border transition-all duration-200 ${
              activeIndex === 2
                ? "bg-surface border-primary/30 shadow-md"
                : "bg-surface border-border hover:border-primary/20"
            }`}
          >
            <button
              onClick={() => setActiveIndex(2)}
              className="flex items-center justify-between w-full px-6 py-5 text-left focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
              aria-expanded={activeIndex === 2}
              aria-controls="panel-2"
              id="accordion-tab-2"
            >
              <span className="text-sm font-bold text-primary font-heading">Safety Engine</span>
              <ChevronRight className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${activeIndex === 2 ? "rotate-90" : ""}`} />
            </button>
            <div
              id="panel-2"
              role="region"
              aria-labelledby="accordion-tab-2"
              className={`overflow-hidden transition-all duration-300 ${activeIndex === 2 ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
            >
              <div className="px-6 pb-6">
                <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4">
                  Human-in-the-loop safety monitoring detects distress signals without compromising anonymity. Trained facilitators observe behavioral patterns, never content, and can intervene without ever knowing who they are helping.
                </p>
                <Button variant="ghost" asChild className="h-9 px-5 rounded-lg border border-primary/40 text-primary hover:bg-primary hover:text-white text-xs font-bold transition-all duration-200">
                  <Link href="/features#safety-engine">
                    Learn more
                    <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Accordion Item 3 */}
          <div
            className={`rounded-xl border transition-all duration-200 ${
              activeIndex === 3
                ? "bg-surface border-primary/30 shadow-md"
                : "bg-surface border-border hover:border-primary/20"
            }`}
          >
            <button
              onClick={() => setActiveIndex(3)}
              className="flex items-center justify-between w-full px-6 py-5 text-left focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
              aria-expanded={activeIndex === 3}
              aria-controls="panel-3"
              id="accordion-tab-3"
            >
              <span className="text-sm font-bold text-primary font-heading">Hard Anonymity</span>
              <ChevronRight className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${activeIndex === 3 ? "rotate-90" : ""}`} />
            </button>
            <div
              id="panel-3"
              role="region"
              aria-labelledby="accordion-tab-3"
              className={`overflow-hidden transition-all duration-300 ${activeIndex === 3 ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
            >
              <div className="px-6 pb-6">
                <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4">
                  Session tokens are cryptographically enforced and carry zero linkage to identity. Tokens expire automatically, leave no audit trail, and are signed with short-lived keys that cannot be correlated across sessions.
                </p>
                <Button variant="ghost" asChild className="h-9 px-5 rounded-lg border border-primary/40 text-primary hover:bg-primary hover:text-white text-xs font-bold transition-all duration-200">
                  <Link href="/features#hard-anonymity">
                    Learn more
                    <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Mockup Panel */}
        <div className="relative rounded-2xl overflow-hidden bg-surface border border-border shadow-lg min-h-[380px] lg:min-h-[440px] w-full">
          {activeIndex === 0 && (
            <div className="absolute inset-0 flex flex-col animate-in fade-in zoom-in-95 duration-300">
              <Image
                src="/features/identity-vault.png"
                alt="Identity Vault — encrypted security architecture"
                fill
                className="object-cover"
                priority
                quality={85}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
                data-no-dark="true"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent flex flex-col items-center justify-end p-8">
                <p className="text-primary-foreground/50 text-xs font-bold uppercase tracking-widest font-ui mb-2">Identity Vault</p>
                <p className="text-primary-foreground/90 text-sm font-body text-center max-w-[28ch] leading-relaxed">Your personal data is isolated in an encrypted vault — completely unreachable from session infrastructure.</p>
              </div>
            </div>
          )}

          {activeIndex === 1 && (
            <div className="absolute inset-0 flex flex-col animate-in fade-in zoom-in-95 duration-300">
              <Image
                src="/features/avatar-native.png"
                alt="Avatar Privacy — anonymous digital identity"
                fill
                className="object-cover"
                quality={85}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
                data-no-dark="true"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent flex flex-col items-center justify-end p-8">
                <p className="text-accent text-xs font-bold uppercase tracking-widest font-ui mb-2">Avatar Native</p>
                <p className="text-primary-foreground/90 text-sm font-body text-center max-w-[28ch] leading-relaxed">Your identity is expressed only through a curated abstract avatar — never your actual face or appearance.</p>
              </div>
            </div>
          )}

          {activeIndex === 2 && (
            <div className="absolute inset-0 flex flex-col animate-in fade-in zoom-in-95 duration-300">
              <Image
                src="/features/safety-engine.png"
                alt="Safety Engine — human monitoring with anonymity"
                fill
                className="object-cover"
                quality={85}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
                data-no-dark="true"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-success/80 via-success/20 to-transparent flex flex-col items-center justify-end p-8">
                <p className="text-success text-xs font-bold uppercase tracking-widest font-ui mb-2">Safety Engine</p>
                <p className="text-primary-foreground/90 text-sm font-body text-center max-w-[28ch] leading-relaxed">Behavioral safety monitoring with human oversight — keeping sessions safe without ever accessing identity.</p>
              </div>
            </div>
          )}

          {activeIndex === 3 && (
            <div className="absolute inset-0 flex flex-col animate-in fade-in zoom-in-95 duration-300">
              <Image
                src="/features/hard-anonymity.png"
                alt="Hard Anonymity — cryptographic session tokens"
                fill
                className="object-cover"
                quality={85}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
                data-no-dark="true"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent flex flex-col items-center justify-end p-8">
                <p className="text-accent text-xs font-bold uppercase tracking-widest font-ui mb-2">Hard Anonymity</p>
                <p className="text-primary-foreground/90 text-sm font-body text-center max-w-[28ch] leading-relaxed">Every session token is ephemeral, cryptographically signed, and completely unlinkable across visits.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
