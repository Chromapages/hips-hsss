"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Check, ChevronDown, Headphones, Loader2, Mic, RefreshCw, ShieldCheck, Square, Volume2 } from "lucide-react";
import { getBrowserVoiceCapabilities } from "@/lib/browser-voice-capabilities";
import { lowLatencyPitchShiftWorkletSource } from "@/lib/low-latency-pitch-shift-worklet";

const PROMPT = "My voice stays private in this session.";
const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD6A5]";
const EFFECTS_PRESETS = [
  { id: "neutral", label: "Clear Neutral", description: "Maximum comprehension with gentle privacy color", semitones: -0.35, highpass: 80, presenceFrequency: 2300, presenceGain: 1.5, delay: 0.025, wet: 0.055, legacyPreset: "subtle", reverbLevel: "low" },
  { id: "soft", label: "Soft Mask", description: "Clearest speech with light privacy cover", semitones: -2, highpass: 90, presenceFrequency: 2400, presenceGain: 2, delay: 0.04, wet: 0.09, legacyPreset: "subtle", reverbLevel: "low" },
  { id: "balanced", label: "Balanced Mask", description: "Clear conversation with stronger cover", semitones: -3, highpass: 105, presenceFrequency: 2100, presenceGain: 4, delay: 0.06, wet: 0.13, legacyPreset: "subtle", reverbLevel: "medium" },
  { id: "deep", label: "Deep Mask", description: "Strongest cover; clarity may vary by voice", semitones: -6, highpass: 80, presenceFrequency: 1800, presenceGain: 5, delay: 0.075, wet: 0.18, legacyPreset: "deep", reverbLevel: "medium" },
  { id: "warm", label: "Warm Mask", description: "Clear speech with a softer lower tone", semitones: -4, highpass: 85, presenceFrequency: 1600, presenceGain: 3, delay: 0.09, wet: 0.2, legacyPreset: "deep", reverbLevel: "high" },
];
const voiceSessionPreferences = new Map();
const CAPTURE_MODES = {
  clarity: { label: "Clarity first", semitoneOffset: 0, wetScale: 0.82, lfoDepth: 0.01, compressorThreshold: -22, compressorRatio: 2.6 },
  privacy: { label: "Privacy first", semitoneOffset: -0.5, wetScale: 1.12, lfoDepth: 0.02, compressorThreshold: -25, compressorRatio: 3.2 },
};

function updateMaskGraph(graph, preset, context, captureMode = "clarity") {
  if (!graph || !context) return;
  const mode = CAPTURE_MODES[captureMode];
  const now = context.currentTime;
  graph.worklet?.port.postMessage({ type: "update-params", semitones: preset.semitones + mode.semitoneOffset, ringModFreq: 0, lfoDepth: mode.lfoDepth, lfoFreq: 2.5 });
  graph.highpass.frequency.setTargetAtTime(preset.highpass, now, 0.025);
  graph.presence.frequency.setTargetAtTime(preset.presenceFrequency, now, 0.025);
  graph.presence.gain.setTargetAtTime(preset.presenceGain, now, 0.025);
  graph.delay.delayTime.setTargetAtTime(preset.delay, now, 0.025);
  const wet = Math.min(0.28, preset.wet * mode.wetScale);
  graph.dry.gain.setTargetAtTime(1 - wet, now, 0.025);
  graph.wet.gain.setTargetAtTime(wet, now, 0.025);
  graph.compressor.threshold.setTargetAtTime(mode.compressorThreshold, now, 0.025);
  graph.compressor.ratio.setTargetAtTime(mode.compressorRatio, now, 0.025);
}

function statusCopy(stage, saved) {
  if (saved) return "Comparison kept in this tab";
  return ({ preflight: "Ready", permission: "Ready for microphone access", requesting: "Requesting permission", live: "Listening", recording: "Mask active — recording", processing: "Processing", review: "Review ready", error: "Mic error", unsupported: "Unsupported browser mode" })[stage] || "Ready";
}

function stopStream(stream) {
  stream?.getTracks().forEach((track) => track.stop());
}

export function BrowserVoiceTest({ onPresetChange, onConfigurationChange, suggestedPresetId, allowedPresetIds }) {
  const [capabilities, setCapabilities] = useState(null);
  const [stage, setStage] = useState("preflight");
  const [error, setError] = useState("");
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState("");
  const [trackInfo, setTrackInfo] = useState(null);
  const [level, setLevel] = useState(0);
  const [maskMonitor, setMaskMonitor] = useState(false);
  const [rawUrl, setRawUrl] = useState("");
  const [maskedUrl, setMaskedUrl] = useState("");
  const [quality, setQuality] = useState([]);
  const [constraintNote, setConstraintNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState(() => voiceSessionPreferences.get("presetId") || "soft");
  const [effectsSupport, setEffectsSupport] = useState("checking");
  const [captureMode, setCaptureMode] = useState(() => voiceSessionPreferences.get("captureMode") || "clarity");
  const [recordingAvailable, setRecordingAvailable] = useState(true);
  const [recordingError, setRecordingError] = useState("");
  const [samplePlaying, setSamplePlaying] = useState(false);
  const [canPlaySample, setCanPlaySample] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);
  const maskedDestinationRef = useRef(null);
  const rawDestinationRef = useRef(null);
  const monitorGainRef = useRef(null);
  const maskGraphRef = useRef(null);
  const recordersRef = useRef([]);
  const samplesRef = useRef([]);
  const recordingFailedRef = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const result = getBrowserVoiceCapabilities();
      setCanPlaySample("speechSynthesis" in window && "SpeechSynthesisUtterance" in window);
      setCapabilities(result);
      setRecordingAvailable(result.canRecordAudio);
      setStage(!result.secureContext || !result.canCaptureAudio || !result.canProcessAudio ? "unsupported" : "permission");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const revokeRecordings = useCallback(() => {
    if (rawUrl) URL.revokeObjectURL(rawUrl);
    if (maskedUrl) URL.revokeObjectURL(maskedUrl);
    setRawUrl("");
    setMaskedUrl("");
  }, [maskedUrl, rawUrl]);

  const cleanupAudio = useCallback(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
    recordersRef.current.forEach((recorder) => {
      if (recorder.state === "recording") recorder.stop();
    });
    recordersRef.current = [];
    stopStream(streamRef.current);
    streamRef.current = null;
    if (audioContextRef.current) void audioContextRef.current.close().catch(() => undefined);
    audioContextRef.current = null;
    maskGraphRef.current = null;
    setLevel(0);
  }, []);

  useEffect(() => () => cleanupAudio(), [cleanupAudio]);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  useEffect(() => () => {
    if (rawUrl) URL.revokeObjectURL(rawUrl);
    if (maskedUrl) URL.revokeObjectURL(maskedUrl);
  }, [maskedUrl, rawUrl]);

  useEffect(() => {
    const activePreset = EFFECTS_PRESETS.find((preset) => preset.id === selectedPresetId) || EFFECTS_PRESETS[1];
    const active = ["live", "recording", "processing", "review"].includes(stage) && effectsSupport === "ready";
    onConfigurationChange?.({
      status: skipped ? "skipped" : active ? "configured" : stage === "error" || stage === "unsupported" ? "needs-attention" : "not-started",
      complete: skipped || active,
      presetId: activePreset.id,
      presetLabel: activePreset.label,
      captureMode,
      captureModeLabel: CAPTURE_MODES[captureMode].label,
      effectsSupport,
    });
  }, [captureMode, effectsSupport, onConfigurationChange, selectedPresetId, skipped, stage]);

  const refreshDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    const list = (await navigator.mediaDevices.enumerateDevices()).filter((item) => item.kind === "audioinput");
    setDevices(list);
    const activeId = streamRef.current?.getAudioTracks()[0]?.getSettings?.().deviceId;
    if (activeId) setDeviceId(activeId);
  }, []);

  const buildPipeline = useCallback(async (stream) => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const context = new AudioCtx();
    if (context.state === "suspended") await context.resume();
    audioContextRef.current = context;
    const source = context.createMediaStreamSource(stream);
    const analyser = context.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.72;
    analyserRef.current = analyser;

    const inputHighpass = context.createBiquadFilter();
    inputHighpass.type = "highpass";
    inputHighpass.frequency.value = 70;
    const highpass = context.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 105;
    const presence = context.createBiquadFilter();
    presence.type = "peaking";
    presence.frequency.value = 2100;
    presence.Q.value = 1.1;
    presence.gain.value = 4;
    const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -24;
    compressor.ratio.value = 3;
    const delay = context.createDelay(0.25);
    delay.delayTime.value = 0.06;
    const dry = context.createGain();
    const wet = context.createGain();
    dry.gain.value = 0.87;
    wet.gain.value = 0.13;
    const destination = context.createMediaStreamDestination();
    const rawDestination = context.createMediaStreamDestination();
    const monitor = context.createGain();
    monitor.gain.value = 0;
    maskedDestinationRef.current = destination;
    rawDestinationRef.current = rawDestination;
    monitorGainRef.current = monitor;

    let worklet = null;
    try {
      if (!context.audioWorklet) throw new Error("AudioWorklet is unavailable");
      const moduleUrl = URL.createObjectURL(new Blob([lowLatencyPitchShiftWorkletSource], { type: "application/javascript" }));
      try {
        await context.audioWorklet.addModule(moduleUrl);
      } finally {
        URL.revokeObjectURL(moduleUrl);
      }
      const initialPreset = EFFECTS_PRESETS.find((preset) => preset.id === selectedPresetId) || EFFECTS_PRESETS[1];
      worklet = new AudioWorkletNode(context, "hips-pitch-shift-ola", { processorOptions: { semitones: initialPreset.semitones, ringModFreq: 0 } });
      setEffectsSupport("ready");
    } catch {
      setEffectsSupport("unavailable");
      setConstraintNote("Local pitch masking could not start in this browser. Presets are disabled, but input testing remains available.");
    }

    source.connect(inputHighpass);
    inputHighpass.connect(compressor);
    compressor.connect(analyser);
    compressor.connect(rawDestination);
    if (worklet) {
      compressor.connect(worklet);
      worklet.connect(highpass);
    } else {
      compressor.connect(highpass);
    }
    highpass.connect(presence);
    presence.connect(dry);
    presence.connect(delay);
    delay.connect(wet);
    dry.connect(destination);
    wet.connect(destination);
    dry.connect(monitor);
    wet.connect(monitor);
    monitor.connect(context.destination);
    maskGraphRef.current = { worklet, highpass, presence, delay, dry, wet, compressor };
    const activePreset = EFFECTS_PRESETS.find((preset) => preset.id === selectedPresetId) || EFFECTS_PRESETS[1];
    updateMaskGraph(maskGraphRef.current, activePreset, context, captureMode);

    const bytes = new Uint8Array(analyser.fftSize);
    const meter = () => {
      analyser.getByteTimeDomainData(bytes);
      let sum = 0;
      let peak = 0;
      for (const byte of bytes) {
        const value = Math.abs((byte - 128) / 128);
        sum += value * value;
        peak = Math.max(peak, value);
      }
      const rms = Math.sqrt(sum / bytes.length);
      const normalized = Math.min(1, rms * 5.5);
      setLevel(normalized);
      if (recordersRef.current.some((recorder) => recorder.state === "recording")) samplesRef.current.push({ rms, peak });
      animationRef.current = requestAnimationFrame(meter);
    };
    meter();
  }, [captureMode, selectedPresetId]);

  const requestMicrophone = useCallback(async (requestedDeviceId = "") => {
    setSkipped(false);
    setStage("requesting");
    setEffectsSupport("checking");
    setError("");
    setConstraintNote("");
    cleanupAudio();
    try {
      const supported = navigator.mediaDevices.getSupportedConstraints?.() || {};
      const audio = {};
      if (supported.channelCount) audio.channelCount = { ideal: 1 };
      if (supported.echoCancellation) audio.echoCancellation = { ideal: true };
      if (supported.noiseSuppression) audio.noiseSuppression = { ideal: true };
      if (supported.autoGainControl) audio.autoGainControl = { ideal: true };
      if (requestedDeviceId && supported.deviceId) audio.deviceId = { exact: requestedDeviceId };
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: Object.keys(audio).length ? audio : true, video: false });
      } catch (reason) {
        if (reason?.name !== "OverconstrainedError") throw reason;
        stream = await navigator.mediaDevices.getUserMedia({ audio: requestedDeviceId ? { deviceId: { ideal: requestedDeviceId } } : true, video: false });
        setConstraintNote("Your browser simplified the requested cleanup settings. The test can still continue.");
      }
      streamRef.current = stream;
      const track = stream.getAudioTracks()[0];
      const settings = track.getSettings?.() || {};
      setTrackInfo({ label: track.label || "Microphone", settings, capabilities: track.getCapabilities?.() || null });
      const unavailable = ["channelCount", "echoCancellation", "noiseSuppression", "autoGainControl"].filter((name) => !supported[name]);
      const declined = ["echoCancellation", "noiseSuppression", "autoGainControl"].filter((name) => supported[name] && settings[name] === false);
      if (unavailable.length || declined.length) {
        const notes = [];
        if (unavailable.length) notes.push(`does not expose ${unavailable.join(", ")}`);
        if (declined.length) notes.push(`did not enable ${declined.join(", ")}`);
        setConstraintNote(`This browser ${notes.join(" and ")}. Local masking remains active, but recording clarity may vary.`);
      }
      await buildPipeline(stream);
      await refreshDevices();
      setStage("live");
    } catch (reason) {
      const name = reason?.name || "Error";
      const message = name === "NotAllowedError" ? "Microphone access is blocked in this browser." : name === "NotFoundError" ? "No microphone was found. Connect one and try again." : name === "NotReadableError" || name === "AbortError" ? "Your microphone is busy in another app. Close it and retry." : name === "SecurityError" ? "Secure connection required for microphone access." : name === "OverconstrainedError" ? "This microphone could not use the requested settings. Choose another input." : "The microphone could not start. Close other audio apps and try again.";
      setError(message);
      setStage("error");
    }
  }, [buildPipeline, cleanupAudio, refreshDevices]);

  const toggleMonitor = () => {
    const next = !maskMonitor;
    setMaskMonitor(next);
    if (monitorGainRef.current && audioContextRef.current) monitorGainRef.current.gain.setTargetAtTime(next ? 0.72 : 0, audioContextRef.current.currentTime, 0.02);
  };

  const selectEffectsPreset = (preset) => {
    setSelectedPresetId(preset.id);
    voiceSessionPreferences.set("presetId", preset.id);
    updateMaskGraph(maskGraphRef.current, preset, audioContextRef.current, captureMode);
    onPresetChange?.(preset);
  };

  const selectCaptureMode = (modeId) => {
    setCaptureMode(modeId);
    voiceSessionPreferences.set("captureMode", modeId);
    const activePreset = EFFECTS_PRESETS.find((preset) => preset.id === selectedPresetId) || EFFECTS_PRESETS[1];
    updateMaskGraph(maskGraphRef.current, activePreset, audioContextRef.current, modeId);
  };

  const playSamplePhrase = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(PROMPT);
    utterance.rate = 0.92;
    utterance.onend = () => setSamplePlaying(false);
    utterance.onerror = () => setSamplePlaying(false);
    setSamplePlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const keepLiveAfterRecordingFailure = (message) => {
    if (recordingFailedRef.current) return;
    recordingFailedRef.current = true;
    recordersRef.current.forEach((recorder) => {
      if (recorder.state === "recording") recorder.stop();
    });
    recordersRef.current = [];
    setRecordingAvailable(false);
    setRecordingError(`${message} Live masking and monitoring are still available.`);
    setStage("live");
  };

  const startRecording = () => {
    if (!streamRef.current || !maskedDestinationRef.current || !recordingAvailable) return;
    revokeRecordings();
    setRecordingError("");
    recordingFailedRef.current = false;
    setSaved(false);
    samplesRef.current = [];
    const options = capabilities.recorderMimeType ? { mimeType: capabilities.recorderMimeType } : undefined;
    const pairs = [];
    try {
      const makeRecorder = (stream) => {
        try { return new MediaRecorder(stream, options); }
        catch { return new MediaRecorder(stream); }
      };
      pairs.push(["raw", makeRecorder(rawDestinationRef.current.stream)]);
      pairs.push(["masked", makeRecorder(maskedDestinationRef.current.stream)]);
    } catch {
      keepLiveAfterRecordingFailure("Recording comparison could not start with this browser's audio format.");
      return;
    }
    const results = {};
    let stopped = 0;
    let startFailed = false;
    recordersRef.current = pairs.map(([, recorder]) => recorder);
    pairs.forEach(([kind, recorder]) => {
      const chunks = [];
      recorder.addEventListener("dataavailable", (event) => { if (event.data.size) chunks.push(event.data); });
      recorder.addEventListener("error", () => keepLiveAfterRecordingFailure("Recording comparison stopped because this browser reported an audio error."), { once: true });
      recorder.addEventListener("stop", () => {
        if (recordingFailedRef.current) return;
        results[kind] = URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType || chunks[0]?.type || capabilities.recorderMimeType || (capabilities.browserFamily === "safari" ? "audio/mp4" : "audio/webm") }));
        stopped += 1;
        if (stopped === pairs.length) {
          setRawUrl(results.raw || "");
          setMaskedUrl(results.masked || results.raw || "");
          const samples = samplesRef.current;
          const maxPeak = Math.max(0, ...samples.map((sample) => sample.peak));
          const average = samples.length ? samples.reduce((sum, sample) => sum + sample.rms, 0) / samples.length : 0;
          const checks = [];
          if (average < 0.025) checks.push("Input too quiet. Move closer to the microphone.");
          else checks.push("Speech looks clear.");
          if (maxPeak > 0.96) checks.push("Input clipping. Lower your microphone level or move back.");
          const floors = samples.map((sample) => sample.rms).sort((a, b) => a - b);
          const noiseFloor = floors[Math.floor(floors.length * 0.2)] || 0;
          if (noiseFloor > 0.035) checks.push("High background noise. Try a quieter space or headset.");
          checks.push("Mask is active.");
          setQuality(checks);
          setStage("review");
        }
      });
      try {
        recorder.start();
      } catch {
        startFailed = true;
        keepLiveAfterRecordingFailure("Recording comparison could not start in this browser audio mode.");
        return;
      }
    });
    if (startFailed) return;
    setStage("recording");
  };

  const stopRecording = () => {
    setStage("processing");
    recordersRef.current.forEach((recorder) => { if (recorder.state === "recording") recorder.stop(); });
  };

  const supportMessage = useMemo(() => {
    if (!capabilities) return "Checking browser audio support…";
    if (!capabilities.secureContext) return "Secure connection required for microphone access.";
    if (!capabilities.canCaptureAudio) return "This browser cannot request microphone audio here.";
    if (!capabilities.canProcessAudio) return "This browser cannot run the local masking pipeline.";
    if (!capabilities.canRecordAudio) return "Live input works, but this browser cannot save a recording.";
    if (capabilities.browserFamily === "safari") return `Safari recording detected. ${capabilities.recorderMimeType ? "Export format switched for compatibility." : "Recording format support is limited."}`;
    return "Browser audio, local masking, and recording are supported.";
  }, [capabilities]);
  const signalStatus = level > 0.85
    ? "Input clipping. Move slightly farther from the microphone."
    : level < 0.04
      ? "Input too quiet. Move closer to the microphone."
      : `Speech looks clear.${effectsSupport === "ready" ? " Mask is active." : ""}`;
  const strongClarityCombination = captureMode === "privacy" && selectedPresetId === "deep";
  const suggestedPreset = EFFECTS_PRESETS.find((preset) => preset.id === suggestedPresetId);

  return <section className="rounded-2xl border border-av-border bg-av-bg-elevated p-4 sm:p-5" aria-labelledby="voice-test-heading">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="hips-eyebrow">Browser audio preflight</p><h3 id="voice-test-heading" className="hips-section-h2 mt-1 text-av-text-primary">Test your protected voice</h3></div><span role="status" aria-live="polite" aria-atomic="true" className={`hips-pill border ${stage === "error" || stage === "unsupported" ? "border-av-error-border bg-av-error-bg text-av-error-fg" : "border-av-success-border bg-av-success-bg text-av-success-fg"}`}>{statusCopy(stage, saved)}</span></div>
    <p className="mt-3 text-sm leading-6 text-av-text-subtle">The test checks microphone input, local masking, playback, and signal quality. It does not depend on transcription.</p>
    <p className="mt-3 text-xs text-av-text-subtle">Review microphone handling anytime in the <button type="button" onClick={() => { const panel = document.getElementById("privacy-data"); if (panel instanceof HTMLDetailsElement) { panel.open = true; panel.querySelector("summary")?.focus(); } }} className={`font-semibold text-av-accent-fg underline underline-offset-4 ${focus}`}>Privacy &amp; Data panel</button>.</p>
    <details onKeyDown={(event) => { if (event.key === "Escape") event.currentTarget.removeAttribute("open"); }} className="mt-3 rounded-lg border border-av-border bg-av-bg-input px-3"><summary className={`min-h-[48px] cursor-pointer py-3 text-sm font-semibold text-av-text-secondary ${focus}`}>Browser readiness &amp; troubleshooting</summary><div className="grid grid-cols-2 gap-2 pb-4 sm:grid-cols-4"><Badge ok={capabilities?.secureContext} label="Secure connection" /><Badge ok={capabilities?.canCaptureAudio} label={`${capabilities?.browserFamily || "Browser"} support`} /><Badge ok={capabilities?.canProcessAudio} label="Local masking" /><Badge ok={capabilities?.canRecordAudio} label="Recording support" /></div><div className="border-t border-av-border pb-4 pt-3 text-xs leading-5 text-av-text-subtle"><p><strong className="text-av-text-primary">Blocked permission:</strong> allow microphone access in site settings, then retry.</p><p className="mt-2"><strong className="text-av-text-primary">Mobile:</strong> close calls or other apps using the microphone first.</p></div></details>
    <p className="mt-3 rounded-lg border border-av-border bg-av-bg-input p-3 text-xs leading-5 text-av-text-secondary">{supportMessage}</p>
    {suggestedPreset && <p className="mt-3 text-xs leading-5 text-av-success-fg">Suggested for your protected persona: <strong>{suggestedPreset.label}</strong>. This is optional and has not changed your selection.</p>}
    {!['live', 'recording', 'processing', 'review'].includes(stage) && <div className="mt-4"><PresetSelector selectedPresetId={selectedPresetId} selectEffectsPreset={selectEffectsPreset} disabled={stage === "unsupported"} name="effects-mode-preset-preflight" captureMode={captureMode} selectCaptureMode={selectCaptureMode} allowedPresetIds={allowedPresetIds} /><EnhancedNeuralPreview /></div>}
    {!['live', 'recording', 'processing', 'review'].includes(stage) && (selectedPresetId === "deep" || strongClarityCombination) && <MaskClarityWarning strong={strongClarityCombination} />}

    {(stage === "permission" || stage === "error") && <button type="button" onClick={() => requestMicrophone()} className={`hips-action-primary mt-4 min-h-[48px] w-full rounded-lg px-4 text-sm font-bold ${focus}`}><Mic className="mr-2 inline h-4 w-4" />{stage === "error" ? "Try microphone again" : "Start voice test"}</button>}
    {stage === "requesting" && <div className="mt-4 flex min-h-[80px] items-center justify-center gap-2 text-sm text-av-accent-fg"><Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none" /> Waiting for browser permission…</div>}
    {stage === "unsupported" && <div className="mt-4 rounded-lg border border-av-error-border bg-av-error-bg p-3 text-sm text-av-error-fg"><AlertTriangle className="mr-2 inline h-4 w-4" />{supportMessage}</div>}
    {error && <p className="mt-3 rounded-lg border border-av-error-border bg-av-error-bg p-3 text-sm text-av-error-fg" role="alert">{error}</p>}
    {recordingError && <p className="mt-3 rounded-lg border border-[#8F6335] bg-av-warn-bg p-3 text-xs leading-5 text-av-accent-fg" role="status">{recordingError}</p>}
    {constraintNote && <p className="mt-3 rounded-lg border border-[#8F6335] bg-av-warn-bg p-3 text-xs text-av-accent-fg">{constraintNote}</p>}
    {(stage === "permission" || stage === "error" || stage === "unsupported") && <button type="button" onClick={() => { cleanupAudio(); setSkipped(true); }} className={`hips-action-secondary mt-3 min-h-[44px] w-full rounded-lg border px-4 text-sm font-semibold ${focus}`}>{skipped ? "Voice setup skipped for this demo" : "Continue without voice test"}</button>}

    {["live", "recording", "processing", "review"].includes(stage) && <div className="mt-5 space-y-5"><div><div className="flex items-center justify-between gap-3"><label htmlFor="voice-input-device" className="text-xs font-bold text-av-text-secondary">Input microphone</label><button type="button" disabled={stage === "recording" || stage === "processing"} onClick={() => void refreshDevices()} className={`min-h-[44px] rounded-lg px-2 text-xs text-av-accent-fg disabled:opacity-50 ${focus}`}><RefreshCw className="mr-1 inline h-3.5 w-3.5" />Refresh</button></div><div className="relative mt-2"><select id="voice-input-device" value={deviceId} disabled={stage === "recording" || stage === "processing"} onChange={(event) => { setDeviceId(event.target.value); void requestMicrophone(event.target.value); }} className={`min-h-[48px] w-full appearance-none rounded-lg border border-av-border bg-av-bg-input px-3 pr-10 text-sm text-av-text-primary disabled:opacity-50 ${focus}`}>{devices.length ? devices.map((device, index) => <option value={device.deviceId} key={device.deviceId || index}>{device.label || `Microphone ${index + 1}`}</option>) : <option value="">Current microphone</option>}</select><ChevronDown className="pointer-events-none absolute right-3 top-4 h-4 w-4 text-av-text-subtle" /></div>{trackInfo && <p className="mt-2 text-xs text-av-text-muted">Using {trackInfo.label}{trackInfo.settings?.channelCount ? ` · ${trackInfo.settings.channelCount} channel` : ""}{trackInfo.settings?.sampleRate ? ` · ${trackInfo.settings.sampleRate} Hz` : ""}</p>}</div>
      <div><div className="flex justify-between text-xs text-av-text-secondary"><span>Live input</span><span>{Math.round(level * 100)}%</span></div><div className="mt-2 h-4 overflow-hidden rounded-full bg-av-border-strong" role="meter" aria-label="Microphone input level" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(level * 100)}><div className={`h-full rounded-full transition-[width] duration-100 motion-reduce:transition-none ${level > 0.85 ? "bg-[#E76F51]" : "bg-av-success"}`} style={{ width: `${Math.max(2, level * 100)}%` }} /></div></div>
      {(stage === "live" || stage === "recording") && <HeardPulse level={level} recording={stage === "recording"} />}
      <p className={`rounded-lg border px-3 py-2 text-xs ${level > 0.85 || level < 0.04 ? "border-[#8F6335] bg-av-warn-bg text-av-accent-fg" : "border-av-success-border bg-av-success-bg text-av-success-fg"}`} role="status" aria-live="polite">{signalStatus}</p>
      <p className="text-xs leading-5 text-av-text-subtle">Local masking protects your voice while keeping conversation understandable.</p>
      <div><div className="mb-3 flex justify-end"><span className={`hips-pill border ${effectsSupport === "ready" ? "border-av-success-border text-av-success-fg" : "border-av-error-border text-av-error-fg"}`}>{effectsSupport === "ready" ? "Local masking active" : effectsSupport === "checking" ? "Checking AudioWorklet" : "Unavailable in this browser"}</span></div><PresetSelector selectedPresetId={selectedPresetId} selectEffectsPreset={selectEffectsPreset} disabled={effectsSupport !== "ready" || stage === "processing"} name="effects-mode-preset" captureMode={captureMode} selectCaptureMode={selectCaptureMode} allowedPresetIds={allowedPresetIds} /><EnhancedNeuralPreview /></div>
      {(selectedPresetId === "deep" || effectsSupport === "unavailable") && <MaskClarityWarning unavailable={effectsSupport === "unavailable"} strong={strongClarityCombination} />}
      <div className="rounded-xl border border-av-warn-border-soft bg-av-warn-bg p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-wider text-av-accent">Read this prompt</p><p className="mt-2 text-lg font-semibold text-av-text-primary">“{PROMPT}”</p></div>{canPlaySample && <button type="button" onClick={playSamplePhrase} aria-pressed={samplePlaying} className={`min-h-[44px] rounded-lg border border-av-warn-border px-3 text-xs font-semibold text-av-accent-fg ${focus}`}><Volume2 className="mr-1.5 inline h-4 w-4" />{samplePlaying ? "Playing sample…" : "Play sample phrase"}</button>}</div><p className="mt-2 text-[10px] leading-4 text-av-text-muted">The sample uses your browser’s built-in voice and is not recorded or uploaded.</p></div>
      <button type="button" disabled={effectsSupport !== "ready"} onClick={toggleMonitor} aria-pressed={maskMonitor} className={`min-h-[48px] w-full rounded-lg border px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-45 ${focus} ${maskMonitor ? "border-av-accent bg-av-bg-accent text-av-accent-fg" : "border-av-border bg-av-bg-input text-av-text-secondary"}`}><Headphones className="mr-2 inline h-4 w-4" />Masked output monitor: {maskMonitor ? "On" : "Off"}</button><p className="text-xs leading-5 text-av-text-muted">Use headphones before enabling monitoring to prevent feedback. Monitoring stays independent from preset choice.</p>
      {stage === "live" && <button type="button" disabled={!recordingAvailable || effectsSupport !== "ready"} onClick={startRecording} className={`hips-action-primary min-h-[48px] w-full rounded-lg px-4 text-sm font-bold disabled:opacity-50 ${focus}`}><Mic className="mr-2 inline h-4 w-4" />{recordingAvailable ? "Record comparison" : "Recording comparison unavailable"}</button>}
      {stage === "recording" && <button type="button" onClick={stopRecording} className={`min-h-[48px] w-full rounded-lg border border-[#D65A50] bg-[#3B2528] px-4 text-sm font-bold text-av-error-fg ${focus}`}><Square className="mr-2 inline h-4 w-4" />Stop recording</button>}
      {stage === "processing" && <p role="status" className="text-center text-sm text-av-accent-fg"><Loader2 className="mr-2 inline h-4 w-4 animate-spin motion-reduce:animate-none" />Preparing playback…</p>}
      {stage === "review" && <div className="space-y-4"><div className="grid gap-3 sm:grid-cols-2"><Playback label="Original input" url={rawUrl} /><Playback label="Masked output" url={maskedUrl} /></div><ul className="space-y-2" aria-label="Audio quality checks">{quality.map((item) => <li key={item} className="flex gap-2 text-xs text-av-text-secondary"><Check className="h-4 w-4 shrink-0 text-av-success-fg" />{item}</li>)}</ul><p className="text-xs leading-5 text-av-text-subtle">This comparison remains only in this tab&apos;s memory. It is not uploaded or retained across sessions.</p><div className="grid grid-cols-1 gap-2 sm:grid-cols-2"><button type="button" onClick={() => { revokeRecordings(); setSaved(false); setStage("live"); }} className={`hips-action-secondary min-h-[48px] rounded-lg border px-4 text-sm font-semibold ${focus}`}><RefreshCw className="mr-2 inline h-4 w-4" />Retry</button><button type="button" onClick={() => setSaved(true)} className={`hips-action-primary min-h-[48px] rounded-lg px-4 text-sm font-bold ${focus}`}><Check className="mr-2 inline h-4 w-4" />Keep comparison for this tab</button></div>{saved && <p className="text-center text-xs text-av-success-fg">Comparison kept in this tab only. No audio was uploaded.</p>}</div>}
    </div>}

  </section>;
}

function Badge({ ok, label }) {
  return <div className={`rounded-lg border px-2 py-2.5 text-center text-[11px] font-semibold ${ok ? "border-av-success-border bg-av-success-bg text-av-success-fg" : "border-[#4A4040] bg-[#292528] text-[#D4B5B5]"}`}><ShieldCheck className="mx-auto mb-1 h-4 w-4" />{label}</div>;
}

function PresetSelector({ selectedPresetId, selectEffectsPreset, disabled, name, captureMode, selectCaptureMode, allowedPresetIds }) {
  const availablePresets = EFFECTS_PRESETS.filter((preset) => !allowedPresetIds || allowedPresetIds.includes(preset.id));
  const recommended = availablePresets.find((preset) => preset.id === "soft") || availablePresets[0];
  const advanced = availablePresets.filter((preset) => preset.id !== recommended?.id);
  const option = (preset) => <label key={preset.id} className={`flex min-h-[72px] cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors motion-reduce:transition-none focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#FFD6A5] ${selectedPresetId === preset.id ? "border-av-accent bg-av-bg-accent text-av-accent-fg" : "border-av-border bg-av-bg-input text-av-text-secondary"} ${disabled ? "cursor-not-allowed opacity-45" : "hover:border-av-accent"}`}><input type="radio" className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-action-primary)]" name={name} value={preset.id} checked={selectedPresetId === preset.id} onChange={() => selectEffectsPreset(preset)} /><span className="min-w-0 flex-1 whitespace-normal overflow-visible"><span className="block text-xs font-bold leading-5">{preset.label}{preset.id === "soft" ? " · Recommended" : ""}</span><span className="mt-1 block whitespace-normal text-[11px] leading-5 text-av-text-subtle">{preset.description}</span></span></label>;
  return <fieldset disabled={disabled} className="space-y-3"><legend className="text-sm font-bold text-av-text-primary">Effects Mode sound</legend>{option(recommended)}<details onKeyDown={(event) => { if (event.key === "Escape") event.currentTarget.removeAttribute("open"); }} className="rounded-xl border border-av-border bg-av-bg-section px-3"><summary className={`min-h-[48px] cursor-pointer py-3 text-sm font-semibold text-av-accent-fg ${focus}`}>Advanced options</summary><div className="grid gap-2 pb-4 sm:grid-cols-2">{advanced.map(option)}</div><div className="pb-4"><CaptureModeControl mode={captureMode} onChange={selectCaptureMode} disabled={disabled} name={`${name}-capture`} /></div></details></fieldset>;
}

function EnhancedNeuralPreview() {
  return <aside className="mt-4 rounded-xl border border-[#665B45] bg-[#292824] p-3" aria-label="Coming soon: Enhanced Neural"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="hips-eyebrow text-[#E0C98F]">Coming soon</p><p className="mt-1 text-xs font-bold text-[#E3D8C2]">Enhanced Neural voice masking</p></div><span className="hips-pill border border-[#806F4D] text-[#E0C98F]">Unavailable</span></div></aside>;
}

function CaptureModeControl({ mode, onChange, disabled, name }) {
  return <fieldset disabled={disabled} className="rounded-xl border border-av-border bg-av-bg-input p-3"><legend className="px-1 text-xs font-bold text-av-text-secondary">Capture priority</legend><div className="grid grid-cols-2 gap-2">{Object.entries(CAPTURE_MODES).map(([id, option]) => <label key={id} className={`min-h-[44px] cursor-pointer rounded-lg border px-3 py-2 text-center text-xs font-semibold focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#FFD6A5] ${mode === id ? "border-av-accent bg-av-bg-accent text-av-accent-fg" : "border-av-border text-av-text-secondary"} ${disabled ? "cursor-not-allowed opacity-45" : "hover:border-av-accent"}`}><input type="radio" className="sr-only" name={name} checked={mode === id} onChange={() => onChange(id)} />{option.label}</label>)}</div><p className="mt-2 text-[10px] leading-4 text-av-text-muted">Clarity first uses gentler variation. Privacy first increases local pitch variation and masking mix.</p></fieldset>;
}

function HeardPulse({ level, recording }) {
  const active = level >= 0.04;
  const heights = [0.55, 0.9, 0.7, 1, 0.62];
  return <div className="flex items-center gap-3 rounded-lg border border-av-border bg-av-bg-input px-3 py-2" role="status" aria-live="polite"><div className="flex h-6 items-center gap-1" aria-hidden="true">{heights.map((height, index) => <span key={height} className={`w-1 rounded-full transition-[height,opacity] duration-100 motion-reduce:transition-none ${active ? "bg-av-success" : "bg-av-meter-inactive"}`} style={{ height: `${Math.max(4, level * 24 * height)}px`, opacity: active ? 1 - index * 0.08 : 0.55 }} />)}</div><span className="text-xs text-av-text-secondary">{active ? `You are being heard${recording ? " and recorded locally" : ""}.` : "Listening for your voice…"}</span></div>;
}

function MaskClarityWarning({ unavailable = false, strong = false }) {
  const message = unavailable
    ? "This browser or device could not start the full Effects Mode path. Masked playback is unavailable; input testing can continue."
    : strong
      ? "Strong privacy cover selected; clarity may be reduced for some voices. Try Clear Neutral or Soft Mask if words sound less clear."
      : "Deep Mask may reduce clarity on some voices or devices. Record a comparison and switch to Soft Mask if words sound less clear.";
  return <p className="mt-3 rounded-lg border border-[#8F6335] bg-av-warn-bg p-3 text-xs leading-5 text-av-accent-fg" role="note">{message}</p>;
}

function Playback({ label, url }) {
  return <div className="rounded-xl border border-av-border bg-av-bg-input p-3"><p className="mb-2 text-xs font-bold text-av-text-secondary">{label}</p>{url ? <audio className="w-full" controls preload="metadata" src={url} /> : <p className="text-xs text-av-text-muted">Not available in this browser mode.</p>}</div>;
}
