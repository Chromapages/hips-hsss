const MEDIA_UNAVAILABLE_MESSAGE =
  "Microphone access is unavailable in this browser context. Open the site over HTTPS or use localhost, then try again.";

export function getBrowserMediaDevices(): MediaDevices {
  if (
    typeof window === "undefined" ||
    typeof navigator === "undefined" ||
    !navigator.mediaDevices ||
    typeof navigator.mediaDevices.getUserMedia !== "function"
  ) {
    throw new Error(MEDIA_UNAVAILABLE_MESSAGE);
  }

  return navigator.mediaDevices;
}

export function hasBrowserMediaDevices(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === "function"
  );
}

export { MEDIA_UNAVAILABLE_MESSAGE };
