"use client";

import { Toaster, toast as sonnerToast } from "sonner";
import { type ReactNode } from "react";

type ToastKind = "success" | "error" | "warning";

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster 
        theme="dark" 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'rgba(3, 7, 18, 0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white'
          }
        }} 
      />
    </>
  );
}

export function useToast() {
  const toast = (kind: ToastKind, message: string) => {
    if (kind === "success") {
      sonnerToast.success(message);
    } else if (kind === "error") {
      sonnerToast.error(message);
    } else if (kind === "warning") {
      sonnerToast.warning(message);
    } else {
      sonnerToast(message);
    }
  };

  return toast;
}
