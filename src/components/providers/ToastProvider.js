"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

function ToastItem({ toast, onDismiss }) {
  const toneClasses =
    toast.tone === "error"
      ? "border-[#f1b5ad] bg-[#fff5f3] text-[#8a271a]"
      : "border-[#d9e8de] bg-[#f5fbf7] text-[#166534]";

  return (
    <div
      className={`pointer-events-auto min-w-[280px] max-w-[360px] rounded-[16px] border px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.08)] backdrop-blur transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${toneClasses}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.75rem] font-medium uppercase tracking-[0.12em] opacity-70">{toast.label}</p>
          <p className="mt-1 text-[0.92rem] leading-[1.6]">{toast.message}</p>
        </div>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="text-[0.8rem] font-medium uppercase tracking-[0.08em] opacity-60 transition-opacity duration-200 hover:opacity-100"
          aria-label="Dismiss notification"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, options = {}) => {
    const id = crypto.randomUUID();
    const nextToast = {
      id,
      tone: options.tone || "success",
      label: options.label || (options.tone === "error" ? "Something went wrong" : "Success"),
      message,
    };

    setToasts((prev) => [...prev, nextToast]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, options.duration ?? 4200);
  }, []);

  const value = useMemo(
    () => ({
      showToast,
      dismissToast,
    }),
    [dismissToast, showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[120] flex flex-col items-center gap-3 px-4 sm:items-end sm:px-6 lg:px-10">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}
