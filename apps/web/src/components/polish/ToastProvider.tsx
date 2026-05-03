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
            background: '#000000',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: 'white',
            borderRadius: '16px',
            fontSize: '13px'
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
