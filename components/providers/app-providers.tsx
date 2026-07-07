"use client";

import { PreferencesProvider } from "@/contexts/preferences-context";
import { ToastProvider } from "@/components/ui/toast";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <PreferencesProvider>
      <ToastProvider>{children}</ToastProvider>
    </PreferencesProvider>
  );
}
