import Link from 'next/link';
import { ArrowRight, Shield, Lock, Users, Mic, EyeOff, CreditCard, ScanFace, Slash, AlertTriangle } from 'lucide-react';

const privacyNever = [
  { icon: <ScanFace className="h-5 w-5" />, label: 'Facial recognition data', desc: 'No camera access, no face matching' },
  { icon: <Mic className="h-5 w-5" />, label: 'Voice prints', desc: 'Voice masking ensures no vocal fingerprint' },
  { icon: <EyeOff className="h-5 w-5" />, label: 'Biometric identity', desc: 'No biometric data stored — ever' },
  { icon: <CreditCard className="h-5 w-5" />, label: 'Billing identity in sessions', desc: 'Commerce identity stays isolated from session data' },
];

// Static accent tokens — avoids dynamic Tailwind class names (bg-{var}/10 etc.)
// which get purged at build time since they can't be statically analyzed.
const accentStyles: Record<string, { bg: string; text: string }> = {
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-500/25', text: 'text-emerald-700 dark:text-emerald-300' },
  indigo:  { bg: 'bg-indigo-100 dark:bg-indigo-500/25',   text: 'text-indigo-700 dark:text-indigo-300'   },
  amber:   { bg: 'bg-amber-100 dark:bg-amber-500/25',     text: 'text-amber-700 dark:text-amber-300'     },
  gold:    { bg: 'bg-[#C59A35]/10 dark:bg-[#C59A35]/15', text: 'text-[#C59A35]' },
};

const demoCards = [
  {
    href: '/demo/live',
    label: 'Live Experience',
    badge: 'Interactive',
    description: 'Experience anonymous 3D avatars and real-time voice masking in your browser. Requires microphone. No download.',
    cta: 'Start the live demo',
    accent: 'indigo',
    icon: <Users className="h-6 w-6" />,
  },
  {
    href: '/demo/vault-demo',
    label: 'Identity Vault',
    badge: 'Encryption',
    description: 'See how PII is sealed with a Data Encryption Key — and how authorized decryption works with a live audit trail.',
    cta: 'Try the vault demo',
    accent: 'emerald',
    icon: <Lock className="h-6 w-6" />,
  },
  {
    href: '/demo/crisis',
    label: 'Crisis Safety',
    badge: 'Safety',
    description: 'See how real-time crisis detection triggers a safety overlay — connecting participants with professional help, anonymously.',
    cta: 'See how it works',
    accent: 'amber',
    icon: <AlertTriangle className="h-6 w-6" />,
  },
  {
    href: '/board-demo',
    label: 'Board Guide',
    badge: 'Full Tour',
    description: 'A guided walkthrough of the complete H.I.P.S. platform — privacy architecture, session flow, and safety features.',
    cta: 'Explore the board guide',
    accent: 'gold',
    icon: <Shield className="h-6 w-6" />,
  },
];

export default function DemoPage() {
  return (
    <main id="main" tabIndex={-1} className="min-h-screen bg-surface text-text-primary overflow-x-hidden pb-16">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-white focus:font-bold"
      >
        Skip to main content
      </a>

      {/* SECTION 1: HERO */}
      <section className="mx-auto max-w-3xl px-5 py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600 brand-caps">
          Proof of Anonymity
        </p>
        <h1 className="font-heading text-3xl md:text-5xl font-semibold leading-tight text-text-primary mt-4">
          Your payment info is never in the same place as your session.
        </h1>
        <p className="mt-4 text-base text-text-secondary font-body leading-relaxed max-w-xl mx-auto">
          H.I.P.S. separates who pays from who participates. The system that processes your payment
          never sees your session activity — and the room you join never sees your name.
        </p>
        <div className="mt-8">
          <Link
            href="/demo/live"
            className="inline-flex items-center gap-3 rounded-2xl bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-2xl shadow-indigo-500/30 hover:bg-indigo-500 hover:scale-[1.02] transition-all"
          >
            Start with the Live Demo
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="mt-3 text-xs text-text-secondary">
            No download required — voice masking and avatars run in your browser
          </p>
        </div>
      </section>

      {/* SECTION 2: PROOF */}
      <section className="mx-auto max-w-4xl px-5 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50 p-6 dark:border-emerald-400/20 dark:bg-emerald-950/30 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-emerald-900 dark:text-emerald-100">
              Commerce Database
            </h2>
            <p className="mt-2 text-xs text-emerald-800/80 font-body dark:text-emerald-200/80">
              Payment processor — isolated from sessions
            </p>
            <dl className="mt-4 space-y-3 text-sm font-body">
              <div className="flex justify-between gap-4">
                <dt className="text-emerald-900/70 dark:text-emerald-200/80">Firebase UID</dt>
                <dd className="font-mono text-xs font-medium text-emerald-950 dark:text-emerald-50">usr_89F2</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-emerald-900/70 dark:text-emerald-200/80">Package</dt>
                <dd className="font-medium text-emerald-950 dark:text-emerald-50">6 sessions</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-emerald-900/70 dark:text-emerald-200/80">Session ref</dt>
                <dd className="font-mono text-xs font-medium text-emerald-950 dark:text-emerald-50">sha256:a81e…</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-amber-900/20 bg-amber-50 p-6 dark:border-amber-400/20 dark:bg-amber-950/30 shadow-sm">
            <h2 className="font-heading text-lg font-semibold text-amber-900 dark:text-amber-100">
              Session Database
            </h2>
            <p className="mt-2 text-xs text-amber-800/80 font-body dark:text-amber-200/80">
              Anonymous room engine — isolated from billing
            </p>
            <dl className="mt-4 space-y-3 text-sm font-body">
              <div className="flex justify-between gap-4">
                <dt className="text-amber-900/70 dark:text-amber-200/80">Anonymous ID</dt>
                <dd className="font-mono text-xs font-medium text-amber-950 dark:text-amber-200">anon_4KQ9</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-amber-900/70 dark:text-amber-200/80">Room</dt>
                <dd className="font-mono text-xs font-medium text-amber-950 dark:text-amber-200">room_breath_12</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-amber-900/70 dark:text-amber-200/80">Status</dt>
                <dd className="text-success font-medium">active</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* SECTION 3: DEMOS */}
      <section aria-label="Demo options" className="mx-auto max-w-4xl px-5 pb-16">
        <h2 className="sr-only">Interactive Demos</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {demoCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-2xl border border-border bg-surface p-6 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex flex-col justify-between"
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${accentStyles[card.accent]?.bg} ${accentStyles[card.accent]?.text}`}>
                  {card.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary brand-caps">
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="font-heading font-semibold text-text-primary group-hover:text-primary transition-colors text-lg">
                    {card.label}
                  </h3>
                  <p className="mt-1.5 text-sm text-text-secondary font-body leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-primary font-ui">
                {card.cta}
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform animate-none" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 4: PRIVACY GUARANTEE */}
      <section className="mx-auto max-w-4xl px-5 pb-16">
        <div className="rounded-2xl border border-border bg-surface p-6 md:p-8 shadow-sm">
          <h2 className="font-heading text-xl font-semibold text-text-primary flex items-center gap-2">
            <Slash className="h-5 w-5 text-danger" aria-hidden="true" />
            Data we never collect or store
          </h2>
          <p className="mt-2 text-sm text-text-secondary font-body max-w-2xl">
            Every H.I.P.S. session is built around a simple principle: the minimum data required,
            for the minimum time needed.
          </p>
          <ul className="mt-6 grid gap-4 md:grid-cols-2" role="list">
            {privacyNever.map((item) => (
              <li key={item.label} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-danger/10 text-danger">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{item.label}</p>
                  <p className="text-xs text-text-secondary font-body mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SECTION 5: TRUST */}
      <section className="mx-auto max-w-4xl px-5">
        <div className="rounded-2xl border border-border bg-surface p-6 text-center shadow-sm max-w-2xl mx-auto">
          <p className="text-xs text-text-secondary font-body leading-relaxed">
            H.I.P.S. is a{' '}
            <span className="font-semibold text-text-primary">501(c)(3) nonprofit</span>{' '}
            organization. All donor contributions are tax-deductible.
          </p>
          <p className="mt-2 text-xs text-text-secondary font-body leading-relaxed">
            Privacy architecture reviewed by independent security auditors.
          </p>
        </div>
      </section>
    </main>
  );
}
