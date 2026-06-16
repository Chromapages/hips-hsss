'use client';

import dynamic from 'next/dynamic';
import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RefreshCw,
  ArrowRight,
  Shield,
  Loader2,
  Check,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { Track } from 'livekit-client';
import { createVoiceMaskProcessor } from '@/lib/voice-mask-processor';
import type { VoicePreset } from '@/lib/voice-mask-presets';

// ─── Heavy 3D canvas — lazy-loaded, no SSR ───────────────────────────────────
const AvatarPreviewCanvas = dynamic(
  () => import('@/components/host/AvatarPreviewCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#030712]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    ),
  },
);

// ─── Avatar colour presets (matches host setup page) ─────────────────────────
interface AvatarPreset {
  id: string;
  label: string;
  hex: string;
  style: number;
}

const AVATAR_PRESETS: AvatarPreset[] = [
  { id: 'indigo',  label: 'Indigo',  hex: '#6366F1', style: 0 },
  { id: 'gold',    label: 'Gold',    hex: '#C59A35', style: 1 },
  { id: 'emerald', label: 'Emerald', hex: '#10B981', style: 2 },
  { id: 'rose',    label: 'Rose',    hex: '#F43F5E', style: 3 },
  { id: 'sky',     label: 'Sky',     hex: '#0EA5E9', style: 4 },
  { id: 'violet',  label: 'Violet',  hex: '#8B5CF6', style: 5 },
  { id: 'amber',   label: 'Amber',   hex: '#FBBF24', style: 6 },
  { id: 'navy',    label: 'Navy',    hex: '#173B57', style: 7 },
];

// ─── Voice preset config for UI ──────────────────────────────────────────────
interface VoicePresetOption {
  id: VoicePreset;
  label: string;
  description: string;
  icon: string;
  semitones: number;
}

const VOICE_PRESETS: VoicePresetOption[] = [
  { id: 'subtle',  label: 'Subtle',  description: 'Natural anonymisation, slight pitch shift',       icon: '🎙️', semitones: 4  },
  { id: 'deep',    label: 'Deep',    description: 'Lower register — commanding & authoritative',      icon: '🔊', semitones: -4 },
  { id: 'high',    label: 'High',    description: 'Raised pitch — lighter, softer presence',          icon: '🎵', semitones: 4  },
  { id: 'robotic', label: 'Robotic', description: 'Maximum anonymisation — intentionally uncanny',    icon: '🤖', semitones: 6  },
];

// ─── Mic permission state machine ────────────────────────────────────────────
type DemoPhase =
  | 'idle'          // initial state — show "Start Demo" CTA
  | 'requesting'    // waiting for mic permission dialog
  | 'denied'        // user denied mic access
  | 'processing'    // audio chain active, listening
  | 'error';        // unexpected error

// ─── Audio processor ref shape ───────────────────────────────────────────────
interface ProcessorRef {
  processor: ReturnType<typeof createVoiceMaskProcessor>;
  audioCtx: AudioContext;
  sourceTrack: MediaStreamTrack;
  playbackAudio: HTMLAudioElement;
}



export default function LiveDemoPage() {
  // Avatar state
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarPreset>(AVATAR_PRESETS[0]!);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Voice demo state
  const [phase, setPhase] = useState<DemoPhase>('idle');
  const [activePreset, setActivePreset] = useState<VoicePreset>('subtle');
  const [isMuted, setIsMuted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);

  // Refs — audio graph lives outside React state to avoid re-renders
  const procRef     = useRef<ProcessorRef | null>(null);
  const micStreamRef= useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef= useRef<number | null>(null);
  const dataRef     = useRef<Uint8Array | null>(null);
  const swappingRef = useRef(false);

  // Detect speaking from audio level
  useEffect(() => {
    if (phase !== 'processing') {
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(audioLevel > 0.08);
  }, [audioLevel, phase]);

  // ── Level meter animation loop ──────────────────────────────────────────────
  const startLevelLoop = useCallback((ctx: AudioContext, track: MediaStreamTrack) => {
    try {
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      const src = ctx.createMediaStreamSource(new MediaStream([track]));
      src.connect(analyser);
      analyserRef.current = analyser;
      dataRef.current = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));

      const tick = () => {
        analyserRef.current!.getByteFrequencyData(dataRef.current as Uint8Array<ArrayBuffer>);
        const avg = dataRef.current!.reduce((s, v) => s + v, 0) / dataRef.current!.length;
        setAudioLevel(Math.min(1, avg / 72));
        animFrameRef.current = requestAnimationFrame(tick);
      };
      animFrameRef.current = requestAnimationFrame(tick);
    } catch {
      // Level meter is cosmetic — ignore errors
    }
  }, []);

  const stopLevelLoop = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  // ── Tear down the entire audio graph ───────────────────────────────────────
  const destroyAudio = useCallback(async () => {
    stopLevelLoop();

    if (procRef.current) {
      const { processor, playbackAudio, audioCtx, sourceTrack } = procRef.current;
      playbackAudio.pause();
      playbackAudio.srcObject = null;
      try { await processor.destroy(); } catch { /* ignore */ }
      try { audioCtx.close(); } catch { /* ignore */ }
      sourceTrack.stop();
      procRef.current = null;
    }

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop());
      micStreamRef.current = null;
    }
  }, [stopLevelLoop]);

  // ── Start the demo — request mic, build audio chain ────────────────────────
  const handleStartDemo = useCallback(async () => {
    setPhase('requesting');
    setErrorMsg('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      micStreamRef.current = stream;

      const sourceTrack = stream.getAudioTracks()[0];
      if (!sourceTrack) throw new Error('No audio track available from microphone.');

      const audioCtx = new AudioContext();

      const processor = createVoiceMaskProcessor({ preset: activePreset, semitones: VOICE_PRESETS.find(p => p.id === activePreset)?.semitones ?? 4 });

      await processor.init({
        audioContext: audioCtx,
        track: sourceTrack,
        kind: Track.Kind.Audio,
      });

      if (!processor.processedTrack) throw new Error('Voice processor produced no output track.');

      const playbackAudio = new Audio();
      playbackAudio.srcObject = new MediaStream([processor.processedTrack]);
      // Mute by default so we don't feed back into the mic immediately
      playbackAudio.muted = false;
      await playbackAudio.play();

      procRef.current = { processor, audioCtx, sourceTrack, playbackAudio };

      startLevelLoop(audioCtx, sourceTrack);
      setPhase('processing');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);

      if (msg.toLowerCase().includes('permission') ||
          msg.toLowerCase().includes('denied') ||
          msg.toLowerCase().includes('notallowed')) {
        setPhase('denied');
      } else {
        setErrorMsg(msg);
        setPhase('error');
      }
    }
  }, [activePreset, startLevelLoop]);

  // ── Hot-swap voice preset without dropping the session ─────────────────────
  const handlePresetChange = useCallback(async (preset: VoicePreset) => {
    setActivePreset(preset);

    if (phase !== 'processing' || !procRef.current || swappingRef.current) return;

    swappingRef.current = true;
    const { audioCtx, sourceTrack, playbackAudio } = procRef.current;

    try {
      // Destroy old processor
      await procRef.current.processor.destroy();

      // Build new one with the same AudioContext
      const presetConfig = VOICE_PRESETS.find(p => p.id === preset);
      const newProcessor = createVoiceMaskProcessor({ preset, semitones: presetConfig?.semitones ?? 4 });

      await newProcessor.init({
        audioContext: audioCtx,
        track: sourceTrack,
        kind: Track.Kind.Audio,
      });

      if (!newProcessor.processedTrack) throw new Error('Processor swap produced no output track.');

      playbackAudio.srcObject = new MediaStream([newProcessor.processedTrack]);
      await playbackAudio.play();

      procRef.current = { processor: newProcessor, audioCtx, sourceTrack, playbackAudio };
    } catch (err) {
      console.error('[LiveDemo] Preset swap failed:', err);
    } finally {
      swappingRef.current = false;
    }
  }, [phase]);

  // ── Toggle mute on the playback element ────────────────────────────────────
  const handleToggleMute = useCallback(() => {
    if (!procRef.current) return;
    const newMuted = !isMuted;
    procRef.current.playbackAudio.muted = newMuted;
    setIsMuted(newMuted);
  }, [isMuted]);

  // ── Stop / reset demo ──────────────────────────────────────────────────────
  const handleStopDemo = useCallback(async () => {
    await destroyAudio();
    setPhase('idle');
    setIsMuted(false);
  }, [destroyAudio]);

  // ── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      destroyAudio();
    };
  }, [destroyAudio]);

  // ── Mic level bars (7 bars visual meter) ───────────────────────────────────
  const BAR_COUNT = 7;
  const levelBars = Array.from({ length: BAR_COUNT }, (_, i) => {
    const threshold = (i + 1) / BAR_COUNT;
    return audioLevel >= threshold;
  });

  return (
    <main id="main" tabIndex={-1} className="min-h-screen bg-[#030712] text-white">
      {/* ── Minimal nav bar ── */}
      <nav className="flex items-center justify-between border-b border-white/8 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-indigo-500/20 ring-1 ring-indigo-500/40 flex items-center justify-center">
            <Shield className="h-4 w-4 text-indigo-400" />
          </div>
          <span className="font-bold text-sm tracking-widest uppercase text-white/80 font-ui">
            H.I.P.S.
          </span>
          <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-300 border border-indigo-500/20">
            Live Demo
          </span>
        </div>
        <Link
          href="/book"
          className="flex items-center gap-1.5 rounded-xl bg-[#C59A35] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#A67F28] shadow-lg shadow-amber-500/20"
          aria-label="Book a real session"
        >
          Book a Session
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </nav>

      {/* ── Hero ── */}
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-6 text-center">
        <p className="brand-caps text-[11px] text-indigo-400 mb-4">
          Interactive Demonstration
        </p>
        <h1 className="font-heading text-4xl font-bold text-white md:text-5xl lg:text-6xl mb-4">
          Hiding In Plain Sight
        </h1>
        <p className="mx-auto max-w-xl text-base text-white/55 font-body leading-relaxed">
          Experience the two core privacy technologies that protect every H.I.P.S. session —
          your <strong className="text-white/80">3D anonymous avatar</strong> and real-time{' '}
          <strong className="text-white/80">voice masking</strong> — live, right here in your browser.
        </p>
      </section>

      {/* ── Main two-column demo layout ── */}
      <section className="mx-auto max-w-7xl px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* ═══ LEFT — Avatar Panel ═══ */}
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
            {/* Panel header */}
            <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 font-ui">Feature 1</p>
                <h2 className="text-base font-bold text-white mt-0.5">Anonymous 3D Avatar</h2>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Active</span>
              </div>
            </div>

            {/* 3D canvas */}
            <div
              className="relative"
              style={{ height: 380 }}
              aria-label="Live 3D avatar preview"
            >
              <AvatarPreviewCanvas
                color={selectedAvatar.hex}
                styleIndex={selectedAvatar.style}
                isSpeaking={isSpeaking}
              />

              {/* Speaking indicator overlay */}
              {isSpeaking && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-xl px-4 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">Speaking</span>
                </div>
              )}

              {/* "Your anonymous presence" label */}
              <div className="absolute top-4 left-4 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 px-3 py-1.5">
                <p className="text-[10px] text-white/50 font-ui tracking-widest uppercase">Your anonymous presence</p>
              </div>
            </div>
          </div>

          {/* Colour picker */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 font-ui mb-4">
              Choose Avatar Colour
            </p>
            <div
              className="grid grid-cols-8 gap-2.5"
              role="radiogroup"
              aria-label="Avatar colour presets"
            >
              {AVATAR_PRESETS.map((preset) => {
                const isSelected = selectedAvatar.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`${preset.label} avatar`}
                    tabIndex={0}
                    onClick={() => setSelectedAvatar(preset)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setSelectedAvatar(preset);
                    }}
                    className="relative aspect-square rounded-xl transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030712]"
                    style={{
                      backgroundColor: preset.hex,
                      boxShadow: isSelected
                        ? `0 0 0 2px #030712, 0 0 0 4px ${preset.hex}, 0 0 18px ${preset.hex}55`
                        : undefined,
                    }}
                  >
                    {isSelected && (
                      <Check className="absolute inset-0 m-auto h-3.5 w-3.5 text-white drop-shadow-md" aria-hidden="true" />
                    )}
                    <span className="sr-only">{preset.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-white/35 font-body">
              Selected: <strong className="text-white/60">{selectedAvatar.label}</strong>
              {' '}&mdash; no facial features, no identity, complete anonymity.
            </p>
          </div>

          {/* Avatar callout */}
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5 flex gap-3">
            <Shield className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-bold text-indigo-200 mb-1">Zero biometric data</p>
              <p className="text-xs text-white/45 font-body leading-relaxed">
                The avatar has no camera access and stores nothing. It&apos;s generated from a randomly
                assigned anonymous token per session — not from your likeness.
              </p>
            </div>
          </div>
        </div>

        {/* ═══ RIGHT — Voice Masking Panel ═══ */}
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
            {/* Panel header */}
            <div className="px-5 py-4 border-b border-white/8">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 font-ui">Feature 2</p>
              <h2 className="text-base font-bold text-white mt-0.5">Real-Time Voice Masking</h2>
            </div>

            <div className="p-5 space-y-6">

              {/* ── Step 1: Start / Stop button ── */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 font-ui mb-3">
                  Step 1 — Activate Microphone
                </p>

                {phase === 'idle' && (
                  <button
                    id="demo-start-btn"
                    type="button"
                    onClick={handleStartDemo}
                    aria-label="Start voice masking demonstration — requires microphone access"
                    className="w-full flex items-center justify-center gap-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 py-4 px-6 font-bold text-base text-white uppercase tracking-wider font-ui transition-all duration-200 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01]"
                  >
                    <Mic className="h-5 w-5" aria-hidden="true" />
                    Start Live Demo
                  </button>
                )}

                {phase === 'requesting' && (
                  <div className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 py-4 px-6">
                    <Loader2 className="h-5 w-5 animate-spin text-indigo-400" aria-hidden="true" />
                    <span className="text-sm font-bold text-white/70 uppercase tracking-wider font-ui">
                      Waiting for microphone permission…
                    </span>
                  </div>
                )}

                {phase === 'denied' && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4">
                      <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-bold text-amber-200">Microphone access denied</p>
                        <p className="text-xs text-amber-200/60 mt-1 font-body leading-relaxed">
                          To experience the voice mask, please allow microphone access in your browser
                          settings, then try again.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPhase('idle')}
                      aria-label="Try again"
                      className="w-full flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 py-3 px-6 text-sm font-bold text-white/70 uppercase tracking-wider font-ui hover:bg-white/10 transition-all"
                    >
                      <RefreshCw className="h-4 w-4" aria-hidden="true" />
                      Try Again
                    </button>
                  </div>
                )}

                {phase === 'error' && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 rounded-2xl border border-red-500/25 bg-red-500/10 p-4">
                      <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-bold text-red-200">Audio initialisation failed</p>
                        <p className="text-xs text-red-200/60 mt-1 font-body">{errorMsg}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPhase('idle')}
                      aria-label="Try again"
                      className="w-full flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 py-3 px-6 text-sm font-bold text-white/70 uppercase tracking-wider font-ui hover:bg-white/10 transition-all"
                    >
                      <RefreshCw className="h-4 w-4" aria-hidden="true" />
                      Try Again
                    </button>
                  </div>
                )}

                {phase === 'processing' && (
                  <div className="space-y-3">
                    {/* Active status row */}
                    <div className="flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-500/8 px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                        <span className="text-sm font-bold text-emerald-300 uppercase tracking-wider font-ui">
                          Voice Mask Active
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleToggleMute}
                          aria-label={isMuted ? 'Unmute playback' : 'Mute playback'}
                          className="flex items-center justify-center h-8 w-8 rounded-lg border border-white/15 hover:bg-white/10 transition-colors"
                        >
                          {isMuted
                            ? <VolumeX className="h-4 w-4 text-white/60" aria-hidden="true" />
                            : <Volume2 className="h-4 w-4 text-white/60" aria-hidden="true" />
                          }
                        </button>
                        <button
                          type="button"
                          onClick={handleStopDemo}
                          aria-label="Stop voice demo"
                          className="flex items-center justify-center h-8 w-8 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                        >
                          <MicOff className="h-4 w-4 text-red-400" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    {/* Level meter */}
                    <div className="rounded-xl bg-white/5 border border-white/8 px-4 py-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/35 font-ui">
                          Input Level
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/35 font-ui">
                          {isMuted ? 'Muted' : 'Live → Speaker'}
                        </p>
                      </div>
                      <div
                        className="flex items-end gap-1 h-8"
                        aria-label={`Microphone input level: ${Math.round(audioLevel * 100)}%`}
                        aria-live="polite"
                        aria-atomic="true"
                      >
                        {levelBars.map((active, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-sm transition-all duration-75"
                            style={{
                              height: `${20 + i * 12}%`,
                              backgroundColor: active
                                ? i < 4
                                  ? '#6366f1'
                                  : i < 6
                                  ? '#818cf8'
                                  : '#a5b4fc'
                                : 'rgba(255,255,255,0.07)',
                              boxShadow: active ? `0 0 6px ${i < 4 ? '#6366f1' : '#818cf8'}66` : undefined,
                            }}
                          />
                        ))}
                      </div>
                      <p className="mt-2 text-[10px] text-white/30 font-body">
                        Speak into your microphone — hear your anonymised voice through your speakers.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Step 2: Preset selector ── */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 font-ui mb-3">
                  Step 2 — Choose Voice Preset
                </p>
                <div
                  className="grid grid-cols-2 gap-2.5"
                  role="radiogroup"
                  aria-label="Voice masking presets"
                >
                  {VOICE_PRESETS.map((preset) => {
                    const isActive = activePreset === preset.id;
                    return (
                      <button
                        key={preset.id}
                        id={`preset-${preset.id}`}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        aria-label={`${preset.label} voice preset: ${preset.description}`}
                        tabIndex={0}
                        onClick={() => handlePresetChange(preset.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') handlePresetChange(preset.id);
                        }}
                        className={`relative text-left rounded-xl border p-3.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                          isActive
                            ? 'border-indigo-500/50 bg-indigo-500/12 shadow-lg shadow-indigo-500/10'
                            : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-lg leading-none" aria-hidden="true">{preset.icon}</span>
                          {isActive && (
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                          )}
                        </div>
                        <p className={`text-sm font-bold font-ui ${isActive ? 'text-indigo-200' : 'text-white/80'}`}>
                          {preset.label}
                        </p>
                        <p className="text-[10px] text-white/35 font-body mt-0.5 leading-relaxed">
                          {preset.description}
                        </p>
                        {phase !== 'processing' && (
                          <p className="text-[9px] text-white/20 font-body mt-1">
                            Start demo to hear this
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Tech callout ── */}
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/35 font-ui">
                  How it works
                </p>
                <ul className="space-y-1.5">
                  {[
                    'Two-head granular pitch-shifter (AudioWorklet)',
                    'Programmatic reverb — no external audio files',
                    'High-pass + low-pass filter chain',
                    'Dynamics compressor for consistency',
                    'Zero audio data leaves your device',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[11px] text-white/40 font-body">
                      <span className="text-indigo-400 mt-0.5 flex-shrink-0" aria-hidden="true">›</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA strip ── */}
      <footer className="border-t border-white/8 mt-4 px-6 py-10">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-bold text-white text-lg">Ready to experience it in a real session?</p>
            <p className="text-white/45 text-sm font-body mt-1">
              Live sessions connect you with a trained facilitator — fully anonymous, fully protected.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              href="/contact"
              aria-label="Contact us with questions"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white/70 font-ui hover:bg-white/10 transition-all"
            >
              Questions? Contact Us
            </Link>
            <Link
              href="/book"
              aria-label="Book a real H.I.P.S. session"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#C59A35] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white font-ui hover:bg-[#A67F28] transition-all shadow-lg shadow-amber-500/20"
            >
              Book a Session
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
