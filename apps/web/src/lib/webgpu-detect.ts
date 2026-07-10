/**
 * WebGPU Capability Detector
 * Checks if the user's browser and hardware support WebGPU for local speech-to-speech voice replacement.
 */
type NavigatorWithWebGPU = Navigator & {
  gpu?: {
    requestAdapter: () => Promise<unknown>;
  };
};

export async function checkWebGPUSupport(): Promise<boolean> {
  const nav = typeof navigator === "undefined" ? undefined : (navigator as NavigatorWithWebGPU);
  if (typeof window === "undefined" || !nav?.gpu) {
    return false;
  }
  try {
    const adapter = await nav.gpu.requestAdapter();
    return !!adapter;
  } catch {
    return false;
  }
}
