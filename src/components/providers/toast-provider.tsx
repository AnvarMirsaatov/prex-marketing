"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { ToastItem, ToastType } from "@/types/toast";

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration = 4000) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl shadow-lg border text-sm font-medium transition-all transform translate-y-0 ${
              t.type === "success"
                ? "bg-emerald-900/95 text-emerald-100 border-emerald-700/50 shadow-emerald-950/40"
                : t.type === "error"
                  ? "bg-rose-900/95 text-rose-100 border-rose-700/50 shadow-rose-950/40"
                  : t.type === "warning"
                    ? "bg-amber-900/95 text-amber-100 border-amber-700/50 shadow-amber-950/40"
                    : "bg-slate-900/95 text-slate-100 border-slate-700/50 shadow-slate-950/40"
            }`}
          >
            <span>{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="text-current opacity-70 hover:opacity-100 text-lg leading-none"
              aria-label="Yopish"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
