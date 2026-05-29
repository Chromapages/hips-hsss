'use client';

import { useEffect, useState } from 'react';

export function useWebGLSupport() {
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const isSupported = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
      setSupported(isSupported);
    } catch {
      setSupported(false);
    }
  }, []);

  return supported;
}