"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Toast = {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "error";
};

type ToastContextValue = {
  toast: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (nextToast: Omit<Toast, "id">) => {
      const id = crypto.randomUUID();
      setToasts((current) => [...current, { ...nextToast, id }]);
      window.setTimeout(() => removeToast(id), 10000);
    },
    [removeToast],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-[60] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3" aria-live="polite">
        {toasts.map((item) => {
          const Icon = item.variant === "success" ? CheckCircle2 : item.variant === "error" ? AlertCircle : Info;
          const toneClass = item.variant === "success" ? "border-green-600/30 bg-green-600 text-white" : item.variant === "error" ? "border-red-600/30 bg-red-600 text-white" : "border-border/80 bg-card/95 text-card-foreground backdrop-blur";

          return (
            <div key={item.id} className={cn("rounded-xl border p-4 shadow-lg shadow-black/10", toneClass)}>
              <div className="flex gap-3">
                <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", item.variant === "success" || item.variant === "error" ? "text-white" : "text-primary")} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{item.title}</p>
                  {item.description ? <p className="mt-1 text-sm opacity-90">{item.description}</p> : null}
                </div>
                <Button variant="ghost" size="icon" className={cn("h-8 w-8 shrink-0 hover:bg-white/20", item.variant === "success" || item.variant === "error" ? "text-white hover:text-white" : "")} onClick={() => removeToast(item.id)} aria-label="Dismiss notification">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
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
