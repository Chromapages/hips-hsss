import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "H.I.P.S. — Find Support. Stay Anonymous.",
  description:
    "Peer support, coaching, and care navigation for individuals in crisis, leaders facing burnout, and organizations seeking confidential restoration services.",
};

import { AuthProvider } from "@/components/providers/auth-provider";
import { ToastProvider } from "@/components/toast-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
