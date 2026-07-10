import React from 'react';

export function PageMain({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <main id="main" tabIndex={-1} className={className} style={{ outline: 'none' }}>
      {children}
    </main>
  );
}
export default PageMain;
