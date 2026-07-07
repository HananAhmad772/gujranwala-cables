"use client";

import type { LocalizedText } from "@/lib/public-data";
import { usePreferences } from "@/contexts/preferences-context";

export function usePublicLocale() {
  const { locale, direction, setLocale, theme, setTheme, resolvedTheme } = usePreferences();

  return {
    locale,
    direction,
    setLocale,
    theme,
    setTheme,
    resolvedTheme,
    text: (value: LocalizedText) => value[locale],
  };
}
