import React from 'react'
import Link from 'next/link'

const HomePage = () => {
  return (
    <main className="flex flex-col w-full bg-[var(--apple-canvas-parchment)]">

      {/* 1. Hero Tile - Light/Parchment */}
      <section className="w-full flex flex-col items-center pt-[80px] md:pt-[48px] pb-0 overflow-hidden bg-[var(--apple-canvas-parchment)]">
        <h1 className="text-[56px] md:text-[40px] sm:text-[34px] xs:text-[28px] font-semibold text-[var(--apple-ink)] tracking-[-0.28px] text-center leading-[1.07] px-4">
          Find Support. <br /> Stay 100% Anonymous.
        </h1>
        <p className="mt-4 text-[28px] md:text-[21px] text-[var(--apple-ink)] text-center tracking-[0.196px] px-4">
          Healing Individuals through Peer Support.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 px-4">
          <Link href="/sign-up" className="rounded-full bg-[var(--apple-primary)] text-white px-[22px] py-[11px] text-[17px] font-normal hover:scale-95 transition-transform text-center">
            Get Started
          </Link>
          <Link href="/services" className="rounded-full bg-transparent text-[var(--apple-primary)] border border-[var(--apple-primary)] px-[22px] py-[11px] text-[17px] font-normal hover:scale-95 transition-transform text-center">
            Explore Services
          </Link>
        </div>
        {/* Visual Mockup Area - Product render placeholder */}
        <div className="mt-[80px] w-[80%] max-w-[1000px] h-[400px] md:h-[300px] sm:h-[200px] bg-white rounded-t-[18px] shadow-[0_5px_30px_rgba(0,0,0,0.22)] border-t border-x border-[var(--apple-hairline)]" />
      </section>

      {/* 2. Dark Tile 1 - Hard Anonymity */}
      <section className="w-full flex flex-col items-center py-[80px] md:py-[48px] bg-[var(--apple-surface-tile-1)] text-white px-4">
        <h2 className="text-[40px] md:text-[34px] sm:text-[28px] font-semibold tracking-tight text-center">Hard Anonymity.</h2>
        <p className="mt-4 text-[21px] md:text-[17px] text-[var(--apple-body-muted)] font-semibold text-center max-w-[600px]">
          Your identity is isolated in a secure vault.
        </p>
        <Link href="/anonymity" className="mt-6 text-[17px] text-[var(--apple-primary-on-dark)] hover:underline">
          Learn more &gt;
        </Link>
      </section>

      {/* 3. Light Tile - Peer Support */}
      <section className="w-full flex flex-col items-center py-[80px] md:py-[48px] bg-[var(--apple-canvas)] text-[var(--apple-ink)] px-4">
        <h2 className="text-[40px] md:text-[34px] sm:text-[28px] font-semibold tracking-tight text-center">Expert Peer Support.</h2>
        <p className="mt-4 text-[21px] md:text-[17px] text-[var(--apple-ink-muted-48)] font-semibold text-center max-w-[600px]">
          Connect with trained facilitators who understand your journey.
        </p>
        <Link href="/services" className="mt-6 text-[17px] text-[var(--apple-primary)] hover:underline">
          Explore services &gt;
        </Link>
      </section>

      {/* 4. Final Dark Tile - Compassionate Care */}
      <section className="w-full flex flex-col items-center py-[100px] md:py-[64px] bg-[var(--apple-surface-black)] text-white px-4">
        <h2 className="text-[40px] md:text-[34px] sm:text-[28px] font-semibold tracking-tight mb-8 text-center">Ready to begin?</h2>
        <Link href="/sign-up" className="rounded-full bg-[var(--apple-primary)] text-white px-[28px] py-[14px] text-[18px] font-light hover:scale-95 transition-transform">
          Create Anonymous Account
        </Link>
      </section>
    </main>
  )
}

export default HomePage