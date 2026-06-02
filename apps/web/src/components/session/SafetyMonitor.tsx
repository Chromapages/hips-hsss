'use client';
import { useState, useEffect } from 'react';
import { useChat, useDataChannel, useLocalParticipant } from '@livekit/components-react';
import { useToast } from '@/components/polish/ToastProvider';
import { AlertTriangle, ShieldAlert, MessageSquare } from 'lucide-react';

interface SafetyMonitorProps {
  sessionId: string;
  onKick?: (reason: string) => void;
  onCrisis?: (reason: string) => void;
  /**
   * Visual variant. `'dark'` (default) is the immersive stage chrome used by
   * the live `/session/[id]` room. `'light'` re-themes the panel for surfaces
   * that sit on a light page — currently the demo-room.
   */
  variant?: 'light' | 'dark';
}

export default function SafetyMonitor({
  sessionId,
  onKick,
  onCrisis,
  variant = 'dark',
}: SafetyMonitorProps) {
  const { chatMessages, send } = useChat();
  const { localParticipant } = useLocalParticipant();
  const toast = useToast();
  const [inputText, setInputText] = useState('');

  // 1. Listen for Safety Events from the Server
  useDataChannel((msg) => {
    try {
      const decoder = new TextDecoder();
      const data = JSON.parse(decoder.decode(msg.payload));

      if (data.type === 'SAFETY_EVENT') {
        const { category, severity, reason, action } = data.payload;

        // Handle reactive mitigations
        if (action === 'KICK') {
          toast('error', `Safety Violation: You have been removed from the session.`);
          if (onKick) {
            onKick(reason);
          } else {
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 3000);
          }
          return;
        }

        if (action === 'MUTE') {
          toast('error', `Safety Alert: Your messaging privileges have been suspended. Reason: ${reason}`);
        } else if (severity === 'CRITICAL') {
          toast('error', `CRITICAL SAFETY ALERT: ${reason}`);
          if (onCrisis) {
            onCrisis(reason);
          }
        } else if (severity === 'HIGH') {
          toast('error', `Safety Alert: ${category}. ${reason}`);
        } else {
          toast('warning', `Guardian Note: ${category} detected. Please stay safe.`);
        }

        console.warn(`[SafetyEvent] Received ${category} (${severity}) with action ${action}: ${reason}`);
      }
    } catch {
      // Ignore non-JSON messages or messages not meant for us
    }
  });

  // 2. Forward new messages to the Safety Engine
  useEffect(() => {
    const lastMessage = chatMessages[chatMessages.length - 1];

    // Only forward messages sent by the local participant to avoid duplicate analysis
    if (lastMessage && lastMessage.from?.identity === localParticipant.identity) {
      fetch('/api/safety/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          participantId: localParticipant.identity,
          text: lastMessage.message,
        }),
      }).catch((err) => console.error('Safety Engine Error:', err));
    }
  }, [chatMessages, localParticipant.identity, sessionId]);

  const handleManualFlag = async () => {
    const reason = window.prompt('Please describe the safety concern:');
    if (!reason) return;

    try {
      await fetch('/api/safety/flag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          reporterId: localParticipant.identity,
          level: 'HIGH',
          reason,
        }),
      });
      toast('success', 'Safety report submitted. Guardian team notified.');
    } catch {
      toast('error', 'Failed to submit report. Please try again.');
    }
  };

  // Check if participant has permission to send data (chat)
  const canChat = localParticipant.permissions?.canPublishData !== false;

  const handleSend = () => {
    if (inputText.trim() && canChat) {
      send(inputText);
      setInputText('');
    }
  };

  const isLight = variant === 'light';

  // Variant-driven tokens
  const wrapper = isLight
    ? 'flex flex-col h-full bg-surface border-l border-border'
    : 'flex flex-col h-full bg-zinc-900 border-l border-zinc-800';
  const headerRow = isLight
    ? 'p-4 border-b border-border flex items-center justify-between bg-background/70 backdrop-blur-md sticky top-0 z-10'
    : 'p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10';
  const headerTitle = isLight ? 'text-primary font-medium' : 'text-zinc-300 font-medium';
  const headerIcon = isLight ? 'text-accent' : 'text-[#173B57]';
  const flagIdle = isLight
    ? 'p-1.5 rounded-lg hover:bg-destructive/10 text-text-muted hover:text-destructive transition-colors'
    : 'p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors';
  const safetyBadge = isLight
    ? 'flex items-center gap-1.5 px-2 py-1 rounded-full bg-accent/10 border border-accent/30'
    : 'flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#173B57]/10 border border-[#173B57]/20';
  const safetyDot = isLight ? 'w-2 h-2 rounded-full bg-accent animate-pulse' : 'w-2 h-2 rounded-full bg-[#173B57] animate-pulse';
  const safetyLabel = isLight
    ? 'text-[10px] uppercase tracking-wider text-accent font-bold'
    : 'text-[10px] uppercase tracking-wider text-[#173B57] font-bold';
  const timestamp = isLight ? 'text-[10px] text-text-muted mb-1 px-1' : 'text-[10px] text-zinc-500 mb-1 px-1';
  const ownBubble = isLight
    ? 'bg-primary text-primary-foreground rounded-tr-none shadow-sm shadow-primary/20'
    : 'bg-[#173B57] text-white rounded-tr-none shadow-lg shadow-[#173B57]/20';
  const otherBubble = isLight
    ? 'bg-background text-primary rounded-tl-none border border-border'
    : 'bg-zinc-800 text-zinc-200 rounded-tl-none border border-zinc-700';
  const emptyIconBg = isLight
    ? 'w-12 h-12 rounded-full bg-surface flex items-center justify-center ring-1 ring-border'
    : 'w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center';
  const emptyIcon = isLight ? 'w-6 h-6 text-text-muted' : 'w-6 h-6 text-zinc-600';
  const emptyTitle = isLight ? 'text-primary font-medium' : 'text-zinc-400 font-medium';
  const emptyBody = isLight ? 'text-text-muted text-xs mt-1' : 'text-zinc-500 text-xs mt-1';
  const inputShell = isLight
    ? 'p-4 bg-background/80 backdrop-blur-md border-t border-border'
    : 'p-4 bg-zinc-900/80 backdrop-blur-md border-t border-zinc-800';
  const inputField = isLight
    ? 'flex-1 bg-surface text-primary rounded-xl px-4 py-2.5 text-sm border border-border focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-text-muted'
    : 'flex-1 bg-zinc-800 text-white rounded-xl px-4 py-2.5 text-sm border border-zinc-700 focus:outline-none focus:border-[#173B57] focus:ring-1 focus:ring-[#173B57] transition-all placeholder:text-zinc-500';
  const sendBtn = isLight
    ? 'bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:hover:bg-primary text-primary-foreground px-4 py-2 rounded-xl transition-colors flex items-center justify-center'
    : 'bg-[#173B57] hover:bg-[#173B57] disabled:opacity-50 disabled:hover:bg-[#173B57] text-white px-4 py-2 rounded-xl transition-colors flex items-center justify-center';

  return (
    <div className={wrapper}>
      <div className={headerRow}>
        <div className="flex items-center gap-2">
          <MessageSquare className={`w-4 h-4 ${headerIcon}`} />
          <span className={headerTitle}>Session Chat</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleManualFlag}
            className={flagIdle}
            title="Flag Safety Concern"
            type="button"
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
          <div className={safetyBadge}>
            <div className={safetyDot} />
            <span className={safetyLabel}>Safety Active</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {chatMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              msg.from?.identity === localParticipant.identity ? 'items-end' : 'items-start'
            }`}
          >
            <span className={timestamp}>
              {msg.from?.identity === localParticipant.identity
                ? 'You'
                : 'Anonymous Participant'}
            </span>
            <div
              className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                msg.from?.identity === localParticipant.identity ? ownBubble : otherBubble
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
        {chatMessages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-3 px-6">
            <div className={emptyIconBg}>
              <ShieldAlert className={emptyIcon} />
            </div>
            <div>
              <p className={emptyTitle}>Automated Guardian Active</p>
              <p className={emptyBody}>
                Messages are monitored in real-time to ensure a safe, supportive space for everyone.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className={inputShell}>
        {!canChat ? (
          <div
            role="alert"
            className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-xs"
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <p>Your messaging privileges have been temporarily suspended due to a safety violation.</p>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a supportive message..."
              className={inputField}
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className={sendBtn}
              type="button"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
