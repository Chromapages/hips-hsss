'use client';

import { useState, useCallback } from 'react';
import { Lock, Unlock, Eye, Clock, ShieldCheck, ChevronRight, RefreshCw } from 'lucide-react';


type Phase = 'idle' | 'encrypting' | 'encrypted' | 'decrypting' | 'verified';

interface AuditEntry {
  ts: string;
  action: 'encrypt' | 'decrypt' | 'access';
  detail: string;
  meta: string;
  icon: string;
}

function randomId(prefix: string, len = 4) {
  return `${prefix}_${Math.random().toString(36).slice(2, 2 + len).toUpperCase()}`;
}

function now() {
  return new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// ------------------------------------------------------------------
// Sub-components
// ------------------------------------------------------------------

function PhasePill({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300 ${
        active
          ? 'bg-[#2C3892] text-white shadow-[0_0_12px_rgba(44,56,146,0.4)]'
          : 'bg-white/5 text-[#EFEFED]/40'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${active ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'}`} />
      {label}
    </span>
  );
}

function EncryptionIcon({ state }: { state: Phase }) {
  const sizes = 'w-16 h-16';
  if (state === 'encrypting' || state === 'decrypting') {
    return (
      <div className={`${sizes} rounded-2xl bg-[#23698C]/20 border border-[#23698C]/30 flex items-center justify-center`}>
        <RefreshCw className="w-7 h-7 text-[#23698C] animate-spin" />
      </div>
    );
  }
  if (state === 'encrypted') {
    return (
      <div className={`${sizes} rounded-2xl bg-[#2C3892]/20 border border-[#2C3892]/40 flex items-center justify-center`}>
        <Lock className="w-7 h-7 text-[#2C3892]" />
      </div>
    );
  }
  if (state === 'verified') {
    return (
      <div className={`${sizes} rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center animate-pulse`}>
        <Unlock className="w-7 h-7 text-emerald-400" />
      </div>
    );
  }
  return (
    <div className={`${sizes} rounded-2xl bg-[#EFEFED]/5 border border-[#EFEFED]/20 flex items-center justify-center`}>
      <ShieldCheck className="w-7 h-7 text-[#EFEFED]/40" />
    </div>
  );
}

function DataCard({ label, value, masked, accent }: { label: string; value: string; masked?: boolean; accent?: string }) {
  return (
    <div className={`rounded-xl border p-4 transition-all duration-300 ${accent ? `border-[${accent}]/40 bg-[${accent}]/5` : 'border-white/10 bg-white/5'}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40">{label}</p>
        {masked && <Lock className="w-3.5 h-3.5 text-[#23698C] mt-0.5" />}
      </div>
      <p className={`mt-2 font-mono text-sm break-all leading-relaxed ${masked ? 'text-[#EFEFED]/50' : 'text-white'}`}>
        {value || '—'}
      </p>
    </div>
  );
}

function LogEntry({ entry, index }: { entry: AuditEntry; index: number }) {
  const colors = {
    encrypt: { border: 'border-[#2C3892]/40', bg: 'bg-[#2C3892]/10', dot: 'bg-[#2C3892]', label: 'text-[#2C3892]', icon: '🔐' },
    decrypt: { border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', dot: 'bg-emerald-400', label: 'text-emerald-400', icon: '🔓' },
    access: { border: 'border-[#EFEFED]/20', bg: 'bg-white/5', dot: 'bg-[#EFEFED]/40', label: 'text-[#EFEFED]/60', icon: '👤' },
  }[entry.action];

  return (
    <div
      className="relative flex items-start gap-3 pl-4"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Timeline line */}
      {index > 0 && (
        <div className="absolute -top-4 left-[7px] w-px bg-white/10" style={{ height: '16px' }} />
      )}
      {/* Dot */}
      <div className={`mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 ${colors.border} ${colors.dot}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold">{entry.icon} {entry.detail}</span>
          <span className="text-xs tabular-nums text-[#EFEFED]/30 shrink-0">{entry.ts}</span>
        </div>
        <p className="text-xs text-[#EFEFED]/40 mt-0.5">{entry.meta}</p>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Main component
// ------------------------------------------------------------------

export function VaultDemo() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [pii, setPii] = useState({ name: '', email: '', phone: '' });
  const [vxId] = useState(randomId('VX', 3));
  const [dekId] = useState(randomId('DEK', 3));
  const [log, setLog] = useState<AuditEntry[]>([
    { ts: now(), action: 'access', detail: 'Vault opened', meta: `vault_id=${vxId} | session initialized`, icon: '👤' },
  ]);
  const [showLog, setShowLog] = useState(false);
  const [progress, setProgress] = useState(0);

  const pushLog = useCallback((action: AuditEntry['action'], detail: string, meta: string) => {
    const icons: Record<AuditEntry['action'], string> = {
      encrypt: '🔐',
      decrypt: '🔓',
      access: '👤',
    };
    setLog(l => [...l, { ts: now(), action, detail, meta, icon: icons[action] }]);
  }, []);

  const startEncrypt = async () => {
    if (!pii.name.trim() && !pii.email.trim() && !pii.phone.trim()) return;
    setPhase('encrypting');
    setProgress(0);
    pushLog('access', 'PII fields collected', `name="${pii.name}" | email | phone`);

    // Simulate progress
    let p = 0;
    const tick = setInterval(() => {
      p += 20;
      setProgress(p);
      if (p === 40) pushLog('access', 'DEK generated', `dek_id=${dekId} | algo=AES-256-GCM`);
      if (p === 80) pushLog('encrypt', 'Envelope sealed', `vault_id=${vxId} | fields=3`);
      setProgress(p);
      if (p >= 100) {
        clearInterval(tick);
        pushLog('encrypt', 'VaultAccessLog written', `vault_id=${vxId} | AES-256-GCM | AEAD authenticated`);
        setPhase('encrypted');
      }
    }, 350);
  };

  const startDecrypt = () => {
    setPhase('decrypting');
    setProgress(0);

    let p = 0;
    const tick = setInterval(() => {
      p += 25;
      setProgress(p);
      if (p === 50) pushLog('access', 'DEK retrieved from KMS', `dek_id=${dekId} | authorized`);
      if (p >= 75) pushLog('decrypt', 'Envelope opened', `vault_id=${vxId} | PII fields recovered`);
      setProgress(p);
      if (p >= 100) {
        clearInterval(tick);
        pushLog('decrypt', 'Integrity verified', `all 3 fields pass AEAD authentication`);
        setPhase('verified');
      }
    }, 350);
  };

  const reset = () => {
    setPhase('idle');
    setPii({ name: '', email: '', phone: '' });
    setLog([{ ts: now(), action: 'access', detail: 'Vault opened', meta: `vault_id=${vxId} | session initialized`, icon: '👤' }]);
    setProgress(0);
  };

  const canEncrypt = !!(pii.name.trim() || pii.email.trim() || pii.phone.trim()) && phase === 'idle';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#23698C]">
          Identity Vault · Phase 1C
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A]">
          Envelope Encryption Demo
        </h2>
        <p className="text-sm text-[#334155] max-w-sm mx-auto leading-relaxed">
          See how PII is sealed with a Data Encryption Key (DEK) — and how authorized decryption works.
        </p>
      </div>

      {/* Phase pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {(['idle', 'encrypting', 'encrypted', 'decrypting', 'verified'] as Phase[]).map(p => (
          <PhasePill key={p} label={p} active={phase === p} />
        ))}
      </div>

      {/* Main card */}
      <div className="rounded-2xl border border-[#334155]/20 bg-white shadow-xl overflow-hidden">

        {/* Vault icon + status header */}
        <div className="flex items-center gap-4 bg-[#EFEFED] px-6 py-4 border-b border-[#334155]/10">
          <EncryptionIcon state={phase} />
          <div>
            <p className="text-sm font-bold text-[#0F172A]">
              {phase === 'idle' && 'Vault Ready'}
              {phase === 'encrypting' && 'Encrypting...'}
              {phase === 'encrypted' && 'Data Sealed'}
              {phase === 'decrypting' && 'Opening Envelope...'}
              {phase === 'verified' && 'Integrity Verified'}
            </p>
            <p className="text-xs text-[#334155] font-mono">vault_id={vxId}</p>
          </div>
          {progress > 0 && progress < 100 && (
            <div className="ml-auto flex items-center gap-3">
              <div className="h-1.5 w-24 rounded-full bg-[#334155]/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#2C3892] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs tabular-nums text-[#334155]">{progress}%</span>
            </div>
          )}
        </div>

        {/* Content area */}
        <div className="p-6 space-y-5">

          {/* PII Fields — editable when idle */}
          {phase === 'idle' && (
            <div className="space-y-3">
              <div>
                <label htmlFor="vd-name" className="block text-xs font-semibold uppercase tracking-wide text-[#334155] mb-1.5">
                  Full Name
                </label>
                <input
                  id="vd-name"
                  type="text"
                  value={pii.name}
                  onChange={e => setPii(p => ({ ...p, name: e.target.value }))}
                  placeholder="Taylor Chen"
                  className="w-full rounded-xl border border-[#334155]/20 bg-[#EFEFED] px-4 py-3 text-sm text-[#0F172A] placeholder-[#334155]/40 focus:outline-none focus:ring-2 focus:ring-[#2C3892]/30 focus:border-[#2C3892] transition-all"
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="vd-email" className="block text-xs font-semibold uppercase tracking-wide text-[#334155] mb-1.5">
                  Email Address
                </label>
                <input
                  id="vd-email"
                  type="email"
                  value={pii.email}
                  onChange={e => setPii(p => ({ ...p, email: e.target.value }))}
                  placeholder="taylor@provider.com"
                  className="w-full rounded-xl border border-[#334155]/20 bg-[#EFEFED] px-4 py-3 text-sm text-[#0F172A] placeholder-[#334155]/40 focus:outline-none focus:ring-2 focus:ring-[#2C3892]/30 focus:border-[#2C3892] transition-all"
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="vd-phone" className="block text-xs font-semibold uppercase tracking-wide text-[#334155] mb-1.5">
                  Phone Number
                </label>
                <input
                  id="vd-phone"
                  type="tel"
                  value={pii.phone}
                  onChange={e => setPii(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+1 555 0100"
                  className="w-full rounded-xl border border-[#334155]/20 bg-[#EFEFED] px-4 py-3 text-sm text-[#0F172A] placeholder-[#334155]/40 focus:outline-none focus:ring-2 focus:ring-[#2C3892]/30 focus:border-[#2C3892] transition-all"
                  autoComplete="tel"
                />
              </div>
            </div>
          )}

          {/* Field view — shown after encrypting starts */}
          {(phase === 'encrypting' || phase === 'encrypted' || phase === 'decrypting' || phase === 'verified') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-bold uppercase tracking-wide text-[#334155]">
                  {phase === 'verified' ? 'Recovered Data' : 'Sealed Fields'}
                </p>
                {phase === 'encrypted' && <span className="text-xs text-[#2C3892] font-mono flex items-center gap-1"><Lock className="w-3 h-3" /> AES-256-GCM</span>}
                {phase === 'verified' && <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> AEAD OK</span>}
              </div>
              <DataCard label="Full Name" value={pii.name} masked={phase === 'encrypted'} />
              <DataCard label="Email Address" value={pii.email} masked={phase === 'encrypted'} />
              <DataCard label="Phone Number" value={pii.phone} masked={phase === 'encrypted'} />
            </div>
          )}

          {/* DEK info — shown during/after encryption */}
          {(phase === 'encrypting' || phase === 'encrypted') && (
            <DataCard label="DEK Reference" value={`${dekId} (stored in KMS HSM, never in plaintext)`} accent="#2C3892" />
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">

            {phase === 'idle' && (
              <button
                onClick={startEncrypt}
                disabled={!canEncrypt}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  canEncrypt
                    ? 'bg-[#2C3892] text-white hover:bg-[#2336a0] focus:ring-[#2C3892] active:scale-[0.97] shadow-md'
                    : 'bg-[#334155]/10 text-[#334155]/40 cursor-not-allowed'
                }`}
              >
                <Lock className="w-4 h-4" />
                Encrypt & Seal Vault
              </button>
            )}

            {phase === 'encrypted' && (
              <button
                onClick={startDecrypt}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#23698C] text-white px-6 py-3.5 text-sm font-bold hover:bg-[#1e5a77] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#23698C] focus:ring-offset-2 active:scale-[0.97] shadow-md"
              >
                <Unlock className="w-4 h-4" />
                Decrypt with DEK
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {phase === 'verified' && (
              <div className="flex-1 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-6 py-3.5 text-sm font-bold text-emerald-700">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                All fields authenticated
              </div>
            )}

            {(phase === 'encrypted' || phase === 'verified') && (
              <button
                onClick={reset}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#334155]/20 text-[#334155] px-4 py-3.5 text-sm font-semibold hover:bg-[#EFEFED] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2C3892] active:scale-[0.97] sm:shrink-0"
              >
                <RefreshCw className="w-4 h-4" />
                Start over
              </button>
            )}
          </div>
        </div>
      </div>

      {/* What is Envelope Encryption? explainer */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold uppercase tracking-wide text-[#334155]">How envelope encryption works</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              num: '1',
              title: 'PII collected',
              body: 'Name, email, and phone are the plaintext data to protect.',
              icon: <Eye className="w-5 h-5 text-[#336655]" />,
              bg: 'bg-[#EFEFED]',
              accent: '#334155',
            },
            {
              num: '2',
              title: 'DEK generated',
              body: 'A unique AES-256 key encrypts the data. The DEK lives in a hardware HSM and never leaves it.',
              icon: <Lock className="w-5 h-5 text-[#2C3892]" />,
              bg: 'bg-[#2C3892]/5',
              accent: '#2C3892',
            },
            {
              num: '3',
              title: 'VaultAccessLog',
              body: 'An immutable audit log records access events — who, when, and outcome — for compliance.',
              icon: <Clock className="w-5 h-5 text-[#23698C]" />,
              bg: 'bg-[#23698C]/5',
              accent: '#23698C',
            },
          ].map(item => (
            <div key={item.num} className={`rounded-xl border border-[${item.accent}]/20 p-4 bg-white`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center`}>{item.icon}</div>
                <div>
                  <p className="text-xs font-bold text-[#334155]">{item.num}. {item.title}</p>
                </div>
              </div>
              <p className="text-xs text-[#334155]/70 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Audit log */}
      <div className="rounded-2xl border border-[#334155]/20 bg-white overflow-hidden">
        <button
          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#EFEFED]/50 transition-colors"
          onClick={() => setShowLog(s => !s)}
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#334155]/60" />
            <span className="text-sm font-semibold text-[#0F172A]">Audit Log</span>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#2C3892] text-white text-xs font-bold">
              {log.length}
            </span>
          </div>
          <ChevronRight className={`w-4 h-4 text-[#334155]/40 transition-transform duration-200 ${showLog ? 'rotate-90' : ''}`} />
        </button>

        {showLog && (
          <div className="px-5 pb-5 space-y-4 border-t border-[#334155]/10 pt-4">
            {log.map((entry, i) => (
              <LogEntry key={i} entry={entry} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Demo footnote */}
      <p className="text-center text-xs text-[#334155]/50">
        This is a frontend demonstration. Production implementation uses a hardware KMS and ECDH key exchange.
      </p>
    </div>
  );
}
