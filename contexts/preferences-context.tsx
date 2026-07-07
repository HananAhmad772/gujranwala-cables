"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { dictionaries, locales } from "@/translations";
import type { Locale, TranslationDictionary } from "@/types/i18n";

type ThemePreference = "light" | "dark" | "system";

type PreferencesContextValue = {
  locale: Locale;
  direction: "ltr" | "rtl";
  setLocale: (locale: Locale) => void;
  theme: ThemePreference;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: ThemePreference) => void;
  t: TranslationDictionary;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

const localeKey = "gew-admin-locale";
const themeKey = "gew-admin-theme";

function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(localeKey);
  return stored === "ur" ? "ur" : "en";
}

function getStoredTheme(): ThemePreference {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(themeKey);
  return stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
}

function resolveTheme(theme: ThemePreference) {
  if (theme !== "system") return theme;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => getStoredLocale());
  const [theme, setThemeState] = useState<ThemePreference>(() => getStoredTheme());
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const updateTheme = () => setResolvedTheme(resolveTheme(theme));
    updateTheme();

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", updateTheme);
    return () => media.removeEventListener("change", updateTheme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  }, [resolvedTheme]);

  useEffect(() => {
    const direction = locales.find((item) => item.value === locale)?.dir ?? "ltr";
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [locale]);

  const value = useMemo<PreferencesContextValue>(() => {
    const direction = locales.find((item) => item.value === locale)?.dir ?? "ltr";

    return {
      locale,
      direction,
      setLocale: (nextLocale) => {
        window.localStorage.setItem(localeKey, nextLocale);
        setLocaleState(nextLocale);
      },
      theme,
      resolvedTheme,
      setTheme: (nextTheme) => {
        window.localStorage.setItem(themeKey, nextTheme);
        setThemeState(nextTheme);
      },
      t: dictionaries[locale],
    };
  }, [locale, resolvedTheme, theme]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }

  return context;
}
