'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { screenLabels, voiceMaskActiveStyle } from './demo-utils';
import { Mic, MicOff, Hand, Flag, PhoneOff } from 'lucide-react';

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
      <div className="flex items-center gap-2 sm:gap-3 p-2 rounded-3xl border border-white/10 bg-white/[0.03]">
        <button
          id="btn-mute"
          onClick={onToggleMute}
          aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          aria-pressed={isMuted}
          className={`ctrl-btn flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border font-bold transition-all hover:bg-white/10 ${
            isMuted
              ? 'bg-red-500/10 border-red-500/30 text-red-300'
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
          className={`ctrl-btn flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border font-bold transition-all hover:bg-white/10 ${
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
          className="ctrl-btn flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border border-white/10 font-bold transition-all hover:bg-white/10 text-white"
        >
          <Flag className="w-5 h-5" />
          <span className="text-sm sm:text-base">Flag</span>
        </button>

        <button
          onClick={onLeave}
          aria-label="Leave the session"
          className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-red-600 text-white font-bold transition-all hover:bg-red-500 ml-0 sm:ml-3 leave-btn"
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
        <h3 id="flag-modal-title" className="text-xl sm:text-2xl font-black mb-2">
          🚨 Flag Safety Concern
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          Describe what is happening. A facilitator will be notified immediately.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Describe the safety concern..."
          className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 mb-4"
          aria-label="Describe the safety concern"
        />
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-white/10 font-bold hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
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
        <h3 id="leave-modal-title" className="text-xl sm:text-2xl font-black mb-2">
          Leave this session?
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          Your audio will stop and you will return to the dashboard.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-white/10 font-bold hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
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
        <h2 className="text-3xl sm:text-4xl font-black mb-3">Session Complete</h2>
        <p className="text-slate-400 mb-8 text-sm sm:text-base">
          Your session has ended. Here is what happened:
        </p>

        <div className="text-left rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-6 space-y-4 mb-8">
          <div className="flex justify-between">
            <span className="text-slate-400 text-sm">Anonymous ID</span>
            <span className="font-mono text-indigo-300">{anonId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 text-sm">Duration</span>
            <span className="text-white">{duration}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 text-sm">Recording</span>
            <span className="text-emerald-400">None — as promised</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 text-sm">Data correlation</span>
            <span className="text-emerald-400">Zero — hard anonymity</span>
          </div>
        </div>

        <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 mb-8">
          <p className="text-sm text-indigo-200">
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
        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full spin mx-auto mb-6" />
        <h2 className="text-2xl sm:text-3xl font-black mb-3">
          Preparing your anonymous room...
        </h2>
        <p className="text-slate-400 mb-4 text-sm sm:text-base">
          Connecting to LiveKit servers
        </p>
        <p className="font-mono text-sm text-indigo-300">Room: demo-room-hips</p>
        <p className="font-mono text-xs text-slate-500 mt-2">{anonId}</p>
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

  const requestMic = async () => {
    setMicStatus('requesting');
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStatus('ready');
      onMicReady();
    } catch {
      setMicStatus('denied');
    }
  };

  return (
    <div className="screen flex-col items-center justify-center min-h-screen px-4 sm:px-6">
      <div className="fade-in max-w-xl w-full">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-4 text-center">
          Step 1 of 2
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 text-center">
          Set up your microphone
        </h2>
        <p className="text-slate-400 text-center mb-8 text-sm sm:text-base">
          We need microphone access to connect you to the session with voice
          masking enabled.
        </p>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-6 mb-8">
          <h3 className="font-semibold text-indigo-200 mb-2">
            🎭 Voice Masking Preview
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            Your voice will be pitch-shifted so it is not recognizable. Here is
            what it sounds like:
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="btn-secondary flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
              🔊 Hear Original
            </button>
            <button className="btn-secondary flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
              🎭 Hear Masked
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
          <p className="mt-4 text-center text-red-400 text-sm">
            Microphone access denied. Please enable it in your browser settings.
          </p>
        )}

        <button
          onClick={onBack}
          className="mt-4 text-sm text-slate-500 hover:text-white rounded-md px-4 py-2"
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-black">
            H
          </div>
          <span className="text-2xl font-black tracking-tight">H.I.P.S.</span>
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-4">
          Anonymous Peer Support
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
          Your voice will be masked.<br />Your identity stays hidden.
        </h1>
        <p className="text-base sm:text-lg text-slate-400 mb-10 max-w-lg mx-auto leading-relaxed">
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
        <div className="mt-10 flex items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-2">🔒 Zero data correlation</span>
          <span className="flex items-center gap-2">🛡️ Safety engine active</span>
          <span className="flex items-center gap-2">🚫 No recording</span>
        </div>
        <p className="mt-6 text-xs text-slate-600">
          We never store your voice and identity together.
        </p>
      </div>
    </div>
  );
}