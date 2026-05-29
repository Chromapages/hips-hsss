'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseDemoMediaDevicesReturn {
  audioInputs: MediaDeviceInfo[];
  audioOutputs: MediaDeviceInfo[];
  videoInputs: MediaDeviceInfo[];
  selectedAudioInput: string | null;
  selectedAudioOutput: string | null;
  selectedVideoInput: string | null;
  selectAudioInput: (deviceId: string) => void;
  selectAudioOutput: (deviceId: string) => void;
  selectVideoInput: (deviceId: string) => void;
  micPermissionGranted: boolean;
  cameraPermissionGranted: boolean;
  micStream: MediaStream | null;
  cameraStream: MediaStream | null;
  refreshDevices: () => Promise<void>;
  audioLevel: number;
  isDemoMode: boolean;
}

// Mock devices for demo mode when no real hardware is present
const MOCK_DEVICES: { audioInputs: MediaDeviceInfo[]; audioOutputs: MediaDeviceInfo[]; videoInputs: MediaDeviceInfo[] } = {
  audioInputs: [
    {
      deviceId: 'mock-microphone-1',
      groupId: 'mock-group-1',
      kind: 'audioinput',
      label: 'Built-in Microphone (Demo)',
      toJSON: () => ({ deviceId: 'mock-microphone-1', groupId: 'mock-group-1', kind: 'audioinput', label: 'Built-in Microphone (Demo)' }),
    } as MediaDeviceInfo,
  ],
  audioOutputs: [
    {
      deviceId: 'mock-speaker-1',
      groupId: 'mock-group-1',
      kind: 'audiooutput',
      label: 'Built-in Speakers (Demo)',
      toJSON: () => ({ deviceId: 'mock-speaker-1', groupId: 'mock-group-1', kind: 'audiooutput', label: 'Built-in Speakers (Demo)' }),
    } as MediaDeviceInfo,
  ],
  videoInputs: [
    {
      deviceId: 'mock-camera-1',
      groupId: 'mock-group-1',
      kind: 'videoinput',
      label: 'Built-in Camera (Demo)',
      toJSON: () => ({ deviceId: 'mock-camera-1', groupId: 'mock-group-1', kind: 'videoinput', label: 'Built-in Camera (Demo)' }),
    } as MediaDeviceInfo,
  ],
};

export function useDemoMediaDevices(isDemo: boolean = true): UseDemoMediaDevicesReturn {
  const [audioInputs, setAudioInputs] = useState<MediaDeviceInfo[]>([]);
  const [audioOutputs, setAudioOutputs] = useState<MediaDeviceInfo[]>([]);
  const [videoInputs, setVideoInputs] = useState<MediaDeviceInfo[]>([]);

  const [selectedAudioInput, setSelectedAudioInput] = useState<string | null>(null);
  const [selectedAudioOutput, setSelectedAudioOutput] = useState<string | null>(null);
  const [selectedVideoInput, setSelectedVideoInput] = useState<string | null>(null);

  const [micPermissionGranted, setMicPermissionGranted] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);

  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  const refreshDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      // Filter real devices
      const realAudioInputs = devices.filter((d) => d.kind === 'audioinput');
      const realAudioOutputs = devices.filter((d) => d.kind === 'audiooutput');
      const realVideoInputs = devices.filter((d) => d.kind === 'videoinput');

      if (isDemo) {
        // In demo mode, use real devices if available, otherwise use mock devices
        setAudioInputs(realAudioInputs.length > 0 ? realAudioInputs : MOCK_DEVICES.audioInputs);
        setAudioOutputs(realAudioOutputs.length > 0 ? realAudioOutputs : MOCK_DEVICES.audioOutputs);
        setVideoInputs(realVideoInputs.length > 0 ? realVideoInputs : MOCK_DEVICES.videoInputs);

        // Set default selections
        if (realAudioInputs.length > 0 && !selectedAudioInput) {
          setSelectedAudioInput(realAudioInputs[0]?.deviceId);
        }
        if (realAudioOutputs.length > 0 && !selectedAudioOutput) {
          setSelectedAudioOutput(realAudioOutputs[0]?.deviceId);
        }
        if (realVideoInputs.length > 0 && !selectedVideoInput) {
          setSelectedVideoInput(realVideoInputs[0]?.deviceId);
        }
      } else {
        setAudioInputs(realAudioInputs);
        setAudioOutputs(realAudioOutputs);
        setVideoInputs(realVideoInputs);
        setSelectedAudioInput(realAudioInputs[0]?.deviceId ?? null);
        setSelectedAudioOutput(realAudioOutputs[0]?.deviceId ?? null);
        setSelectedVideoInput(realVideoInputs[0]?.deviceId ?? null);
      }
    } catch {
      // enumerateDevices may fail in some browsers - use mock devices in demo mode
      if (isDemo) {
        setAudioInputs(MOCK_DEVICES.audioInputs);
        setAudioOutputs(MOCK_DEVICES.audioOutputs);
        setVideoInputs(MOCK_DEVICES.videoInputs);
        setSelectedAudioInput('mock-microphone-1');
        setSelectedAudioOutput('mock-speaker-1');
        setSelectedVideoInput('mock-camera-1');
      }
    }
  }, [isDemo, selectedAudioInput, selectedAudioOutput, selectedVideoInput]);

  const selectAudioInput = useCallback((deviceId: string) => {
    setSelectedAudioInput(deviceId);
  }, []);

  const selectAudioOutput = useCallback((deviceId: string) => {
    setSelectedAudioOutput(deviceId);
  }, []);

  const selectVideoInput = useCallback((deviceId: string) => {
    setSelectedVideoInput(deviceId);
  }, []);

  // Request microphone permission and set up audio level metering
  const requestMicPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      setMicStream(stream);
      setMicPermissionGranted(true);

      // Set up analyser for audio level metering
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Poll audio level
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const pollLevel = () => {
        if (analyser) {
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          setAudioLevel(avg / 128);
        }
        animationFrameRef.current = requestAnimationFrame(pollLevel);
      };
      pollLevel();
    } catch {
      // In demo mode with no mic, simulate permission granted for UI
      if (isDemo) {
        setMicPermissionGranted(true);
        // Create a silent audio context for demo mode
        try {
          const audioContext = new AudioContext();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          gainNode.gain.value = 0;
          oscillator.connect(gainNode);
          oscillator.start();
          setMicStream(new MediaStream());
        } catch {
          // Ignore
        }
      } else {
        setMicPermissionGranted(false);
      }
    }
  }, [isDemo]);

  // Request camera permission
  const requestCameraPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setCameraPermissionGranted(true);
    } catch {
      // In demo mode with no camera, simulate permission granted for UI
      if (isDemo) {
        setCameraPermissionGranted(true);
        setCameraStream(new MediaStream());
      } else {
        setCameraPermissionGranted(false);
      }
    }
  }, [isDemo]);

  // Initial device enumeration and permission requests
  useEffect(() => {
    refreshDevices();

    navigator.mediaDevices.addEventListener('devicechange', refreshDevices);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', refreshDevices);
    };
  }, [refreshDevices]);

  // Request permissions on mount
  useEffect(() => {
    requestMicPermission();
    requestCameraPermission();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      micStreamRef.current?.getTracks().forEach((t) => t.stop());
      micStream?.getTracks().forEach((t) => t.stop());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    audioInputs,
    audioOutputs,
    videoInputs,
    selectedAudioInput,
    selectedAudioOutput,
    selectedVideoInput,
    selectAudioInput,
    selectAudioOutput,
    selectVideoInput,
    micPermissionGranted,
    cameraPermissionGranted,
    micStream,
    cameraStream,
    refreshDevices,
    audioLevel,
    isDemoMode: isDemo,
  };
}
