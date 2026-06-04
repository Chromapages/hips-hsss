"use client";

import React, { useState } from "react"
import { Navbar } from "@/components/polish/Navbar"
import { Shield, Lock, EyeOff, ChevronRight, PlayCircle, MousePointerClick, Zap, Key } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <main className="min-h-screen bg-white text-text-primary selection:bg-[#173B57]/30 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] pt-[clamp(2rem,4vw,3rem)] pb-[clamp(3rem,5vw,4rem)] md:pt-[clamp(3rem,5vw,5rem)] md:pb-[clamp(3.5rem,6vw,6rem)] overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hips_hero.png"
            alt="H.I.P.S. Foundation — anonymous peer support platform"
            fill
            className="object-cover"
            priority
            quality={85}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
        </div>

        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          {/* Two-column grid: left content, right placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[70vh]">
            {/* Left Column — Hero Content */}
            <div className="text-left">
              {/* Announcement Pill Badge */}
              <div className="inline-flex items-center gap-3 rounded-full border border-accent/40 bg-accent/10 backdrop-blur-xl px-5 py-2 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <span className="text-[9px] font-bold uppercase tracking-brand text-primary font-ui">New</span>
                <span className="w-px h-3 bg-primary/50" />
                <span className="text-[10px] font-medium text-slate-700 tracking-wide">First Anonymous Peer Support Network Live</span>
              </div>

              {/* H1 - Hero display headline (ExtraBold) */}
              <h1 className="font-heading heading-fluid-xl font-extrabold tracking-tight mb-8 leading-tight text-primary animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                Support Without <br /> the Spotlight.
              </h1>

              {/* Subheadline - constrained mid-width column with muted color */}
              <p className="text-lg md:text-xl text-slate-700 mb-10 max-w-xl leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200 font-body">
                Expert peer support, coaching, and workshops in a completely anonymous, camera-free virtual environment. Built on hard-anonymity protocols.
              </p>

              {/* Dual CTA Layout */}
              <div className="flex flex-col sm:flex-row items-start gap-5 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                <Button asChild className="h-14 px-10 rounded-full bg-[#173B57] text-white hover:bg-[#C59A35] hover:shadow-xl hover:shadow-[#C59A35]/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 ease-in-out text-base font-bold group focus-visible:ring-2 focus-visible:ring-[#173B57] focus-visible:ring-offset-2">
                  <Link href="/services">
                    Get Support
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200 ease-in-out" />
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="h-14 px-10 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 ease-in-out text-base font-bold group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                  <Link href="/opportunities">
                    <PlayCircle className="mr-2 h-5 w-5 text-accent group-hover:scale-110 transition-transform duration-200" />
                    For Organizations
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column — Reserved for future content */}
            <div className="hidden md:flex min-h-[500px] items-center justify-center">
              {/* Right column — reserved for future content */}
            </div>
          </div>

          {/* Partner / Trust Logo Strip — full width below grid */}
          <div className="animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-400 mt-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-700 mb-8 font-ui">Partnering with leading mental health organizations</p>
            <div className="flex flex-wrap items-center justify-start gap-8 md:gap-12 opacity-30">
              {/* Placeholder partner logos - using text for now, replace with actual logo Image components */}
              {['HIMS', 'Mindful', 'Calm', 'Headspace', 'BetterHelp'].map((partner) => (
                <span key={partner} className="text-sm font-bold uppercase tracking-[0.15em] text-primary font-ui">{partner}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-[clamp(3rem,5vw,6rem)] md:py-[clamp(4rem,7vw,8rem)] bg-[#EEF3F6] border-t border-[#D6E0E8]">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Header — centered, compact */}
          <div className="text-center mb-20">
            {/* Pill badge */}
            <span className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-5 py-1.5 text-[10px] font-bold uppercase tracking-brand text-accent font-ui mb-6">
              How It Works
            </span>
            {/* Display headline */}
            <h2 className="font-heading heading-fluid-lg font-bold tracking-tight text-primary leading-tight mb-6">
              From first click to feeling heard — in minutes.
            </h2>
            {/* Supporting paragraph */}
            <p className="text-base md:text-lg text-slate-700 max-w-[60ch] mx-auto leading-relaxed font-body">
              No sign-up wall. No identity check. Just a few steps to a completely private support session.
            </p>
          </div>

          {/* Step Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">

            {/* Vertical line on left — mobile only */}
            <div className="absolute left-7 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-accent/40 md:hidden pointer-events-none" />

            {/* Connecting line — desktop only */}
            <div className="hidden md:block absolute top-12 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-transparent via-accent/40 to-transparent pointer-events-none" />

            {/* Step 1 */}
            <div className="flex flex-col items-center text-center md:text-center relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
              {/* Icon in accent color */}
              <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center mb-6">
                <MousePointerClick className="w-7 h-7 text-accent" />
              </div>
              {/* Step number badge */}
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold font-heading mb-4">
                1
              </div>
              {/* Step title */}
              <h3 className="font-heading text-xl md:text-2xl font-bold text-primary mb-3">
                Create Your Session
              </h3>
              {/* Description */}
              <p className="text-sm text-slate-700 leading-relaxed font-body max-w-[28ch] mx-auto">
                Choose your session type — peer support, coaching, or a facilitated group. No account, no email, no identity. Just a temporary anonymous token.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center md:text-center relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
              {/* Icon in accent color */}
              <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-accent" />
              </div>
              {/* Step number badge */}
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold font-heading mb-4">
                2
              </div>
              {/* Step title */}
              <h3 className="font-heading text-xl md:text-2xl font-bold text-primary mb-3">
                Get Matched Instantly
              </h3>
              {/* Description */}
              <p className="text-sm text-slate-700 leading-relaxed font-body max-w-[28ch] mx-auto">
                Our safety engine reviews your session type and pairs you with a verified facilitator or peer group within seconds. Hard anonymity is enforced automatically.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center md:text-center relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              {/* Icon in accent color */}
              <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-accent" />
              </div>
              {/* Step number badge */}
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold font-heading mb-4">
                3
              </div>
              {/* Step title */}
              <h3 className="font-heading text-xl md:text-2xl font-bold text-primary mb-3">
                Connect Safely and Privately
              </h3>
              {/* Description */}
              <p className="text-sm text-slate-700 leading-relaxed font-body max-w-[28ch] mx-auto">
                Enter your camera-free 3D avatar room. Your voice is masked in transit, your identity is never logged, and a human facilitator ensures the space stays safe.
              </p>
            </div>

          </div>

          {/* CTA Block */}
          <div className="text-center mt-20">
            {/* Reassurance line */}
            <p className="text-sm font-semibold text-primary font-body mb-8">
              No account required to start
            </p>

            {/* Dual CTA — match hero button styles exactly */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              {/* Primary: Start Your Session */}
              <Button asChild className="h-14 px-10 rounded-full bg-[#173B57] text-white hover:bg-[#C59A35] hover:shadow-xl hover:shadow-[#C59A35]/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 ease-in-out text-base font-bold group focus-visible:ring-2 focus-visible:ring-[#173B57] focus-visible:ring-offset-2">
                <Link href="/services">
                  Start Your Session
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </Button>

              {/* Ghost: Watch How It Works */}
              <Button variant="ghost" asChild className="h-14 px-10 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 ease-in-out text-base font-bold group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                <Link href="/how-it-works">
                  <PlayCircle className="mr-2 h-5 w-5 text-accent group-hover:scale-110 transition-transform duration-200" />
                  Watch How It Works
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section — Two-Tier Interactive Layout */}
      <section className="py-16 md:py-24 border-t border-zinc-200 bg-white relative">
        <div className="max-w-[1200px] mx-auto px-6">

          {/* Section Header — centered, tight */}
          <div className="text-center mb-16">
            {/* Pill badge */}
            <span className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-5 py-1.5 text-[10px] font-bold uppercase tracking-brand text-accent font-ui mb-6">
              Core Features
            </span>
            {/* Display headline */}
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary leading-tight mb-6">
              Built for true anonymity.
            </h2>
            {/* Supporting paragraph */}
            <p className="text-base md:text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed font-body">
              Every layer of HSSS is engineered to protect who you are — so you can focus on being heard.
            </p>
          </div>

          {/* 4-Column Tab Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
            {/* Tab 0 — Identity Vault */}
            <button
              onClick={() => setActiveIndex(0)}
              className={`flex flex-col items-start gap-2 rounded-xl p-5 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                activeIndex === 0
                  ? "bg-accent/10 border border-accent/30 shadow-sm"
                  : "bg-white border border-zinc-200 hover:bg-muted"
              }`}
              aria-selected={activeIndex === 0}
              role="tab"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Lock className="w-4 h-4 text-accent" />
              </div>
              <span className="text-sm font-bold text-primary font-heading leading-tight">Identity Vault</span>
              <span className="text-xs text-slate-700 font-body leading-snug">Isolated, encrypted PII storage — zero trace</span>
            </button>

            {/* Tab 1 — Avatar Privacy */}
            <button
              onClick={() => setActiveIndex(1)}
              className={`flex flex-col items-start gap-2 rounded-xl p-5 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                activeIndex === 1
                  ? "bg-accent/10 border border-accent/30 shadow-sm"
                  : "bg-white border border-zinc-200 hover:bg-muted"
              }`}
              aria-selected={activeIndex === 1}
              role="tab"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <EyeOff className="w-4 h-4 text-accent" />
              </div>
              <span className="text-sm font-bold text-primary font-heading leading-tight">Avatar Privacy</span>
              <span className="text-xs text-slate-700 font-body leading-snug">No cameras. Curated 3D avatars only.</span>
            </button>

            {/* Tab 2 — Safety Engine */}
            <button
              onClick={() => setActiveIndex(2)}
              className={`flex flex-col items-start gap-2 rounded-xl p-5 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                activeIndex === 2
                  ? "bg-accent/10 border border-accent/30 shadow-sm"
                  : "bg-white border border-zinc-200 hover:bg-muted"
              }`}
              aria-selected={activeIndex === 2}
              role="tab"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-accent" />
              </div>
              <span className="text-sm font-bold text-primary font-heading leading-tight">Safety Engine</span>
              <span className="text-xs text-slate-700 font-body leading-snug">Human-in-the-loop monitoring, zero identity exposure</span>
            </button>

            {/* Tab 3 — Session Token */}
            <button
              onClick={() => setActiveIndex(3)}
              className={`flex flex-col items-start gap-2 rounded-xl p-5 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                activeIndex === 3
                  ? "bg-accent/10 border border-accent/30 shadow-sm"
                  : "bg-white border border-zinc-200 hover:bg-muted"
              }`}
              aria-selected={activeIndex === 3}
              role="tab"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Key className="w-4 h-4 text-accent" />
              </div>
              <span className="text-sm font-bold text-primary font-heading leading-tight">Hard Anonymity</span>
              <span className="text-xs text-slate-700 font-body leading-snug">Cryptographically enforced session tokens</span>
            </button>
          </div>

          {/* Two-Column Detail Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 lg:gap-12 items-start">

            {/* Left: Accordion Column */}
            <div className="flex flex-col gap-3" role="tablist" aria-label="Feature details">
              {/* Accordion Item 0 */}
              <div
                className={`rounded-xl border transition-all duration-200 ${
                  activeIndex === 0
                    ? "bg-white border-primary/30 shadow-md"
                    : "bg-white border-border hover:border-primary/20"
                }`}
              >
                <button
                  onClick={() => setActiveIndex(0)}
                  className="flex items-center justify-between w-full px-6 py-5 text-left focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
                  role="tab"
                  aria-selected={activeIndex === 0}
                  aria-controls="accordion-panel-0"
                  id="accordion-tab-0"
                >
                  <span className="text-sm font-bold text-primary font-heading">Identity Vault</span>
                  <ChevronRight className={`w-4 h-4 text-slate-700 shrink-0 transition-transform duration-200 ${activeIndex === 0 ? "rotate-90" : ""}`} />
                </button>
                <div
                  id="accordion-panel-0"
                  role="tabpanel"
                  aria-labelledby="accordion-tab-0"
                  className={`overflow-hidden transition-all duration-300 ${activeIndex === 0 ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="px-6 pb-6">
                    <p className="text-sm text-slate-700 font-body leading-relaxed mb-4">
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
                    ? "bg-white border-primary/30 shadow-md"
                    : "bg-white border-border hover:border-primary/20"
                }`}
              >
                <button
                  onClick={() => setActiveIndex(1)}
                  className="flex items-center justify-between w-full px-6 py-5 text-left focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
                  role="tab"
                  aria-selected={activeIndex === 1}
                  aria-controls="accordion-panel-1"
                  id="accordion-tab-1"
                >
                  <span className="text-sm font-bold text-primary font-heading">Avatar Native</span>
                  <ChevronRight className={`w-4 h-4 text-slate-700 shrink-0 transition-transform duration-200 ${activeIndex === 1 ? "rotate-90" : ""}`} />
                </button>
                <div
                  id="accordion-panel-1"
                  role="tabpanel"
                  aria-labelledby="accordion-tab-1"
                  className={`overflow-hidden transition-all duration-300 ${activeIndex === 1 ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="px-6 pb-6">
                    <p className="text-sm text-slate-700 font-body leading-relaxed mb-4">
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
                    ? "bg-white border-primary/30 shadow-md"
                    : "bg-white border-border hover:border-primary/20"
                }`}
              >
                <button
                  onClick={() => setActiveIndex(2)}
                  className="flex items-center justify-between w-full px-6 py-5 text-left focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
                  role="tab"
                  aria-selected={activeIndex === 2}
                  aria-controls="accordion-panel-2"
                  id="accordion-tab-2"
                >
                  <span className="text-sm font-bold text-primary font-heading">Safety Engine</span>
                  <ChevronRight className={`w-4 h-4 text-slate-700 shrink-0 transition-transform duration-200 ${activeIndex === 2 ? "rotate-90" : ""}`} />
                </button>
                <div
                  id="accordion-panel-2"
                  role="tabpanel"
                  aria-labelledby="accordion-tab-2"
                  className={`overflow-hidden transition-all duration-300 ${activeIndex === 2 ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="px-6 pb-6">
                    <p className="text-sm text-slate-700 font-body leading-relaxed mb-4">
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
                    ? "bg-white border-primary/30 shadow-md"
                    : "bg-white border-border hover:border-primary/20"
                }`}
              >
                <button
                  onClick={() => setActiveIndex(3)}
                  className="flex items-center justify-between w-full px-6 py-5 text-left focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
                  role="tab"
                  aria-selected={activeIndex === 3}
                  aria-controls="accordion-panel-3"
                  id="accordion-tab-3"
                >
                  <span className="text-sm font-bold text-primary font-heading">Hard Anonymity</span>
                  <ChevronRight className={`w-4 h-4 text-slate-700 shrink-0 transition-transform duration-200 ${activeIndex === 3 ? "rotate-90" : ""}`} />
                </button>
                <div
                  id="accordion-panel-3"
                  role="tabpanel"
                  aria-labelledby="accordion-tab-3"
                  className={`overflow-hidden transition-all duration-300 ${activeIndex === 3 ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="px-6 pb-6">
                    <p className="text-sm text-slate-700 font-body leading-relaxed mb-4">
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
            <div className="relative">
              <>
                {activeIndex === 0 && (
                  <div className="rounded-2xl overflow-hidden shadow-lg border border-zinc-200 min-h-[380px] lg:min-h-[440px] relative animate-in fade-in zoom-in-95 duration-300">
                    <Image
                      src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200&q=85"
                      alt="Identity Vault — encrypted security architecture"
                      fill
                      className="object-cover"
                      priority
                      quality={85}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9kADAMBAAIRAxEAPwAAAGAAAAAB//9k="
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent flex flex-col items-center justify-end p-8">
                      <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest font-ui mb-2">Identity Vault</p>
                      <p className="text-white/90 text-sm font-body text-center max-w-[28ch] leading-relaxed">Your personal data is isolated in an encrypted vault — completely unreachable from session infrastructure.</p>
                    </div>
                  </div>
                )}

                {activeIndex === 1 && (
                  <div className="rounded-2xl overflow-hidden shadow-lg border border-zinc-200 min-h-[380px] lg:min-h-[440px] relative animate-in fade-in zoom-in-95 duration-300">
                    <Image
                      src="https://images.unsplash.com/photo-1633265486064-1c3c5b5e1d9c?w=1200&q=85"
                      alt="Avatar Privacy — anonymous digital identity"
                      fill
                      className="object-cover"
                      quality={85}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9kADAMBAAIRAxEAPwAAAGAAAAAB//9k="
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#213d53]/80 via-[#213d53]/20 to-transparent flex flex-col items-center justify-end p-8">
                      <p className="text-[#C59A35] text-[10px] font-bold uppercase tracking-widest font-ui mb-2">Avatar Native</p>
                      <p className="text-white/90 text-sm font-body text-center max-w-[28ch] leading-relaxed">Your identity is expressed only through a curated abstract avatar — never your actual face or appearance.</p>
                    </div>
                  </div>
                )}

                {activeIndex === 2 && (
                  <div className="rounded-2xl overflow-hidden shadow-lg border border-zinc-200 min-h-[380px] lg:min-h-[440px] relative animate-in fade-in zoom-in-95 duration-300">
                    <Image
                      src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&q=85"
                      alt="Safety Engine — human monitoring with anonymity"
                      fill
                      className="object-cover"
                      quality={85}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9kADAMBAAIRAxEAPwAAAGAAAAAB//9k="
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2F7A5F]/80 via-[#2F7A5F]/20 to-transparent flex flex-col items-center justify-end p-8">
                      <p className="text-[#2F7A5F] text-[10px] font-bold uppercase tracking-widest font-ui mb-2">Safety Engine</p>
                      <p className="text-white/90 text-sm font-body text-center max-w-[28ch] leading-relaxed">Behavioral safety monitoring with human oversight — keeping sessions safe without ever accessing identity.</p>
                    </div>
                  </div>
                )}

                {activeIndex === 3 && (
                  <div className="rounded-2xl overflow-hidden shadow-lg border border-zinc-200 min-h-[380px] lg:min-h-[440px] relative animate-in fade-in zoom-in-95 duration-300">
                    <Image
                      src="https://images.unsplash.com/photo-1638775513788-3b4b8a6c0e5f?w=1200&q=85"
                      alt="Hard Anonymity — cryptographic session tokens"
                      fill
                      className="object-cover"
                      quality={85}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9kADAMBAAIRAxEAPwAAAGAAAAAB//9k="
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#213d53]/80 via-[#213d53]/20 to-transparent flex flex-col items-center justify-end p-8">
                      <p className="text-[#C59A35] text-[10px] font-bold uppercase tracking-widest font-ui mb-2">Hard Anonymity</p>
                      <p className="text-white/90 text-sm font-body text-center max-w-[28ch] leading-relaxed">Every session token is ephemeral, cryptographically signed, and completely unlinkable across visits.</p>
                    </div>
                  </div>
                )}
              </>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-16 md:py-20 text-center relative">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center space-x-3 grayscale opacity-50">
              <Image
                src="/hipslogo.png"
                alt="H.I.P.S. Foundation"
                width={32}
                height={32}
                quality={85}
                className="object-contain"
              />
              <span className="font-heading font-bold tracking-tight text-xl text-primary">H.I.P.S.</span>
            </div>

            {/* Footer nav - uppercase with tracking */}
            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-bold uppercase text-slate-700 brand-caps">
              <Link href="/privacy" className="hover:text-primary transition-colors duration-200 ease-in-out">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-primary transition-colors duration-200 ease-in-out">Terms of Service</Link>
              <Link href="/compliance" className="hover:text-primary transition-colors duration-200 ease-in-out">Compliance</Link>
              <Link href="/contact" className="hover:text-primary transition-colors duration-200 ease-in-out">Contact</Link>
            </nav>

            <div className="max-w-2xl text-xs text-slate-700 leading-relaxed space-y-4 font-body">
              <p>Copyright &copy; 2026 Hiding in Plain Sight Foundation. All rights reserved.</p>
              <p>
                HSSS provides coaching and peer support only. We are not a medical provider and do not provide medical advice or emergency care.
                For immediate crisis help, call or text <a href="tel:988" className="text-accent hover:text-accent transition-colors duration-200 ease-in-out">988</a> (USA) or contact your local emergency services.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
