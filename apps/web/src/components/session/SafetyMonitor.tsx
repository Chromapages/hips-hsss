'use client';

import { useState, useEffect } from 'react';
import { useChat, useDataChannel, useLocalParticipant } from '@livekit/components-react';
import { useToast } from '@/components/polish/ToastProvider';
import { AlertTriangle, ShieldAlert, MessageSquare } from 'lucide-react';

export default function SafetyMonitor({ 
  sessionId, 
  onKick,
  onCrisis
}: { 
  sessionId: string;
  onKick?: (reason: string) => void;
  onCrisis?: (reason: string) => void;
}) {
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
          // The 'canChat' logic already handles disabling the input based on permissions
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
          text: lastMessage.message
        }),
      }).catch(err => console.error('Safety Engine Error:', err));
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
          reason
        }),
      });
      toast('success', 'Safety report submitted. Guardian team notified.');
    } catch {
      toast('error', 'Failed to submit report. Please try again.');
    }
  };

  const handleSend = () => {
    if (inputText.trim() && canChat) {
      send(inputText);
      setInputText('');
    }
  };

  // Check if participant has permission to send data (chat)
  const canChat = localParticipant.permissions?.canPublishData !== false;

  return (
    <div className="flex flex-col h-full bg-zinc-900 border-l border-zinc-800">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          <span className="text-zinc-300 font-medium">Session Chat</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleManualFlag}
            className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors"
            title="Flag Safety Concern"
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold">Safety Active</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.from?.identity === localParticipant.identity ? 'items-end' : 'items-start'}`}>
            <span className="text-[10px] text-zinc-500 mb-1 px-1">
              {msg.from?.identity === localParticipant.identity ? 'You' : 'Anonymous Participant'}
            </span>
            <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
              msg.from?.identity === localParticipant.identity 
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-900/20' 
                : 'bg-zinc-800 text-zinc-200 rounded-tl-none border border-zinc-700'
            }`}>
              {msg.message}
            </div>
          </div>
        ))}
        {chatMessages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-3 px-6">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-zinc-600" />
            </div>
            <div>
              <p className="text-zinc-400 font-medium">Automated Guardian Active</p>
              <p className="text-zinc-500 text-xs mt-1">
                Messages are monitored in real-time to ensure a safe, supportive space for everyone.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-zinc-900/80 backdrop-blur-md border-t border-zinc-800">
         {!canChat ? (
           <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
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
               className="flex-1 bg-zinc-800 text-white rounded-xl px-4 py-2.5 text-sm border border-zinc-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-500" 
             />
             <button 
               onClick={handleSend} 
               disabled={!inputText.trim()}
               className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white px-4 py-2 rounded-xl transition-colors flex items-center justify-center"
             >
               <MessageSquare className="w-4 h-4" />
             </button>
           </div>
         )}
      </div>
    </div>
  );
}
