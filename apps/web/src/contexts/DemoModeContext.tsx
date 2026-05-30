'use client';

import { createContext, useContext, useRef, type ReactNode } from 'react';

interface DemoModeContextValue {
  isDemo: boolean;
  /** Set by DemoRoomContent when the LiveKit room is ready. Call to disconnect before exit. */
  setExitCallback: (fn: (() => void) | null) => void;
}

const DemoModeContext = createContext<DemoModeContextValue>({
  isDemo: false,
  setExitCallback: () => {},
});

export function DemoModeProvider({
  children,
  isDemo = true,
}: {
  children: ReactNode;
  isDemo?: boolean;
}) {
  const exitCallbackRef = useRef<(() => void) | null>(null);
  return (
    <DemoModeContext.Provider
      value={{
        isDemo,
        setExitCallback: (fn) => {
          exitCallbackRef.current = fn;
        },
      }}
    >
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode(): DemoModeContextValue {
  return useContext(DemoModeContext);
}

export function useDemoExit(): (() => void) | null {
  const { isDemo } = useDemoMode();
  const exitCallbackRef = useRef<(() => void) | null>(null);
  if (!isDemo) return null;
  // The ref is written by DemoRoomContent via setExitCallback — read current value
  const ctx = useContext(DemoModeContext);
  // We return a function that reads the ref at call time, not render time
  return () => ctx.setExitCallback as unknown as (() => void) | null;
}
