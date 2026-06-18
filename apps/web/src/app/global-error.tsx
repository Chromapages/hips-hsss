'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('Unhandled Global Error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-text-primary flex flex-col items-center justify-center p-6 text-center font-body">
        <div className="max-w-md space-y-6">
          <h1 className="font-heading text-3xl font-extrabold text-primary">Something went wrong</h1>
          <p className="text-text-muted text-sm leading-relaxed">
            An unexpected application error has occurred. Our team has been notified.
          </p>
          <button
            onClick={reset}
            className="h-11 px-6 rounded-full bg-primary text-primary-foreground hover:bg-accent font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
