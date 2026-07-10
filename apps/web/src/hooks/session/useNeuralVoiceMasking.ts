'use client';

import { useCallback, useRef, useState } from 'react';
import { StreamingVoiceClient, type VoiceWorkerControlMessage } from '@/lib/streaming-voice-client';
import { createVoiceTrackRebuilder, type VoiceTrackRebuilder } from '@/lib/voice-track-rebuilder';

export type NeuralVoiceMaskingState = 'idle' | 'connecting' | 'ready' | 'error';

export type StartNeuralVoiceMaskingOptions = {
  workerUrl: string;
  workerToken?: string;
  sessionId: string;
  participantIdentity: string;
  sourceTrack: MediaStreamTrack;
  persona?: 'clara' | 'arthur' | 'guardian' | 'bright' | 'shadow';
  antiCadence?: boolean;
  pseudoSpeakerSeed?: string;
  sampleRate?: number;
};

export function useNeuralVoiceMasking() {
  const [state, setState] = useState<NeuralVoiceMaskingState>('idle');
  const [lastControlMessage, setLastControlMessage] = useState<VoiceWorkerControlMessage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<StreamingVoiceClient | null>(null);
  const rebuilderRef = useRef<VoiceTrackRebuilder | null>(null);

  const stop = useCallback(() => {
    clientRef.current?.stop();
    rebuilderRef.current?.stop();
    clientRef.current = null;
    rebuilderRef.current = null;
    setState('idle');
  }, []);

  const start = useCallback(async (options: StartNeuralVoiceMaskingOptions): Promise<MediaStreamTrack> => {
    stop();
    setState('connecting');
    setError(null);

    try {
      const rebuilder = createVoiceTrackRebuilder(options.sampleRate ?? 48_000);
      const client = new StreamingVoiceClient({
        url: options.workerUrl,
        sessionId: options.sessionId,
        participantIdentity: options.participantIdentity,
        ...(options.workerToken ? { token: options.workerToken } : {}),
        ...(options.persona ? { persona: options.persona } : {}),
        ...(typeof options.antiCadence === 'boolean' ? { antiCadence: options.antiCadence } : {}),
        ...(options.pseudoSpeakerSeed ? { pseudoSpeakerSeed: options.pseudoSpeakerSeed } : {}),
        onProcessedFrame: rebuilder.enqueuePcm16,
        onControlMessage: (message) => {
          setLastControlMessage(message);
          if (message.type === 'ready') setState('ready');
        },
        onError: (err) => {
          setError(err.message);
          setState('error');
        },
      });

      rebuilderRef.current = rebuilder;
      clientRef.current = client;
      await client.start(options.sourceTrack);
      return rebuilder.track;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      setState('error');
      stop();
      throw err;
    }
  }, [stop]);

  return {
    state,
    error,
    lastControlMessage,
    start,
    stop,
  };
}
