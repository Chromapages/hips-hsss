import Link from 'next/link';
import { ShieldAlert, AlertTriangle, Lock, Users, ChevronRight, Eye, EyeOff, Check, ArrowRight, MessageCircle, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Crisis Safety Demo — H.I.P.S.',
  description: 'Interactive demonstration of the H.I.P.S. real-time crisis detection and anonymous escalation system.',
};

// Crisis keyword categories for the interactive demo
const CRISIS_CATEGORIES = [
  {
    label: 'Self-harm',
    keywords: ['want to die', 'kill myself', 'end my life', 'suicide', 'harm myself', 'cutting'],
    icon: '🔪',
    color: 'red',
  },
  {
    label: 'Harm to others',
    keywords: ['hurt someone', 'kill them', 'harm others', 'violent thoughts'],
    icon: '⚠️',
    color: 'amber',
  },
  {
    label: 'Substance crisis',
    keywords: ['overdose', 'too much to drink', 'can\'t stop using', 'relapsed'],
    icon: '💊',
    color: 'violet',
  },
];

// Example anonymous messages in a peer support session
const SESSION_MESSAGES = [
  { id: 1, sender: 'anon_3f8a', text: 'I\'ve been feeling really overwhelmed lately at work.', time: '2:34 PM' },
  { id: 2, sender: 'anon_7c2d', text: 'That sounds really hard. What\'s been the hardest part?', time: '2:35 PM' },
  { id: 3, sender: 'anon_3f8a', text: 'I just don\'t see a way forward sometimes.', time: '2:36 PM' },
  { id: 4, sender: 'anon_9e1b', text: 'I hear you. Those feelings are valid.', time: '2:37 PM' },
  { id: 5, sender: 'anon_facilitator', text: 'Remember — everything shared here is anonymous and safe.', time: '2:38 PM', facilitator: true },
];

export default function CrisisDemoPage() {
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
          <div className="h-7 w-7 rounded-lg bg-amber-500/20 ring-1 ring-amber-500/40 flex items-center justify-center">
            <ShieldAlert className="h-4 w-4 text-amber-400" />
          </div>
          <span className="font-bold text-sm tracking-widest uppercase text-white/80 font-ui">
            H.I.P.S.
          </span>
          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-amber-500/20">
            Crisis Safety
          </span>
        </div>
        <Link
          href="/demo/live"
          className="flex items-center gap-1.5 rounded-xl bg-[#C59A35] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#A67F28] shadow-lg shadow-amber-500/20"
        >
          Live Demo →
        </Link>
      </nav>

      {/* ── Hero ── */}
      <section className="mx-auto max-w-4xl px-6 pt-12 pb-8 text-center">
        <p className="brand-caps text-[11px] text-amber-400 mb-4">
          Interactive Demonstration
        </p>
        <h1 className="font-heading text-4xl font-bold text-white md:text-5xl mb-4">
          Crisis Safety System
        </h1>
        <p className="mx-auto max-w-xl text-base text-white/55 font-body leading-relaxed">
          H.I.P.S. detects crisis language in real time and triggers a safety overlay — connecting
          participants with professional help without ever revealing their identity.
        </p>
      </section>

      {/* ── Main demo: how crisis detection works ── */}
      <section className="mx-auto max-w-4xl px-6 pb-10 grid md:grid-cols-2 gap-6">

        {/* LEFT — Interactive session simulation */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 font-ui">Live Session Simulation</p>
              <h2 className="text-base font-bold text-white mt-0.5">Peer Support Room — 4 participants</h2>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Active</span>
            </div>
          </div>

          {/* Chat messages */}
          <div className="p-4 space-y-3 h-64 overflow-y-auto">
            {SESSION_MESSAGES.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.facilitator ? 'items-center' : 'items-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.facilitator
                    ? 'bg-amber-500/15 border border-amber-500/20 text-amber-200 text-center mx-auto'
                    : msg.sender === 'anon_3f8a'
                    ? 'bg-indigo-500/15 border border-indigo-500/20 text-indigo-200 ml-0'
                    : 'bg-white/5 border border-white/10 text-white/70'
                }`}>
                  {!msg.facilitator && (
                    <p className="text-[10px] font-mono text-white/30 mb-0.5">{msg.sender}</p>
                  )}
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className="text-[10px] text-white/30 mt-1 text-right">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Keyword detection notice */}
          <div className="px-4 py-3 border-t border-white/8 bg-amber-500/5">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs text-amber-200/80 font-body leading-relaxed">
                Crisis language detection runs on all messages in real time. No human reads messages
                unless crisis signals are detected — and even then, identity remains anonymous.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT — How detection works */}
        <div className="flex flex-col gap-5">
          {/* Crisis detection pipeline */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 font-ui mb-4">
              How crisis detection works
            </p>
            <ol className="space-y-3" aria-label="Crisis detection pipeline">
              {[
                { step: 1, title: 'Message sent', desc: 'All messages processed locally — no human reads raw content', icon: <MessageCircle className="h-4 w-4" />, color: 'indigo' },
                { step: 2, title: 'Keyword pattern match', desc: 'NLP + keyword categories: self-harm, harm-to-others, substance crisis', icon: <AlertTriangle className="h-4 w-4" />, color: 'amber' },
                { step: 3, title: 'Severity scoring', desc: 'If score exceeds threshold → trigger safety overlay immediately', icon: <ShieldAlert className="h-4 w-4" />, color: 'red' },
                { step: 4, title: 'Anonymous escalation', desc: 'Participant sees overlay with crisis resources — no identity exposed', icon: <Lock className="h-4 w-4" />, color: 'emerald' },
              ].map((item) => (
                <li key={item.step} className="flex items-start gap-3">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-${item.color}-500/20 text-${item.color}-400 text-xs font-bold`}>
                    {item.step}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className={`text-${item.color}-400`}>{item.icon}</div>
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                    </div>
                    <p className="text-xs text-white/40 font-body mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Crisis keyword categories */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 font-ui mb-3">
              What triggers the overlay
            </p>
            <div className="space-y-2.5">
              {CRISIS_CATEGORIES.map((cat) => (
                <div key={cat.label} className="flex items-start gap-2.5">
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-sm"
                    role="img"
                    aria-label={cat.label}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{cat.label}</p>
                    <p className="text-[10px] text-white/40 font-body mt-0.5 leading-relaxed">
                      {cat.keywords.join(' · ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── The overlay modal preview ── */}
      <section className="mx-auto max-w-4xl px-6 pb-10">
        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-amber-500/15">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-ui">What the participant sees</p>
            <h2 className="text-base font-bold text-white mt-0.5">The Crisis Safety Overlay</h2>
          </div>

          {/* Simulated overlay modal */}
          <div className="p-6">
            <div className="max-w-md mx-auto rounded-[2rem] border border-white/10 bg-[#0a0a0a]/95 shadow-2xl overflow-hidden">
              {/* Radial glow at top */}
              <div className="h-32 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.15)_0%,transparent_70%)]" />

              {/* Content */}
              <div className="px-8 pb-8 -mt-8">
                <div className="flex flex-col items-center text-center mb-8">
                  {/* Pulsing shield icon */}
                  <div className="flex items-center justify-center h-20 w-20 rounded-full bg-amber-500/10 border border-amber-500/20 shadow-[0_0_50px_rgba(245,158,11,0.2)] mb-6">
                    <ShieldAlert className="h-10 w-10 text-amber-400 animate-pulse" />
                  </div>
                  <h3 className="font-heading text-3xl font-extrabold text-white mb-2">
                    You are not alone.
                  </h3>
                  <p className="text-base text-white/60">Professional help is available right now.</p>
                </div>

                {/* Crisis resources */}
                <div className="space-y-3 mb-8">
                  {[
                    { label: '988 Suicide & Crisis Lifeline', action: 'Call or Text 988', href: 'tel:988', primary: true },
                    { label: 'Crisis Text Line', action: 'Text HOME to 741741', href: 'sms:741741&body=HOME', primary: false },
                  ].map((resource) => (
                    <a
                      key={resource.label}
                      href={resource.href}
                      className={`flex flex-col items-center justify-center text-center rounded-2xl border p-5 transition-all ${
                        resource.primary
                          ? 'border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/15'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-sm font-bold text-white">{resource.label}</span>
                      <span className="text-xs text-white/50 mt-1 uppercase tracking-wider">{resource.action}</span>
                    </a>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    className="h-12 rounded-2xl border border-white/10 bg-transparent font-bold text-white hover:bg-white/5 transition-all text-sm"
                    type="button"
                  >
                    Stay in session
                  </button>
                   <button
                    className="h-12 rounded-2xl bg-red-500 font-bold text-white hover:bg-red-400 transition-all text-sm shadow-xl shadow-red-900/30"
                    type="button"
                  >
                    End session safely
                  </button>
                </div>
              </div>

              {/* Anonymous note */}
              <div className="px-8 py-4 bg-black/50 border-t border-white/5 flex items-center justify-center gap-2">
                <Lock className="h-3 w-3 text-emerald-400" aria-hidden="true" />
                <p className="text-[10px] text-emerald-400/70">
                  Your identity remains completely anonymous. No data linking you to this session is stored.
                </p>
              </div>
            </div>

            <p className="text-center text-xs text-white/40 font-body mt-4 leading-relaxed max-w-md mx-auto">
              The overlay appears instantly when crisis language is detected. Participants can connect with
              professional crisis resources without leaving the anonymous session — or choose to stay and
              continue with peer support.
            </p>
          </div>
        </div>
      </section>

      {/* ── Anonymity guarantee during crisis ── */}
      <section className="mx-auto max-w-4xl px-6 pb-10">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 font-ui">Critical guarantee</p>
            <h2 className="text-base font-bold text-white mt-0.5">
              Anonymity is never broken — even during crisis
            </h2>
          </div>
          <div className="grid md:grid-cols-2 divide-x divide-white/8">
            <div className="p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-danger/15 text-danger">
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">What facilitators NEVER see</p>
                </div>
              </div>
              <ul className="space-y-2" role="list">
                {[
                  'Real name or email address',
                  'IP address or device identifier',
                  'Payment or billing information',
                  'Identity linking code or token',
                  'The content of crisis messages',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-white/60 font-body">
                    <span className="text-danger">✗</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                  <Lock className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">What IS available to responders</p>
                </div>
              </div>
              <ul className="space-y-2" role="list">
                {[
                  'Anonymous session token (e.g. anon_3f8a)',
                  'Crisis signal type (self-harm, substance, etc.)',
                  'Anonymous escalation timestamp',
                  'Anonymous chat transcript (session-scoped)',
                  'Anonymous connection to a trained facilitator',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-white/60 font-body">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" aria-hidden="true" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="px-5 py-3 bg-emerald-500/5 border-t border-emerald-500/15 flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" aria-hidden="true" />
            <p className="text-xs text-emerald-300/80 font-body">
              Crisis escalation works through a separate, isolated pathway. Facilitators see only anonymous
              session tokens — never any identifying information.
            </p>
          </div>
        </div>
      </section>

      {/* ── Next step ── */}
      <section className="mx-auto max-w-4xl px-6 pb-12">
        <div className="rounded-2xl border border-border bg-surface p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary font-heading">Crisis safety is built into every H.I.P.S. session.</p>
            <p className="text-xs text-secondary font-body mt-1">
              No other anonymous platform provides real-time crisis detection with anonymous human escalation.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              href="/board-demo"
              className="inline-flex items-center gap-2 rounded-xl bg-[#C59A35] px-6 py-3 text-sm font-bold text-white uppercase tracking-wider font-ui hover:bg-[#A67F28] transition-all shadow-lg shadow-amber-500/20"
            >
              Full Board Guide →
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-white/70 uppercase tracking-wider font-ui hover:bg-white/10 transition-all"
            >
              ← Overview
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
