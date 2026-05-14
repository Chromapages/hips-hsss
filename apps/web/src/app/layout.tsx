import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "H.I.P.S. — Find Support. Stay Anonymous.",
  description:
    "Peer support, coaching, and care navigation for individuals in crisis, leaders facing burnout, and organizations seeking confidential restoration services.",
};

import { AuthProvider } from "@/components/providers/auth-provider";
import { ToastProvider } from "@/components/toast-provider";
import { GlobalErrorBoundary } from "@/components/error-boundary";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-primary focus:text-white focus:font-medium focus:rounded-lg focus:ring-2 focus:ring-brand-primary/30"
        >
          Skip to main content
        </a>
        <AuthProvider>
          <ToastProvider>
            <GlobalErrorBoundary>
              {children}
            </GlobalErrorBoundary>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
