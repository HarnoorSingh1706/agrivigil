"use client";

import React from "react";
import { useAgriVigil } from "@/context/AgriVigilContext";
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";

export const ToastNotification: React.FC = () => {
  const { toasts, dismissToast } = useAgriVigil();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isAlert = toast.type === "alert";
        const isWarning = toast.type === "warning";
        const isSuccess = toast.type === "success";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto transform transition-all duration-300 ease-out translate-y-0 opacity-100 flex items-start gap-3 p-4 rounded-xl shadow-xl border ${
              isAlert
                ? "bg-rose-50 border-rose-300 text-rose-950"
                : isWarning
                ? "bg-amber-50 border-amber-300 text-amber-950"
                : isSuccess
                ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                : "bg-stone-50 border-stone-300 text-stone-900"
            }`}
            role="alert"
          >
            <div className="shrink-0 mt-0.5">
              {isAlert && <AlertCircle className="w-5 h-5 text-rose-600 animate-pulse" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-600" />}
              {isSuccess && <CheckCircle className="w-5 h-5 text-emerald-600" />}
              {!isAlert && !isWarning && !isSuccess && <Info className="w-5 h-5 text-emerald-700" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold tracking-tight uppercase">{toast.title}</h4>
                <span className="text-[10px] text-stone-500 font-mono">{toast.timestamp}</span>
              </div>
              <p className="text-xs text-stone-700 mt-1 leading-relaxed">{toast.description}</p>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 text-stone-400 hover:text-stone-700 p-1 rounded-md transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
