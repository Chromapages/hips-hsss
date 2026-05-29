'use client';

import { createContext, useContext, type ReactNode } from 'react';

interface DemoModeContextValue {
  isDemo: boolean;
}

const DemoModeContext = createContext<DemoModeContextValue>({
  isDemo: false,
});

export function DemoModeProvider({
  children,
  isDemo = true,
}: {
  children: ReactNode;
  isDemo?: boolean;
}) {
  return (
    <DemoModeContext.Provider value={{ isDemo }}>
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode(): DemoModeContextValue {
  return useContext(DemoModeContext);
}
