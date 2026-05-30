'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { AvatarGesture } from '@hips/types';

interface AudioAvatarProps {
  localIdentity: string;
  micEnabled: boolean;
  gesture: AvatarGesture;
  /** Pass the LocalAudioTrack's MediaStream to visualize mic amplitude without a second getUserMedia call */
  audioStream?: MediaStream | null;
}

type AnimationState = 'idle' | 'speaking' | 'hand-raised' | 'loading' | 'mic-unavailable';

function getAnimationState(micEnabled: boolean, gesture: AvatarGesture): AnimationState {
  if (gesture === 'raised-hand') return 'hand-raised';
  if (micEnabled) return 'speaking';
  return 'idle';
}

/**
 * Simple abstract SVG avatar with CSS animations.
 * Uses Web Audio API for microphone amplitude visualization.
 * No Three.js or WebGL - pure DOM/SVG/CSS.
 *
 * All Web Audio API calls are wrapped in try/catch to ensure
 * the component never throws an unhandled error.
 */
export function AudioAvatar({ localIdentity, micEnabled, gesture, audioStream }: AudioAvatarProps) {
  const [amplitude, setAmplitude] = useState(0);
  const [animationState, setAnimationState] = useState<AnimationState>('loading');
  const [micUnavailable, setMicUnavailable] = useState(false);
  const [audioContextState, setAudioContextState] = useState<AudioContextState>('suspended');
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const isConnectedRef = useRef(false);
  const hasInitializedRef = useRef(false);

  // Brand colors
  const darkTeal = '#0D2E2B';
  const gold = '#D4AF37';

  const updateAnimationState = useCallback(() => {
    const baseState = getAnimationState(micEnabled, gesture);
    setAnimationState(baseState);
  }, [micEnabled, gesture]);

  useEffect(() => {
    updateAnimationState();
  }, [updateAnimationState]);

  // Handle audio context state changes (for autoplay policy)
  useEffect(() => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const handleStateChange = ()    => setAudioContextState(ctx.state);

    ctx.addEventListener('statechange', handleStateChange);
    return () => ctx.removeEventListener('statechange', handleStateChange);
  }, []);

  // Set up Web Audio API for amplitude visualization when mic is enabled
  const setupAudioVisualization = useCallback(async () => {
    if (isConnectedRef.current) return;

    // If already initialized but just need to handle audio context, skip
    if (hasInitializedRef.current && audioContextRef.current) {
      // Try to resume if suspended
      if (audioContextRef.current.state === 'suspended') {
        try {
          await audioContextRef.current.resume();
        } catch {
          // Ignore resume errors
        }
      }
      return;
    }

    try {
      // Use the passed-in audioStream from LiveKit LocalAudioTrack if available,
      // otherwise fall back to getUserMedia (only for micUnavailable detection)
      let stream: MediaStream;
      if (audioStream && audioStream.getAudioTracks().length > 0) {
        stream = audioStream;
      } else {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (permError) {
          console.warn('AudioAvatar: Microphone permission denied:', permError);
          setMicUnavailable(true);
          setAnimationState(getAnimationState(micEnabled, gesture));
          hasInitializedRef.current = true;
          return;
        }
      }

      streamRef.current = stream;

      // Create AudioContext and AnalyserNode
      let audioContext: AudioContext;
      try {
        audioContext = new AudioContext();
      } catch (ctxError) {
        console.warn('AudioAvatar: Could not create AudioContext:', ctxError);
        setMicUnavailable(true);
        setAnimationState(getAnimationState(micEnabled, gesture));
        hasInitializedRef.current = true;
        return;
      }

      audioContextRef.current = audioContext;

      // Handle suspended state (autoplay policy)
      if (audioContext.state === 'suspended') {
        const resumeAudio = async () => {
          try {
            await audioContext.resume();
            setAudioContextState(audioContext.state);
          } catch {
            // User interaction may be required - ignore
          }
        };
        // Listen for user interaction to resume
        const handleInteraction = () => {
          resumeAudio();
          document.removeEventListener('click', handleInteraction);
          document.removeEventListener('keydown', handleInteraction);
        };
        document.addEventListener('click', handleInteraction);
        document.addEventListener('keydown', handleInteraction);
      } else {
        setAudioContextState(audioContext.state);
      }

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // Connect the microphone to the analyser
      try {
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
      } catch (sourceError) {
        console.warn('AudioAvatar: Could not connect audio source:', sourceError);
        setMicUnavailable(true);
        setAnimationState(getAnimationState(micEnabled, gesture));
        hasInitializedRef.current = true;
        return;
      }

      isConnectedRef.current = true;
      hasInitializedRef.current = true;
      setMicUnavailable(false);

      // Start the amplitude polling loop
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateAmplitude = () => {
        if (!analyserRef.current) return;

        try {
          analyserRef.current.getByteFrequencyData(dataArray);

          // Calculate RMS amplitude
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          // Normalize to 0-1 range (analyser returns 0-255)
          const normalized = avg / 255;

          setAmplitude(normalized);
        } catch {
          // Analyser may be disconnected - stop polling
          return;
        }
        animationFrameRef.current = requestAnimationFrame(updateAmplitude);
      };

      animationFrameRef.current = requestAnimationFrame(updateAmplitude);
    } catch (error) {
      console.warn('AudioAvatar: Unexpected error setting up audio:', error);
      setMicUnavailable(true);
      setAnimationState(getAnimationState(micEnabled, gesture));
      hasInitializedRef.current = true;
    }
  }, [micEnabled, gesture]);

  // Clean up audio visualization
  const cleanupAudioVisualization = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => track.stop());
      } catch {
        // Ignore cleanup errors
      }
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {
        // Ignore cleanup errors
      }
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    isConnectedRef.current = false;
    setAmplitude(0);
  }, []);

  useEffect(() => {
    if (micEnabled) {
      setupAudioVisualization();
    } else {
      cleanupAudioVisualization();
    }

    return cleanupAudioVisualization;
  }, [micEnabled, setupAudioVisualization, cleanupAudioVisualization]);

  // Calculate visual properties based on amplitude
  const scale = 1 + amplitude * 0.15; // Scale up slightly when speaking
  const eyeOpenness = 1 - amplitude * 0.2; // Eyes slightly closed when loud
  const mouthOpenness = amplitude * 0.5; // Mouth opens with volume

  // Color interpolation based on amplitude (dark teal to gold)
  const bodyColor = darkTeal;
  const accentColor = gold;

  const getAvatarContent = () => {
    if (animationState === 'loading') {
      return (
        <g>
          {/* Skeleton outline with pulse animation */}
          <circle cx="50" cy="50" r="35" fill="none" stroke={accentColor} strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
          {/* Pulsing center indicator */}
          <circle cx="50" cy="50" r="15" fill={bodyColor} stroke={accentColor} strokeWidth="1" opacity="0.3" />
        </g>
      );
    }

    if (animationState === 'hand-raised') {
      return (
        <g>
          {/* Body - circle */}
          <circle cx="50" cy="50" r="35" fill={bodyColor} stroke={accentColor} strokeWidth="2" />
          {/* Eyes */}
          <ellipse cx="38" cy="45" rx="4" ry={5 * eyeOpenness} fill="white" />
          <ellipse cx="62" cy="45" rx="4" ry={5 * eyeOpenness} fill="white" />
          <circle cx="38" cy="45" r="2" fill={darkTeal} />
          <circle cx="62" cy="45" r="2" fill={darkTeal} />
          {/* Hand raised indicator */}
          <g transform="translate(70, 10) rotate(15)">
            <path
              d="M10 40 L10 15 Q10 5 15 5 L20 5 Q25 5 25 15 L25 40"
              fill={accentColor}
              stroke="white"
              strokeWidth="1.5"
            />
            <path
              d="M25 40 L25 15 Q25 5 30 5 L35 5 Q40 5 40 15 L40 40"
              fill={accentColor}
              stroke="white"
              strokeWidth="1.5"
            />
          </g>
        </g>
      );
    }

    return (
      <g>
        {/* Body - circle */}
        <circle cx="50" cy="50" r="35" fill={bodyColor} stroke={accentColor} strokeWidth="2" />
        {/* Eyes */}
        <ellipse cx="38" cy="45" rx="4" ry={5 * eyeOpenness} fill="white" />
        <ellipse cx="62" cy="45" rx="4" ry={5 * eyeOpenness} fill="white" />
        <circle cx="38" cy="45" r="2" fill={darkTeal} />
        <circle cx="62" cy="45" r="2" fill={darkTeal} />
        {/* Mouth - opens based on amplitude */}
        <ellipse
          cx="50"
          cy="62"
          rx={6 + mouthOpenness * 8}
          ry={3 + mouthOpenness * 6}
          fill={darkTeal}
        />
        {/* Mic unavailable indicator */}
        {micUnavailable && (
          <g transform="translate(75, 65)">
            <circle cx="0" cy="0" r="8" fill="#ef4444" stroke="white" strokeWidth="1" />
            <line x1="-4" y1="0" x2="4" y2="0" stroke="white" strokeWidth="1.5" />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="white" strokeWidth="1.5" />
          </g>
        )}
      </g>
    );
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ backgroundColor: '#09090b' }}
    >
      <svg
        viewBox="0 0 100 100"
        className={`audio-avatar ${animationState}`}
        style={{
          width: '180px',
          height: '180px',
          transform: `scale(${scale})`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {getAvatarContent()}
      </svg>

      <style>{`
        .audio-avatar.loading {
          animation: loadingPulse 1.5s ease-in-out infinite;
        }

        .audio-avatar.idle {
          animation: idleFloat 3s ease-in-out infinite;
        }

        .audio-avatar.speaking {
          animation: speaking 0.15s ease-in-out infinite;
        }

        .audio-avatar.hand-raised {
          animation: handRaised 1s ease-in-out infinite;
        }

        .audio-avatar.mic-unavailable {
          animation: idleFloat 3s ease-in-out infinite;
        }

        @keyframes loadingPulse {
          0%, 100% { opacity: 0.4; transform: scale(0.95); }
          50% { opacity: 0.8; transform: scale(1); }
        }

        @keyframes idleFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-5px) scale(1.02); }
        }

        @keyframes speaking {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes handRaised {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-3deg) scale(1.02); }
          75% { transform: rotate(3deg) scale(1.02); }
        }
      `}</style>
    </div>
  );
}