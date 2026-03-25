"use client";

import { useEffect } from "react";
import { CheckCircle2, Loader2, TriangleAlert, X } from "lucide-react";
import { useToastStore } from "@/stores/toast-store";
import { cn } from "@/lib/utils";

import { AnimatePresence, motion } from "framer-motion";

const kindStyles = {
  loading: "border-blue-400/30 bg-blue-500/12 text-blue-100",
  success: "border-emerald-400/30 bg-emerald-500/12 text-emerald-100",
  error: "border-rose-400/30 bg-rose-500/12 text-rose-100",
} as const;

export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  useEffect(() => {
    const timers = toasts
      .filter((toast) => toast.durationMs && toast.durationMs > 0)
      .map((toast) =>
        window.setTimeout(() => dismissToast(toast.id), toast.durationMs)
      );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [toasts, dismissToast]);

  return (
    <div className="fixed right-4 top-16 z-[110] flex w-[min(92vw,360px)] flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            role="status"
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.15 } }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={cn(
              "glass-panel-strong rounded-xl border p-3 shadow-xl backdrop-blur-md",
              kindStyles[toast.kind]
            )}
          >
            <div className="flex items-start gap-3">
              {toast.kind === "loading" ? (
                <Loader2 className="mt-0.5 h-4 w-4 animate-spin" />
              ) : toast.kind === "success" ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4" />
              ) : (
                <TriangleAlert className="mt-0.5 h-4 w-4" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-5">{toast.title}</p>
                {toast.description && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{toast.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Dismiss toast"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
