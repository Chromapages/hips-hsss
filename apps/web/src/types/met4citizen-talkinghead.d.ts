declare module "@met4citizen/talkinghead" {
  export class TalkingHead {
    constructor(node: HTMLElement, options?: Record<string, unknown>);
    showAvatar(avatar: Record<string, unknown>, onprogress?: ((url: string, event: ProgressEvent) => void) | null): Promise<void>;
    start(): void;
    stop(): void;
    setMood(mood: string): void;
    setView(view: string, options?: Record<string, unknown> | null): void;
    lookAtCamera(durationMs: number): void;
    playGesture(name: string, duration?: number, mirror?: boolean, transitionMs?: number): void;
    stopGesture(transitionMs?: number): void;
    speakBreak(durationMs: number): Promise<void>;
  }
}
