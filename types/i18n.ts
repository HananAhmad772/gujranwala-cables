export type Locale = "en" | "ur";

type WidenStrings<T> = {
  [K in keyof T]: T[K] extends string ? string : T[K] extends object ? WidenStrings<T[K]> : T[K];
};

export type TranslationDictionary = WidenStrings<typeof import("@/translations/en").en>;
