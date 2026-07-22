export type BrowserFamily =
  | "chrome"
  | "edge"
  | "firefox"
  | "opera"
  | "safari"
  | "samsung"
  | "unknown";

export interface BrowserEnvironment {
  browserFamily: BrowserFamily;
  mobile: boolean;
}

export interface BrowserVoiceCapabilities extends BrowserEnvironment {
  secureContext: boolean;
  mediaDevices: boolean;
  getUserMedia: boolean;
  mediaRecorder: boolean;
  audioContext: boolean;
  recorderMimeType: string | null;
  supportedRecorderMimeTypes: string[];
  supportedConstraints: MediaTrackSupportedConstraints;
  canCaptureAudio: boolean;
  canProcessAudio: boolean;
  canRecordAudio: boolean;
}

export interface MediaRecorderSupport {
  isTypeSupported(mimeType: string): boolean;
}

const RECORDER_MIME_TYPE_CANDIDATES = [
  "audio/webm;codecs=opus",
  "audio/ogg;codecs=opus",
  "audio/mp4;codecs=mp4a.40.2",
  "audio/mp4",
  "audio/webm",
] as const;

/**
 * Returns browser and form-factor hints for support messaging. These hints must
 * not be used as a substitute for feature detection.
 */
export function detectBrowserEnvironment(userAgent?: string): BrowserEnvironment {
  const ua = userAgent ?? (typeof navigator !== "undefined" ? navigator.userAgent : "");
  const mobile = /Android|webOS|iPhone|iPad|iPod|IEMobile|Opera Mini|Mobile/i.test(ua);

  // Every browser on iOS uses WebKit media behavior, including branded Chrome,
  // Firefox, and Edge shells. Treat them as Safari for audio format guidance.
  if (/(?:iPhone|iPad|iPod)/i.test(ua)) {
    return { browserFamily: "safari", mobile: true };
  }

  if (/SamsungBrowser\//i.test(ua)) {
    return { browserFamily: "samsung", mobile };
  }
  if (/(?:Edg|Edge|EdgiOS|EdgA)\//i.test(ua)) {
    return { browserFamily: "edge", mobile };
  }
  if (/(?:OPR|Opera)\//i.test(ua)) {
    return { browserFamily: "opera", mobile };
  }
  if (/(?:Firefox|FxiOS)\//i.test(ua)) {
    return { browserFamily: "firefox", mobile };
  }
  if (/(?:Chrome|CriOS)\//i.test(ua)) {
    return { browserFamily: "chrome", mobile };
  }
  if (/Safari\//i.test(ua) && /(?:Version|CPU (?:iPhone )?OS)\//i.test(ua)) {
    return { browserFamily: "safari", mobile };
  }

  return { browserFamily: "unknown", mobile };
}

export function getSupportedRecorderMimeTypes(
  mediaRecorderConstructor: MediaRecorderSupport | undefined =
    typeof MediaRecorder !== "undefined" ? MediaRecorder : undefined,
): string[] {
  if (
    !mediaRecorderConstructor ||
    typeof mediaRecorderConstructor.isTypeSupported !== "function"
  ) {
    return [];
  }

  return RECORDER_MIME_TYPE_CANDIDATES.filter((mimeType) => {
    try {
      return mediaRecorderConstructor.isTypeSupported(mimeType);
    } catch {
      return false;
    }
  });
}

export function negotiateRecorderMimeType(
  mediaRecorderConstructor?: MediaRecorderSupport,
  browserFamily: BrowserFamily = detectBrowserEnvironment().browserFamily,
): string | null {
  const supported = getSupportedRecorderMimeTypes(mediaRecorderConstructor);
  const preference = browserFamily === "safari"
    ? ["audio/mp4;codecs=mp4a.40.2", "audio/mp4", "audio/webm;codecs=opus", "audio/webm"]
    : browserFamily === "firefox"
      ? ["audio/ogg;codecs=opus", "audio/webm;codecs=opus", "audio/webm", "audio/mp4"]
      : ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", "audio/mp4"];
  return preference.find((mimeType) => supported.includes(mimeType)) ?? supported[0] ?? null;
}

function getSupportedConstraints(mediaDevices?: MediaDevices): MediaTrackSupportedConstraints {
  if (!mediaDevices || typeof mediaDevices.getSupportedConstraints !== "function") {
    return {};
  }

  try {
    return { ...mediaDevices.getSupportedConstraints() };
  } catch {
    return {};
  }
}

/**
 * Performs a synchronous, permission-free browser voice preflight. It does not
 * access the microphone; callers should request permission only after a user
 * action.
 */
export function getBrowserVoiceCapabilities(): BrowserVoiceCapabilities {
  const browserEnvironment = detectBrowserEnvironment();
  const browserWindow = typeof window !== "undefined" ? window : undefined;
  const browserNavigator = typeof navigator !== "undefined" ? navigator : undefined;
  const mediaDevices = browserNavigator?.mediaDevices;
  const mediaRecorderConstructor =
    typeof MediaRecorder !== "undefined" ? MediaRecorder : undefined;
  const hasMediaDevices = !!mediaDevices;
  const hasGetUserMedia = typeof mediaDevices?.getUserMedia === "function";
  const hasMediaRecorder = !!mediaRecorderConstructor;
  const hasAudioContext = !!(
    browserWindow &&
    (browserWindow.AudioContext ||
      (browserWindow as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext)
  );
  const secureContext = browserWindow?.isSecureContext === true;
  const supportedRecorderMimeTypes = getSupportedRecorderMimeTypes(
    mediaRecorderConstructor,
  );

  return {
    ...browserEnvironment,
    secureContext,
    mediaDevices: hasMediaDevices,
    getUserMedia: hasGetUserMedia,
    mediaRecorder: hasMediaRecorder,
    audioContext: hasAudioContext,
    recorderMimeType: negotiateRecorderMimeType(
      mediaRecorderConstructor,
      browserEnvironment.browserFamily,
    ),
    supportedRecorderMimeTypes,
    supportedConstraints: getSupportedConstraints(mediaDevices),
    canCaptureAudio: secureContext && hasGetUserMedia,
    canProcessAudio: secureContext && hasGetUserMedia && hasAudioContext,
    canRecordAudio: secureContext && hasGetUserMedia && hasMediaRecorder,
  };
}

export { RECORDER_MIME_TYPE_CANDIDATES };
