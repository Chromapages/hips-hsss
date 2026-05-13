import React from 'react'
import Link from 'next/link'

const HomePage = () => {
  return (
    <main id="main-content" className="flex flex-col w-full bg-neutral-100">

      {/* 1. Hero Tile - Light/Parchment */}
      <section className="w-full flex flex-col items-center pt-[80px] md:pt-[48px] pb-0 overflow-hidden bg-neutral-100">
        <h1 className="text-[56px] md:text-[40px] sm:text-[34px] xs:text-[28px] font-semibold text-neutral-900 tracking-[-0.28px] text-center leading-[1.07] px-4">
          Find Support. <br /> Stay 100% Anonymous.
        </h1>
        <p className="mt-4 text-[28px] md:text-[21px] text-neutral-900 text-center tracking-[0.196px] px-4">
          Healing Individuals through Peer Support.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 px-4">
          <Link href="/sign-up" className="rounded-full bg-brand-primary text-white px-[22px] py-[11px] text-[17px] font-normal hover:scale-95 transition-transform text-center">
            Get Started
          </Link>
          <Link href="/services" className="rounded-full bg-transparent text-brand-primary border border-brand-primary px-[22px] py-[11px] text-[17px] font-normal hover:scale-95 transition-transform text-center">
            Explore Services
          </Link>
        </div>
        <div className="mt-[80px] w-[80%] max-w-[1000px] rounded-t-[18px] bg-white shadow-[0_5px_30px_rgba(0,0,0,0.22)] border-t border-x border-neutral-200 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-neutral-200 bg-neutral-50 px-5 py-3" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-red-300" />
            <span className="h-3 w-3 rounded-full bg-yellow-300" />
            <span className="h-3 w-3 rounded-full bg-green-300" />
          </div>
          <div className="grid gap-6 p-6 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-xl bg-slate-900 p-5 text-white">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-300">Anonymous session room</p>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-200">Live</span>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4">
                {['You', 'Peer 2', 'Facilitator'].map((name) => (
                  <div key={name} className="rounded-xl bg-white/10 p-4 text-center">
                    <div className="mx-auto h-14 w-14 rounded-full bg-brand-primary/80" />
                    <p className="mt-3 text-sm">{name}</p>
                    <p className="text-xs text-slate-400">Voice protected</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-center gap-3">
                <span className="h-10 w-10 rounded-full bg-white/10" />
                <span className="h-10 w-10 rounded-full bg-white/10" />
                <span className="h-10 w-10 rounded-full bg-red-500/80" />
              </div>
            </div>
            <div className="rounded-xl border border-neutral-200 p-5">
              <p className="text-sm font-semibold text-neutral-900">Privacy boundary</p>
              <div className="mt-5 space-y-4">
                {['Booking identity stays in vault', 'Session token is anonymous', 'Facilitator sees only session context'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-brand-primary" />
                    <span className="text-sm text-neutral-700">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/anonymity" className="mt-8 inline-block text-[17px] text-brand-primary hover:underline">
                How anonymity works &gt;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Dark Tile 1 - Hard Anonymity */}
      <section className="w-full flex flex-col items-center py-[80px] md:py-[48px] bg-neutral-900 text-white px-4">
        <h2 className="text-[40px] md:text-[34px] sm:text-[28px] font-semibold tracking-tight text-center">Hard Anonymity.</h2>
        <p className="mt-4 text-[21px] md:text-[17px] text-neutral-400 font-semibold text-center max-w-[600px]">
          Your identity is isolated in a secure vault.
        </p>
        <Link href="/anonymity" className="mt-6 text-[17px] text-brand-primary hover:underline">
          Learn more &gt;
        </Link>
      </section>

      {/* 3. Light Tile - Peer Support */}
      <section className="w-full flex flex-col items-center py-[80px] md:py-[48px] bg-white text-neutral-900 px-4">
        <h2 className="text-[40px] md:text-[34px] sm:text-[28px] font-semibold tracking-tight text-center">Expert Peer Support.</h2>
        <p className="mt-4 text-[21px] md:text-[17px] text-neutral-500 font-semibold text-center max-w-[600px]">
          Connect with trained facilitators who understand your journey.
        </p>
        <Link href="/services" className="mt-6 text-[17px] text-brand-primary hover:underline">
          Explore services &gt;
        </Link>
      </section>

      {/* 4. Final Dark Tile - Compassionate Care */}
      <section className="w-full flex flex-col items-center py-[100px] md:py-[64px] bg-black text-white px-4">
        <h2 className="text-[40px] md:text-[34px] sm:text-[28px] font-semibold tracking-tight mb-8 text-center">Ready to begin?</h2>
        <Link href="/sign-up" className="rounded-full bg-brand-primary text-white px-[28px] py-[14px] text-[18px] font-light hover:scale-95 transition-transform">
          Create Anonymous Account
        </Link>
      </section>
    </main>
  )
}

export default HomePage
