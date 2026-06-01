"use client";

import { Toaster, toast as sonnerToast } from "sonner";
import { type ReactNode } from "react";

type ToastKind = "success" | "error" | "warning";

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        theme="light"
        position="top-right"
        toastOptions={{
          style: {
            background: '#FFFFFF',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            color: '#18181B',
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
