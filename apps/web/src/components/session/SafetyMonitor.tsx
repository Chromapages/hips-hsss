'use client';

import { useState, useEffect } from 'react';
import { useChat, useLocalParticipant } from '@livekit/components-react';

export default function SafetyMonitor({ sessionId }: { sessionId: string }) {
  const { chatMessages, send } = useChat();
  const { localParticipant } = useLocalParticipant();
  const [inputText, setInputText] = useState('');

  // Example: Forward new messages to the Safety Engine
  useEffect(() => {
    const lastMessage = chatMessages[chatMessages.length - 1];
    
    // Only forward messages sent by the local participant to avoid duplicate analysis 
    // from everyone in the room. The Safety Engine handles the buffer.
    if (lastMessage && lastMessage.from?.identity === localParticipant.identity) {
      // Forward to our internal Next.js API, which talks to the Safety Engine (Port 3003)
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

  const handleSend = () => {
    if (inputText.trim()) {
      send(inputText);
      setInputText('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-800 text-gray-300 font-medium bg-gray-900">
        Session Chat
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-gray-900">
        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`mb-3 ${msg.from?.identity === localParticipant.identity ? 'text-right' : 'text-left'}`}>
            <span className="text-xs text-gray-500 mb-1 block">
              {msg.from?.identity === localParticipant.identity ? 'You' : 'Anonymous Participant'}
            </span>
            <div className={`inline-block px-3 py-2 rounded-lg ${msg.from?.identity === localParticipant.identity ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-200'}`}>
              {msg.message}
            </div>
          </div>
        ))}
        {chatMessages.length === 0 && (
          <div className="text-gray-500 text-center text-sm mt-10">
            Welcome to the session. Messages are monitored for safety by our automated guardian.
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-800 bg-gray-900 flex gap-2">
         <input 
           type="text" 
           value={inputText}
           onChange={(e) => setInputText(e.target.value)}
           onKeyDown={(e) => e.key === 'Enter' && handleSend()}
           placeholder="Type a message..." 
           className="flex-1 bg-gray-800 text-white rounded px-3 py-2 border border-gray-700 focus:outline-none focus:border-indigo-500" 
         />
         <button onClick={handleSend} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded">
           Send
         </button>
      </div>
    </div>
  );
}
