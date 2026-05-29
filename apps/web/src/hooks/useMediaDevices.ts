'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseMediaDevicesReturn {
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
}

export function useMediaDevices(): UseMediaDevicesReturn {
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
      setAudioInputs(devices.filter((d) => d.kind === 'audioinput'));
      setAudioOutputs(devices.filter((d) => d.kind === 'audiooutput'));
      setVideoInputs(devices.filter((d) => d.kind === 'videoinput'));
    } catch {
      // enumerateDevices may fail in some browsers
    }
  }, []);

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
      setMicPermissionGranted(false);
    }
  }, []);

  // Request camera permission
  const requestCameraPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setCameraPermissionGranted(true);
    } catch {
      setCameraPermissionGranted(false);
    }
  }, []);

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
      micStreamRef.current = null;
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
  };
}