'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRoomContext, useDataChannel } from '@livekit/components-react';

export type HandControlMessage = {
  type: 'HAND_RAISED' | 'HAND_LOWERED';
  participantIdentity: string;
  at: string;
};

const textEncoder = new TextEncoder();

function decodeControlMessage(payload: Uint8Array): HandControlMessage | null {
  try {
    const parsed = JSON.parse(new TextDecoder().decode(payload)) as Partial<HandControlMessage>;
    if (
      (parsed.type === 'HAND_RAISED' || parsed.type === 'HAND_LOWERED') &&
      typeof parsed.participantIdentity === 'string' &&
      typeof parsed.at === 'string'
    ) {
      return parsed as HandControlMessage;
    }
  } catch {
    return null;
  }
  return null;
}

export function useRaisedHands() {
  const room = useRoomContext();
  const { send } = useDataChannel('session-control');
  const [raisedHands, setRaisedHands] = useState<Set<string>>(new Set());

  const applyControlMessage = useCallback((message: HandControlMessage) => {
    setRaisedHands((current) => {
      const next = new Set(current);
      if (message.type === 'HAND_RAISED') {
        next.add(message.participantIdentity);
      } else {
        next.delete(message.participantIdentity);
      }
      return next;
    });
  }, []);

  // Listen for hand control messages
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleMessage = (message: any) => {
      if (message?.payload) {
        const controlMessage = decodeControlMessage(message.payload as Uint8Array);
        if (controlMessage) {
          applyControlMessage(controlMessage);
        }
      }
    };

    // Register handler via useDataChannel
    // Note: useDataChannel handles cleanup automatically when the component unmounts
    useDataChannel('session-control', handleMessage);
  }, [applyControlMessage]);

  const publishHandChange = useCallback(
    async (type: 'HAND_RAISED' | 'HAND_LOWERED', participantIdentity: string) => {
      const message: HandControlMessage = {
        type,
        participantIdentity,
        at: new Date().toISOString(),
      };
      applyControlMessage(message);
      await send(textEncoder.encode(JSON.stringify(message)), {
        reliable: true,
        topic: 'session-control',
      });
    },
    [applyControlMessage, send],
  );

  return {
    raisedHands,
    raisedHandList: Array.from(raisedHands),
    publishHandChange,
    setRaisedHands,
  };
}