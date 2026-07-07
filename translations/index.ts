import { en } from "@/translations/en";
import { ur } from "@/translations/ur";
import type { Locale } from "@/types/i18n";

export const dictionaries = { en, ur };

export const locales: { value: Locale; label: string; dir: "ltr" | "rtl" }[] = [
  { value: "en", label: "English", dir: "ltr" },
  { value: "ur", label: "اردو", dir: "rtl" },
];
