'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { screenLabels, voiceMaskActiveStyle } from './demo-utils';
import { Mic, MicOff, Hand, Flag, PhoneOff } from 'lucide-react';
import { VOICE_PRESETS } from '@/lib/voice-mask-presets';
import { getBrowserMediaDevices } from '@/lib/browser-media';

interface SessionControlsProps {
  isMuted: boolean;
  isHandRaised: boolean;
  onToggleMute: () => void;
  onToggleHand: () => void;
  onFlag: () => void;
  onLeave: () => void;
}

export function SessionControls({
  isMuted,
  isHandRaised,
  onToggleMute,
  onToggleHand,
  onFlag,
  onLeave,
}: SessionControlsProps) {
  return (
    <footer className="flex items-center justify-center px-4 sm:px-6 py-4 sm:py-5 border-t border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="flex items-center gap-2 sm:gap-3 p-2 rounded-3xl border border-white/10 bg-surface/[0.03]">
        <button
          id="btn-mute"
          onClick={onToggleMute}
          aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          aria-pressed={isMuted}
          className={`ctrl-btn flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border font-bold transition-all hover:bg-surface/10 ${
            isMuted
              ? 'bg-destructive/10 border-destructive/30 text-destructive'
              : 'border-white/10 text-white'
          }`}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          <span className="text-sm sm:text-base">{isMuted ? 'Unmute' : 'Mute'}</span>
        </button>

        <button
          id="btn-hand"
          onClick={onToggleHand}
          aria-label={isHandRaised ? 'Lower hand' : 'Raise hand for facilitator attention'}
          aria-pressed={isHandRaised}
          className={`ctrl-btn flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border font-bold transition-all hover:bg-surface/10 ${
            isHandRaised
              ? 'bg-amber-500/15 border-amber-500/50 text-amber-200'
              : 'border-white/10 text-white'
          }`}
        >
          <Hand className="w-5 h-5" />
          <span className="text-sm sm:text-base">Raise Hand</span>
        </button>

        <button
          onClick={onFlag}
          aria-label="Flag a safety concern"
          className="ctrl-btn flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border border-white/10 font-bold transition-all hover:bg-surface/10 text-white"
        >
          <Flag className="w-5 h-5" />
          <span className="text-sm sm:text-base">Flag</span>
        </button>

        <button
          onClick={onLeave}
          aria-label="Leave the session"
          className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-destructive text-white font-bold transition-all hover:bg-destructive/80 ml-0 sm:ml-3 leave-btn"
        >
          <PhoneOff className="w-5 h-5" />
          <span className="text-sm sm:text-base">Leave</span>
        </button>
      </div>
    </footer>
  );
}

interface FlagModalProps {
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export function FlagModal({ onClose, onSubmit }: FlagModalProps) {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    onSubmit(reason);
    setReason('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="flag-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl px-4 sm:px-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-zinc-950 p-6 sm:p-8">
        <h3 id="flag-modal-title" className="font-heading text-xl sm:text-2xl font-extrabold mb-2">
          🚨 Flag Safety Concern
        </h3>
        <p className="text-sm text-text-muted mb-6">
          Describe what is happening. A facilitator will be notified immediately.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Describe the safety concern..."
          className="w-full h-32 bg-surface/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 mb-4"
          aria-label="Describe the safety concern"
        />
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-white/10 font-bold hover:bg-surface/5 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl bg-destructive text-white font-bold hover:bg-destructive/80 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Submit Flag
          </button>
        </div>
      </div>
    </div>
  );
}

interface LeaveModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export function LeaveModal({ onClose, onConfirm }: LeaveModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="leave-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl px-4 sm:px-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-zinc-950 p-6 sm:p-8">
        <h3 id="leave-modal-title" className="font-heading text-xl sm:text-2xl font-extrabold mb-2">
          Leave this session?
        </h3>
        <p className="text-sm text-text-muted mb-6">
          Your audio will stop and you will return to the dashboard.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-white/10 font-bold hover:bg-surface/5 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-destructive text-white font-bold hover:bg-destructive/80 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Leave Session
          </button>
        </div>
      </div>
    </div>
  );
}

interface SummaryScreenProps {
  anonId: string;
  duration: string;
  onReset: () => void;
}

export function SummaryScreen({ anonId, duration, onReset }: SummaryScreenProps) {
  return (
    <div className="screen flex-col items-center justify-center min-h-screen px-4 sm:px-6 active">
      <div className="fade-in max-w-md text-center">
        <div className="text-5xl sm:text-6xl mb-6">✅</div>
        <h2 className="font-heading text-3xl sm:text-4xl font-extrabold mb-3">Session Complete</h2>
        <p className="text-text-muted mb-8 text-sm sm:text-base">
          Your session has ended. Here is what happened:
        </p>

        <div className="text-left rounded-2xl border border-white/10 bg-surface/[0.03] p-4 sm:p-6 space-y-4 mb-8">
          <div className="flex justify-between">
            <span className="text-text-muted text-sm">Anonymous ID</span>
            <span className="font-mono text-text">{anonId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted text-sm">Duration</span>
            <span className="text-white">{duration}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted text-sm">Recording</span>
            <span className="text-emerald-400">None — as promised</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted text-sm">Data correlation</span>
            <span className="text-emerald-400">Zero — hard anonymity</span>
          </div>
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-8">
          <p className="text-sm text-text">
            🛡️ Your identity was never stored with your voice. The session DB
            only knew your anonymous token — never your billing identity.
          </p>
        </div>

        <button
          onClick={onReset}
          aria-label="Return to home screen"
          className="btn-primary w-full text-white font-bold py-4 rounded-xl text-base sm:text-lg"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

interface ConnectingScreenProps {
  anonId: string;
}

export function ConnectingScreen({ anonId }: ConnectingScreenProps) {
  return (
    <div className="screen flex-col items-center justify-center min-h-screen px-4 sm:px-6">
      <div className="fade-in text-center">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-[#173B57] rounded-full spin mx-auto mb-6" />
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold mb-3">
          Preparing your anonymous room...
        </h2>
        <p className="text-text-muted mb-4 text-sm sm:text-base">
          Connecting to LiveKit servers
        </p>
        <p className="font-mono text-sm text-text">Room: demo-room-hips</p>
        <p className="font-mono text-xs text-text-muted mt-2">{anonId}</p>
      </div>
    </div>
  );
}

interface MicSetupScreenProps {
  onBack: () => void;
  onMicReady: () => void;
}

export function MicSetupScreen({ onBack, onMicReady }: MicSetupScreenProps) {
  const [micStatus, setMicStatus] = useState<'idle' | 'requesting' | 'ready' | 'denied'>('idle');
  // Track active preview so clicking the same button stops it
  const [previewing, setPreviewing] = useState<'original' | 'masked' | null>(null);
  const previewContextRef = useRef<AudioContext | null>(null);
  const previewStreamRef = useRef<MediaStream | null>(null);

  const stopPreview = useCallback(() => {
    if (previewStreamRef.current) {
      previewStreamRef.current.getTracks().forEach((t) => t.stop());
      previewStreamRef.current = null;
    }
    if (previewContextRef.current) {
      previewContextRef.current.close();
      previewContextRef.current = null;
    }
    setPreviewing(null);
  }, []);

  // Inline pitch-shift worklet for the masked preview.
  // Mirrors the original simple mic-test path so preview playback stays local.
  const pitchShiftWorkletSrc = `
class PitchShiftPreview extends AudioWorkletProcessor {
  constructor() {
    super();
    this.ratio = Math.pow(2, 4 / 12); // +4 semitones
    this.BUF_SIZE = 2048;
    this.MASK = this.BUF_SIZE - 1;
    this.HALF = this.BUF_SIZE >> 1;
    this.buf = new Float32Array(this.BUF_SIZE);
    this.wp = 0;
    this.baseRp = 0;
    this.frac = 0;
  }
  lerp(pos) {
    const i0 = Math.floor(pos) & this.MASK;
    const i1 = (i0 + 1) & this.MASK;
    const f = pos - Math.floor(pos);
    return this.buf[i0] * (1 - f) + this.buf[i1] * f;
  }
  win(n) {
    return 0.5 * (1 - Math.cos(6.2831853 * n / this.HALF));
  }
  process(inputs, outputs) {
    const src = inputs[0]?.[0];
    const dst = outputs[0]?.[0];
    if (!src || !dst) return true;
    for (let i = 0; i < src.length; i++) {
      this.buf[this.wp & this.MASK] = src[i];
      this.wp++;
      this.frac += this.ratio;
      if (this.frac >= 1) {
        this.baseRp += Math.floor(this.frac);
        this.frac -= Math.floor(this.frac);
      }
      const rp0 = this.baseRp & this.MASK;
      dst[i] = this.lerp(this.baseRp) * this.win(rp0)
             + this.lerp((this.baseRp + this.HALF) & this.MASK) * this.win((this.baseRp + this.HALF) & this.MASK);
      if (this.baseRp > this.BUF_SIZE * 16) this.baseRp -= this.BUF_SIZE * 16;
    }
    return true;
  }
}
registerProcessor('pitch-shift-preview', PitchShiftPreview);
`;

  const startOriginalPreview = async () => {
    if (previewing === 'original') { stopPreview(); return; }
    stopPreview();
    try {
      const stream = await getBrowserMediaDevices().getUserMedia({ audio: true });
      previewStreamRef.current = stream;
      const ctx = new AudioContext();
      previewContextRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(ctx.destination);
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      setPreviewing('original');
    } catch (err) {
      console.warn('[MicSetupScreen] Original preview failed:', err);
    }
  };

  const startMaskedPreview = async () => {
    if (previewing === 'masked') { stopPreview(); return; }
    stopPreview();
    try {
      const stream = await getBrowserMediaDevices().getUserMedia({ audio: true });
      previewStreamRef.current = stream;
      const ctx = new AudioContext();
      previewContextRef.current = ctx;
      const blob = new Blob([pitchShiftWorkletSrc], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      try {
        await ctx.audioWorklet.addModule(url);
      } finally {
        URL.revokeObjectURL(url);
      }
      const source = ctx.createMediaStreamSource(stream);
      const worklet = new AudioWorkletNode(ctx, 'pitch-shift-preview');
      source.connect(worklet);
      worklet.connect(ctx.destination);
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      setPreviewing('masked');
    } catch (err) {
      console.warn('[MicSetupScreen] Masked preview failed:', err);
    }
  };

  // Stop preview when component unmounts or micStatus changes
  useEffect(() => {
    return () => stopPreview();
  }, [stopPreview]);

  const requestMic = async () => {
    stopPreview();
    setMicStatus('requesting');
    try {
      await getBrowserMediaDevices().getUserMedia({ audio: true });
      setMicStatus('ready');
      onMicReady();
    } catch {
      setMicStatus('denied');
    }
  };

  return (
    <div className="screen flex-col items-center justify-center min-h-screen px-4 sm:px-6">
      <div className="fade-in max-w-xl w-full">
        <p className="text-xs font-bold uppercase tracking-widest text-text mb-4 text-center">
          Step 1 of 2
        </p>
        <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 text-center">
          Set up your microphone
        </h2>
        <p className="text-text-muted text-center mb-8 text-sm sm:text-base">
          We need microphone access to connect you to the session with voice
          masking enabled.
        </p>

        <div className="rounded-xl border border-white/10 bg-surface/[0.02] p-4 sm:p-6 mb-8">
          <h3 className="font-semibold text-text mb-2">
            🎭 Voice Masking Preview
          </h3>
          <p className="text-sm text-text-muted mb-4">
            Your voice will be pitch-shifted so it is not recognizable. Here is
            what it sounds like:
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={startOriginalPreview}
              className={[
                'btn-secondary flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all',
                previewing === 'original'
                  ? 'border-primary/40 bg-primary/20 text-primary'
                  : '',
              ].join(' ')}
            >
              🔊 {previewing === 'original' ? 'Stop' : 'Hear Original'}
            </button>
            <button
              onClick={startMaskedPreview}
              className={[
                'btn-secondary flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all',
                previewing === 'masked'
                  ? 'border-primary/40 bg-primary/20 text-primary'
                  : '',
              ].join(' ')}
            >
              🎭 {previewing === 'masked' ? 'Stop' : 'Hear Masked'}
            </button>
          </div>
        </div>

        <button
          onClick={requestMic}
          disabled={micStatus === 'requesting'}
          className="btn-primary w-full text-white font-bold py-4 rounded-xl text-base sm:text-lg"
        >
          {micStatus === 'requesting'
            ? 'Requesting...'
            : micStatus === 'ready'
            ? '✓ Microphone ready'
            : 'Allow Microphone Access'}
        </button>

        {micStatus === 'denied' && (
          <p className="mt-4 text-center text-destructive text-sm">
            Microphone access denied. Please enable it in your browser settings.
          </p>
        )}

        <button
          onClick={onBack}
          className="mt-4 text-sm text-text-muted hover:text-white rounded-md px-4 py-2"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

interface LandingScreenProps {
  onStart: () => void;
}

export function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <div className="screen active flex-col items-center justify-center min-h-screen px-4 sm:px-6 text-center">
      <div className="fade-in max-w-2xl">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#173B57] to-gold flex items-center justify-center text-2xl font-bold">
            H
          </div>
          <span className="text-2xl font-bold tracking-tight">H.I.P.S.</span>
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-text mb-4">
          Anonymous Peer Support
        </p>
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
          Your voice will be masked.<br />Your identity stays hidden.
        </h1>
        <p className="text-base sm:text-lg text-text-muted mb-10 max-w-lg mx-auto leading-relaxed">
          Press start to enter a private peer support session. Your voice is
          pitch-shifted in real-time so it cannot be recognized. No recording.
          No correlation.
        </p>
        <button
          onClick={onStart}
          aria-label="Start anonymous peer support session"
          className="btn-primary text-white font-bold text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 rounded-xl"
        >
          🎤 Start Session
        </button>
        <div className="mt-10 flex items-center justify-center gap-4 sm:gap-6 text-xs text-text-muted">
          <span className="flex items-center gap-2">🔒 Zero data correlation</span>
          <span className="flex items-center gap-2">🛡️ Safety engine active</span>
          <span className="flex items-center gap-2">🚫 No recording</span>
        </div>
        <p className="mt-6 text-xs text-text-muted">
          We never store your voice and identity together.
        </p>
      </div>
    </div>
  );
}
