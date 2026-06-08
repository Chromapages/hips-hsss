'use client';

import { useState, useCallback, memo } from 'react';
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
// Sub-components (memoized to prevent re-renders on parent state changes)
// ------------------------------------------------------------------

const PhasePill = memo(function PhasePill({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300 ${
        active
          ? 'bg-primary text-white shadow-[0_0_12px_rgba(44,56,146,0.4)]'
          : 'bg-surface/5 text-text/40'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${active ? 'bg-emerald-400 animate-pulse' : 'bg-surface/20'}`} />
      {label}
    </span>
  );
});

const EncryptionIcon = memo(function EncryptionIcon({ state }: { state: Phase }) {
  const sizes = 'w-16 h-16';
  if (state === 'encrypting' || state === 'decrypting') {
    return (
      <div className={`${sizes} rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center`}>
        <RefreshCw className="w-7 h-7 text-accent animate-spin" />
      </div>
    );
  }
  if (state === 'encrypted') {
    return (
      <div className={`${sizes} rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center`}>
        <Lock className="w-7 h-7 text-primary" />
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
    <div className={`${sizes} rounded-2xl bg-bg-subtle/5 border border-border/20 flex items-center justify-center`}>
      <ShieldCheck className="w-7 h-7 text-text/40" />
    </div>
  );
});

const DataCard = memo(function DataCard({ label, value, masked, accent }: { label: string; value: string; masked?: boolean; accent?: string }) {
  return (
    <div className={`rounded-xl border p-4 transition-all duration-300 ${accent ? `border-[${accent}]/40 bg-[${accent}]/5` : 'border-white/10 bg-surface/5'}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40">{label}</p>
        {masked && <Lock className="w-3.5 h-3.5 text-accent mt-0.5" />}
      </div>
      <p className={`mt-2 font-mono text-sm break-all leading-relaxed ${masked ? 'text-text/50' : 'text-white'}`}>
        {value || '—'}
      </p>
    </div>
  );
});

const LogEntry = memo(function LogEntry({ entry, index }: { entry: AuditEntry; index: number }) {
  const colors = {
    encrypt: { border: 'border-primary/40', bg: 'bg-primary/10', dot: 'bg-primary', label: 'text-primary', icon: '🔐' },
    decrypt: { border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', dot: 'bg-emerald-400', label: 'text-emerald-400', icon: '🔓' },
    access: { border: 'border-border/20', bg: 'bg-surface/5', dot: 'bg-bg-subtle/40', label: 'text-text/60', icon: '👤' },
  }[entry.action];

  return (
    <div
      className="relative flex items-start gap-3 pl-4"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Timeline line */}
      {index > 0 && (
        <div className="absolute -top-4 left-[7px] w-px bg-surface/10" style={{ height: '16px' }} />
      )}
      {/* Dot */}
      <div className={`mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 ${colors.border} ${colors.dot}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold">{entry.icon} {entry.detail}</span>
          <span className="text-xs tabular-nums text-text/30 shrink-0">{entry.ts}</span>
        </div>
        <p className="text-xs text-text/40 mt-0.5">{entry.meta}</p>
      </div>
    </div>
  );
});

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
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Identity Vault · Phase 1C
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-text">
          Envelope Encryption Demo
        </h2>
        <p className="text-sm text-text-muted max-w-sm mx-auto leading-relaxed">
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
      <div className="rounded-2xl border border-border/20 bg-surface shadow-xl overflow-hidden">

        {/* Vault icon + status header */}
        <div className="flex items-center gap-4 bg-bg-subtle px-6 py-4 border-b border-border/10">
          <EncryptionIcon state={phase} />
          <div>
            <p className="text-sm font-bold text-text">
              {phase === 'idle' && 'Vault Ready'}
              {phase === 'encrypting' && 'Encrypting...'}
              {phase === 'encrypted' && 'Data Sealed'}
              {phase === 'decrypting' && 'Opening Envelope...'}
              {phase === 'verified' && 'Integrity Verified'}
            </p>
            <p className="text-xs text-text-muted font-mono">vault_id={vxId}</p>
          </div>
          {progress > 0 && progress < 100 && (
            <div className="ml-auto flex items-center gap-3">
              <div className="h-1.5 w-24 rounded-full bg-text-muted/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs tabular-nums text-text-muted">{progress}%</span>
            </div>
          )}
        </div>

        {/* Content area */}
        <div className="p-6 space-y-5">

          {/* PII Fields — editable when idle */}
          {phase === 'idle' && (
            <div className="space-y-3">
              <div>
                <label htmlFor="vd-name" className="block text-xs font-semibold uppercase tracking-wide text-text-muted mb-1.5">
                  Full Name
                </label>
                <input
                  id="vd-name"
                  type="text"
                  value={pii.name}
                  onChange={e => setPii(p => ({ ...p, name: e.target.value }))}
                  placeholder="Taylor Chen"
                  className="w-full rounded-xl border border-border/20 bg-bg-subtle px-4 py-3 text-sm text-text placeholder:text-text-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="vd-email" className="block text-xs font-semibold uppercase tracking-wide text-text-muted mb-1.5">
                  Email Address
                </label>
                <input
                  id="vd-email"
                  type="email"
                  value={pii.email}
                  onChange={e => setPii(p => ({ ...p, email: e.target.value }))}
                  placeholder="taylor@provider.com"
                  className="w-full rounded-xl border border-border/20 bg-bg-subtle px-4 py-3 text-sm text-text placeholder:text-text-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="vd-phone" className="block text-xs font-semibold uppercase tracking-wide text-text-muted mb-1.5">
                  Phone Number
                </label>
                <input
                  id="vd-phone"
                  type="tel"
                  value={pii.phone}
                  onChange={e => setPii(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+1 555 0100"
                  className="w-full rounded-xl border border-border/20 bg-bg-subtle px-4 py-3 text-sm text-text placeholder:text-text-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  autoComplete="tel"
                />
              </div>
            </div>
          )}

          {/* Field view — shown after encrypting starts */}
          {(phase === 'encrypting' || phase === 'encrypted' || phase === 'decrypting' || phase === 'verified') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-bold uppercase tracking-wide text-text-muted">
                  {phase === 'verified' ? 'Recovered Data' : 'Sealed Fields'}
                </p>
                {phase === 'encrypted' && <span className="text-xs text-primary font-mono flex items-center gap-1"><Lock className="w-3 h-3" /> AES-256-GCM</span>}
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
                    ? 'bg-primary text-white hover:bg-primary focus:ring-primary active:scale-[0.97] shadow-md'
                    : 'bg-text-muted/10 text-text-muted/40 cursor-not-allowed'
                }`}
              >
                <Lock className="w-4 h-4" />
                Encrypt & Seal Vault
              </button>
            )}

            {phase === 'encrypted' && (
              <button
                onClick={startDecrypt}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-accent text-white px-6 py-3.5 text-sm font-bold hover:bg-accent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 active:scale-[0.97] shadow-md"
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
                className="flex items-center justify-center gap-2 rounded-xl border border-border/20 text-text-muted px-4 py-3.5 text-sm font-semibold hover:bg-bg-subtle transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary active:scale-[0.97] sm:shrink-0"
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
        <h3 className="text-sm font-bold uppercase tracking-wide text-text-muted">How envelope encryption works</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              num: '1',
              title: 'PII collected',
              body: 'Name, email, and phone are the plaintext data to protect.',
              icon: <Eye className="w-5 h-5 text-success" />,
              bg: 'bg-bg-subtle',
              accent: '#334155',
            },
            {
              num: '2',
              title: 'DEK generated',
              body: 'A unique AES-256 key encrypts the data. The DEK lives in a hardware HSM and never leaves it.',
              icon: <Lock className="w-5 h-5 text-primary" />,
              bg: 'bg-primary/5',
              accent: '#2C3892',
            },
            {
              num: '3',
              title: 'VaultAccessLog',
              body: 'An immutable audit log records access events — who, when, and outcome — for compliance.',
              icon: <Clock className="w-5 h-5 text-accent" />,
              bg: 'bg-accent/5',
              accent: '#23698C',
            },
          ].map(item => (
            <div key={item.num} className={`rounded-xl border border-[${item.accent}]/20 p-4 bg-surface`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center`}>{item.icon}</div>
                <div>
                  <p className="text-xs font-bold text-text-muted">{item.num}. {item.title}</p>
                </div>
              </div>
              <p className="text-xs text-text-muted/70 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Audit log */}
      <div className="rounded-2xl border border-border/20 bg-surface overflow-hidden">
        <button
          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-bg-subtle/50 transition-colors"
          onClick={() => setShowLog(s => !s)}
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-text-muted/60" />
            <span className="text-sm font-semibold text-text">Audit Log</span>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs font-bold">
              {log.length}
            </span>
          </div>
          <ChevronRight className={`w-4 h-4 text-text-muted/40 transition-transform duration-200 ${showLog ? 'rotate-90' : ''}`} />
        </button>

        {showLog && (
          <div className="px-5 pb-5 space-y-4 border-t border-border/10 pt-4">
            {log.map((entry, i) => (
              <LogEntry key={i} entry={entry} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Demo footnote */}
      <p className="text-center text-xs text-text-muted/50">
        This is a frontend demonstration. Production implementation uses a hardware KMS and ECDH key exchange.
      </p>
    </div>
  );
}
