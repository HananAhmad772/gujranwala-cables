"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type SiteSettings = {
  companyName: string;
  address: string | null;
  phone: string | null;
  whatsappNumber: string | null;
  email: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  youtubeUrl: string | null;
  mapEmbedUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

type SiteSettingsContextValue = {
  settings: SiteSettings | null;
  refresh: () => Promise<void>;
};

const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null);

export function SiteSettingsProvider({
  children,
  initialSettings,
}: {
  children: ReactNode;
  initialSettings: SiteSettings | null;
}) {
  const [settings, setSettings] = useState<SiteSettings | null>(initialSettings);

  async function refresh() {
    try {
      const res = await fetch("/api/site-settings", { cache: "no-store" });
      const json = await res.json();
      if (json?.settings) setSettings(json.settings);
    } catch {
      // keep current settings on network error
    }
  }

  return (
    <SiteSettingsContext.Provider value={{ settings, refresh }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);

  if (!context) {
    throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  }

  return context;
}
