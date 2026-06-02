'use client';

import { useRouter } from 'next/navigation';
import { LogOut, AlertCircle } from 'lucide-react';

interface DemoBannerProps {
  /** Optional callback to disconnect from LiveKit before navigation */
  onDisconnect?: () => void | Promise<void>;
  /** Custom exit destination, defaults to /join */
  exitPath?: string;
  /**
   * Visual variant. `'dark'` (default) is the original gold-on-teal glass
   * banner. `'light'` re-themes the badge for surfaces that sit on a light
   * page — currently the demo-room.
   */
  variant?: 'light' | 'dark';
}

/**
 * DemoBanner — persistent non-intrusive demo mode indicator.
 *
 * Renders a small badge in the top-right corner showing "DEMO SESSION"
 * with an Exit button. Designed to not interfere with MediaToolbar or
 * other room controls.
 */
export function DemoBanner({ onDisconnect, exitPath = '/join', variant = 'dark' }: DemoBannerProps) {
  const router = useRouter();

  const handleExit = async () => {
    if (onDisconnect) {
      await onDisconnect();
    }
    router.push(exitPath);
  };

  const isLight = variant === 'light';
  const badge = isLight
    ? 'flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 backdrop-blur-md shadow-md shadow-accent/20'
    : 'flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#0D2E2B]/90 px-4 py-2 backdrop-blur-md shadow-lg shadow-black/20';
  const pingDot = isLight ? 'bg-accent' : 'bg-[#D4AF37]';
  const staticDot = isLight ? 'bg-accent' : 'bg-[#D4AF37]';
  const badgeText = isLight
    ? 'text-xs font-bold uppercase tracking-[0.15em] text-accent'
    : 'text-xs font-bold uppercase tracking-[0.15em] text-[#D4AF37]';
  const exitBtn = isLight
    ? 'group flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-sm font-semibold text-primary backdrop-blur-md transition-all hover:border-accent/40 hover:bg-surface active:scale-95'
    : 'group flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10 active:scale-95';

  return (
    <div
      className="fixed top-4 right-4 z-50 flex items-center gap-3"
      role="status"
      aria-label="Demo session indicator"
    >
      <div className={badge}>
        <span className="relative flex h-2 w-2">
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${pingDot}`} />
          <span className={`relative inline-flex h-2 w-2 rounded-full ${staticDot}`} />
        </span>
        <span className={badgeText}>Demo Session</span>
      </div>

      <button
        onClick={handleExit}
        aria-label="Exit demo session"
        className={exitBtn}
        type="button"
      >
        <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        <span>Exit</span>
      </button>
    </div>
  );
}

/**
 * DemoBannerWithConfirm — variant that shows a confirmation dialog before exiting.
 * Use when there is an active LiveKit connection that needs clean disconnect.
 */
interface DemoBannerWithConfirmProps extends DemoBannerProps {
  roomDisconnect?: () => void | Promise<void>;
}

export function DemoBannerWithConfirm({
  roomDisconnect,
  exitPath = '/join',
  variant = 'dark',
  ...props
}: DemoBannerWithConfirmProps) {
  const router = useRouter();

  const handleExit = async () => {
    // Brief delay to allow any cleanup
    if (roomDisconnect) {
      await roomDisconnect();
    }
    // Navigate after a tiny delay to ensure disconnect completes
    setTimeout(() => router.push(exitPath), 100);
  };

  const isLight = variant === 'light';
  const badge = isLight
    ? 'flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 backdrop-blur-md shadow-md shadow-accent/20'
    : 'flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#0D2E2B]/90 px-4 py-2 backdrop-blur-md shadow-lg shadow-black/20';
  const pingDot = isLight ? 'bg-accent' : 'bg-[#D4AF37]';
  const staticDot = isLight ? 'bg-accent' : 'bg-[#D4AF37]';
  const badgeText = isLight
    ? 'text-xs font-bold uppercase tracking-[0.15em] text-accent'
    : 'text-xs font-bold uppercase tracking-[0.15em] text-[#D4AF37]';
  const alertIcon = isLight ? 'h-3 w-3 text-accent/70' : 'h-3 w-3 text-[#D4AF37]/60';
  const exitBtn = isLight
    ? 'group flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-sm font-semibold text-primary backdrop-blur-md transition-all hover:border-accent/40 hover:bg-surface active:scale-95'
    : 'group flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10 active:scale-95';

  return (
    <div
      className="fixed top-4 right-4 z-50 flex items-center gap-3"
      role="status"
      aria-label="Demo session indicator"
    >
      <div className={badge}>
        <span className="relative flex h-2 w-2">
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${pingDot}`} />
          <span className={`relative inline-flex h-2 w-2 rounded-full ${staticDot}`} />
        </span>
        <span className={badgeText}>Demo Session</span>
        <AlertCircle className={alertIcon} aria-hidden="true" />
      </div>

      <button
        onClick={handleExit}
        aria-label="Exit demo session"
        className={exitBtn}
        type="button"
      >
        <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        <span>Exit</span>
      </button>
    </div>
  );
}
