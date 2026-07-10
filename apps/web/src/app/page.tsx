import React from "react"
import { Navbar } from "@/components/polish/Navbar"
import { ChevronRight, PlayCircle, MousePointerClick, Zap, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FeatureTabs } from "@/components/home/FeatureTabs"
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd"
import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hips.foundation'

export const dynamic = 'force-static'
export const revalidate = false

export const metadata: Metadata = {
  title: 'H.I.P.S. Foundation — Anonymous Peer Support Online',
  description: 'The first anonymous peer support network — camera-free, voice-masked, and built on hard-anonymity protocols. Get matched in seconds, no sign-up required.',
  keywords: ['anonymous peer support', 'peer support online', 'hard anonymity', 'camera-free support', 'crisis support', 'virtual sanctuary'],
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    type: 'website',
    title: 'H.I.P.S. Foundation — Anonymous Peer Support Online',
    description: 'The first anonymous peer support network — camera-free, voice-masked, and built on hard-anonymity protocols. Get matched in seconds, no sign-up required.',
    url: `${SITE_URL}/`,
    siteName: 'H.I.P.S. Foundation',
    images: [{ url: `${SITE_URL}/og/home`, width: 1200, height: 630, alt: 'H.I.P.S. Foundation' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'H.I.P.S. Foundation — Anonymous Peer Support Online',
    description: 'The first anonymous peer support network — camera-free, voice-masked, and built on hard-anonymity protocols. Get matched in seconds, no sign-up required.',
    images: [`${SITE_URL}/og/home`],
  },
}

export default function HomePage() {

  return (
    <main id="main" tabIndex={-1} className="min-h-screen bg-bg text-text-primary selection:bg-primary/30 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[80dvh] pt-[clamp(2rem,4vw,3rem)] pb-[clamp(3rem,5vw,4rem)] md:pt-[clamp(3rem,5vw,5rem)] md:pb-[clamp(3.5rem,6vw,6rem)] overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hips_hero.webp"
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
                <span className="text-xs font-bold uppercase tracking-brand text-primary font-ui">New</span>
                <span className="w-px h-3 bg-primary/50" />
                <span className="text-xs font-medium text-text-muted tracking-wide">A new standard in anonymous peer support — now live</span>
              </div>

              {/* H1 - Hero display headline (ExtraBold) */}
              <h1 className="font-heading heading-fluid-xl font-extrabold tracking-tight mb-8 leading-tight text-primary animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                Support Without <br /> the Spotlight.
              </h1>

              {/* Subheadline - constrained mid-width column with muted color */}
              <p className="text-lg md:text-xl text-text-muted mb-10 max-w-xl leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200 font-body">
                Expert peer support, coaching, and workshops in a completely anonymous, camera-free virtual environment. Built on hard-anonymity protocols.
              </p>

              {/* Dual CTA Layout */}
              <div className="flex flex-col sm:flex-row items-start gap-5 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                <Button asChild className="h-14 px-10 rounded-full bg-primary text-primary-foreground hover:bg-accent hover:shadow-xl hover:shadow-accent/20 motion-safe:hover:scale-[1.02] motion-safe:active:scale-95 transition-all duration-200 ease-in-out text-base font-bold group focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <Link href="/services">
                    Get Support
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200 ease-in-out" />
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="h-14 px-10 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 ease-in-out text-base font-bold group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                  <Link href="/opportunities">
                    <PlayCircle className="mr-2 h-5 w-5 text-accent motion-safe:group-hover:scale-110 transition-transform duration-200" />
                    For Organizations
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column — Illustration Mockup */}
            <div className="hidden md:flex relative min-h-[400px] lg:min-h-[500px] w-full items-center justify-center animate-in fade-in zoom-in-95 duration-1000 delay-300">
              <Image
                src="/hero-app-mockup.png"
                alt="H.I.P.S. Peer Support Room Application Interface"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                data-no-dark="true"
              />
            </div>
          </div>

          {/* Partner / Trust Logo Strip — full width below grid */}
          <div className="animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-400 mt-12 md:mt-20">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted mb-4 font-ui">
              Built to integrate with leading platforms
            </p>
            <div aria-hidden="true" className="flex flex-wrap items-center justify-start gap-8 md:gap-12 opacity-60">
              {['Partner One', 'Partner Two', 'Partner Three', 'Partner Four', 'Partner Five'].map((partner) => (
                <span key={partner} className="text-sm font-bold uppercase tracking-[0.15em] text-primary font-ui">{partner}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-[clamp(3rem,5vw,6rem)] md:py-[clamp(4rem,7vw,8rem)] bg-bg-subtle border-t border-border">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Header — centered, compact */}
          <div className="text-center mb-20">
            {/* Pill badge */}
            <span className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-5 py-1.5 text-xs font-bold uppercase tracking-brand text-accent font-ui mb-6">
              How It Works
            </span>
            {/* Display headline */}
            <h2 className="font-heading heading-fluid-lg font-bold tracking-tight text-primary leading-tight mb-6">
              From first click to feeling heard — in minutes.
            </h2>
            {/* Supporting paragraph */}
            <p className="text-base md:text-lg text-text-muted max-w-[60ch] mx-auto leading-relaxed font-body">
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
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold font-heading mb-4">
                1
              </div>
              {/* Step title */}
              <h3 className="font-heading text-xl md:text-2xl font-bold text-primary mb-3">
                Create Your Session
              </h3>
              {/* Description */}
              <p className="text-sm text-text-muted leading-relaxed font-body max-w-[28ch] mx-auto">
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
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold font-heading mb-4">
                2
              </div>
              {/* Step title */}
              <h3 className="font-heading text-xl md:text-2xl font-bold text-primary mb-3">
                Get Matched Instantly
              </h3>
              {/* Description */}
              <p className="text-sm text-text-muted leading-relaxed font-body max-w-[28ch] mx-auto">
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
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold font-heading mb-4">
                3
              </div>
              {/* Step title */}
              <h3 className="font-heading text-xl md:text-2xl font-bold text-primary mb-3">
                Connect Safely and Privately
              </h3>
              {/* Description */}
              <p className="text-sm text-text-muted leading-relaxed font-body max-w-[28ch] mx-auto">
                Enter your camera-free avatar room. Your voice is masked in transit, your identity is never logged, and a human facilitator ensures the space stays safe.
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
              {/* Primary: Support the Foundation */}
              <Button asChild className="h-14 px-10 rounded-full bg-primary text-primary-foreground hover:bg-accent hover:shadow-xl hover:shadow-accent/20 motion-safe:hover:scale-[1.02] motion-safe:active:scale-95 transition-all duration-200 ease-in-out text-base font-bold group focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <Link href="/donate">
                  Support the Foundation
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </Button>

              {/* Ghost: Watch How It Works -> Try Demo Room */}
              <Button variant="ghost" asChild className="h-14 px-10 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 ease-in-out text-base font-bold group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                <Link href="/demo-room">
                  <PlayCircle className="mr-2 h-5 w-5 text-accent motion-safe:group-hover:scale-110 transition-transform duration-200" />
                  Try Demo Room
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section — Two-Tier Interactive Layout */}
      <section className="py-16 md:py-24 border-t border-border bg-bg relative">
        <div className="max-w-[1200px] mx-auto px-6">

          {/* Section Header — centered, tight */}
          <div className="text-center mb-16">
            {/* Pill badge */}
            <span className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-5 py-1.5 text-xs font-bold uppercase tracking-brand text-accent font-ui mb-6">
              Core Features
            </span>
            {/* Display headline */}
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary leading-tight mb-6">
              Built for true anonymity.
            </h2>
            {/* Supporting paragraph */}
            <p className="text-base md:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed font-body">
              Every layer of HSSS is engineered to protect who you are — so you can focus on being heard.
            </p>
          </div>

          <FeatureTabs />

        </div>
      </section>
      <OrganizationJsonLd />
    </main>
  )
}
