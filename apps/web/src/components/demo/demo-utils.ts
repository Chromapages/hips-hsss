'use client';

export const screenLabels = {
  room: 'Anonymous Room',
  safety: 'Safety Engine Active',
  participants: 'Participants',
  handQueue: 'Hand Queue',
  handEmpty: 'Raise your hand when you need facilitator attention.',
  you: 'You',
  peer: 'Peer',
  voiceMaskActive: 'Voice mask active — pitch shift + reverb',
};

export const voiceMaskActiveStyle = {
  position: 'absolute' as const,
  bottom: '1.5rem',
  left: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.75rem',
  color: '#4ade80',
  backgroundColor: 'rgba(74, 222, 128, 0.1)',
  border: '1px solid rgba(74, 222, 128, 0.2)',
  padding: '0.5rem 0.75rem',
  borderRadius: '9999px',
  cursor: 'default',
};

export const brandColors = {
  indigo: '#6366F1',
  indigoDark: '#4F46E5',
  purple: '#9333EA',
  emerald: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
  slate: {
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  zinc: {
    950: '#09090B',
  },
};

export const animations = {
  fadeIn: 'fadeIn 0.3s ease-out forwards',
  pulse: 'pulse 2s ease-in-out infinite',
  spin: 'spin 1s linear infinite',
  speakRing: 'speakRing 1s ease-in-out infinite',
};

export const avatarSizes = {
  mobile: '5rem',
  desktop: '8rem',
  desktopSm: '6rem',
};

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  if (mins > 0) {
    let text = mins + ' minute' + (mins !== 1 ? 's' : '');
    if (secs > 0) {
      text += ' ' + secs + ' second' + (secs !== 1 ? 's' : '');
    }
    return text;
  }
  return secs + ' second' + (secs !== 1 ? 's' : '');
}

export function generateAnonId(): string {
  return 'anon_' + Math.random().toString(36).slice(2, 6).toUpperCase();
}

export const ROOM_NAME = 'demo-room-hips';
export const PITCH_SHIFT_SEMITONES = 4;