import { Track, type AudioProcessorOptions, type LocalAudioTrack, type TrackProcessor } from "livekit-client";
import type { VoicePreset } from "./voice-mask-presets";

export const ENHANCED_NEURAL_UNAVAILABLE_MESSAGE =
  "Enhanced Neural Masking is not live yet. Use Effects Mode for microphone audio while the returned-audio backend is being connected.";

export type DspProcessorOptions = {
  preset: VoicePreset;
  semitones: number;
  wetDryRatio: number;
};

export type PrepareDspVoiceTrackOptions = {
  track: LocalAudioTrack;
  processorOptions: DspProcessorOptions;
  createProcessor: (options: DspProcessorOptions) => TrackProcessor<Track.Kind.Audio, AudioProcessorOptions>;
};

export type PrepareNeuralVoiceTrackOptions = {
  track: LocalAudioTrack;
  serverMaskingReady: boolean;
  voiceWorkerUrl: string | null;
  voiceWorkerToken: string | null;
  sessionId: string;
  participantIdentity: string;
  selectedPersona: "clara" | "arthur";
  antiCadence: boolean;
  startNeuralVoiceMasking: (options: {
    workerUrl: string;
    workerToken?: string;
    sessionId: string;
    participantIdentity: string;
    sourceTrack: MediaStreamTrack;
    persona: "clara" | "arthur";
    antiCadence: boolean;
    pseudoSpeakerSeed: string;
    sampleRate?: number;
  }) => Promise<MediaStreamTrack>;
  stopNeuralVoiceMasking: () => void;
};

export type PreparedDspVoiceTrack =
  | { status: "ready"; track: LocalAudioTrack }
  | { status: "blocked"; warning: string };

export type PreparedNeuralVoiceTrack =
  | { status: "ready"; processedTrack: MediaStreamTrack; sourceTrack: LocalAudioTrack }
  | { status: "blocked"; warning: string };

export async function prepareDspVoiceTrack({
  track,
  processorOptions,
  createProcessor,
}: PrepareDspVoiceTrackOptions): Promise<PreparedDspVoiceTrack> {
  try {
    await track.setProcessor(createProcessor(processorOptions));
    return { status: "ready", track };
  } catch (processorError) {
    stopLocalSourceTrack(track);
    return {
      status: "blocked",
      warning: processorError instanceof Error
        ? `Voice mask unavailable: ${processorError.message}. Try Chrome or Edge for full support.`
        : "Voice mask unavailable in this browser. Try Chrome or Edge for full support.",
    };
  }
}

export async function prepareNeuralVoiceTrack({
  track,
  serverMaskingReady,
  voiceWorkerUrl,
  voiceWorkerToken,
  sessionId,
  participantIdentity,
  selectedPersona,
  antiCadence,
  startNeuralVoiceMasking,
  stopNeuralVoiceMasking,
}: PrepareNeuralVoiceTrackOptions): Promise<PreparedNeuralVoiceTrack> {
  if (!serverMaskingReady || !voiceWorkerUrl) {
    stopLocalSourceTrack(track);
    return {
      status: "blocked",
      warning: ENHANCED_NEURAL_UNAVAILABLE_MESSAGE,
    };
  }

  try {
    const sourceSampleRate = track.mediaStreamTrack.getSettings().sampleRate;
    const processedTrack = await startNeuralVoiceMasking({
      workerUrl: voiceWorkerUrl,
      ...(voiceWorkerToken ? { workerToken: voiceWorkerToken } : {}),
      sessionId,
      participantIdentity,
      sourceTrack: track.mediaStreamTrack,
      persona: selectedPersona,
      antiCadence,
      pseudoSpeakerSeed: `session-${sessionId}:${participantIdentity}:${selectedPersona}`,
      ...(typeof sourceSampleRate === "number" ? { sampleRate: sourceSampleRate } : {}),
    });

    return { status: "ready", processedTrack, sourceTrack: track };
  } catch (neuralError) {
    stopNeuralVoiceMasking();
    stopLocalSourceTrack(track);
    return {
      status: "blocked",
      warning: neuralError instanceof Error
        ? `Enhanced Neural Masking failed: ${neuralError.message}. Use Effects Mode for now.`
        : "Enhanced Neural Masking failed. Use Effects Mode for now.",
    };
  }
}

function stopLocalSourceTrack(track: LocalAudioTrack) {
  try {
    track.stop();
  } catch (stopErr) {
    console.warn("[SessionAudioPublishing] Failed to stop local microphone track:", stopErr);
  }
}
