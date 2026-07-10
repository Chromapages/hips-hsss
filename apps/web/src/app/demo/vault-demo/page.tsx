import Link from 'next/link';
import { VaultDemo } from '@/components/demo/VaultDemo';
import { ArrowRight, Users } from 'lucide-react';

export const metadata = {
  title: 'Identity Vault Demo · Phase 1C — H.I.P.S.',
  description: 'Interactive demo showing how envelope encryption protects PII using a Data Encryption Key (DEK) and produces an immutable audit trail.',
};

export default function VaultDemoPage() {
  return (
    <main id="main" tabIndex={-1} className="min-h-screen bg-bg-subtle">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-white focus:font-bold"
      >
        Skip to main content
      </a>
      {/* Back to overview */}
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <Link
          href="/demo"
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-primary font-ui uppercase tracking-wider transition-colors"
        >
          ← Overview
        </Link>
      </div>

      {/* Vault demo */}
      <VaultDemo />

      {/* ── Next step narrative card ── */}
      <div className="max-w-2xl mx-auto px-4 pb-12">
        <div className="rounded-2xl border border-indigo-500/25 bg-indigo-500/5 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500/10 to-transparent px-6 py-4 border-b border-indigo-500/15">
            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 brand-caps">
              Next — Experience it live
            </p>
            <h2 className="font-heading text-lg font-semibold text-white mt-1">
              See anonymity in action
            </h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-white/60 font-body leading-relaxed mb-5">
              The Identity Vault protects <em>who you are</em> (your PII). The next demo shows how
              H.I.P.S. also protects <em>how you show up</em> — your voice and your visual presence
              in a session — through real-time voice masking and anonymous avatars.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/demo/live"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-sm font-bold text-white uppercase tracking-wider font-ui transition-all shadow-lg shadow-indigo-500/20"
              >
                <Users className="h-4 w-4" aria-hidden="true" />
                Try the Live Demo
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-white/60 uppercase tracking-wider font-ui hover:bg-white/10 transition-all"
              >
                ← Back to overview
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
