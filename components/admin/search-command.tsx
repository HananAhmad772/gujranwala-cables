"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePreferences } from "@/contexts/preferences-context";

export function SearchCommand() {
  const { t } = usePreferences();

  return (
    <label className="relative hidden w-full max-w-xl lg:block">
      <span className="sr-only">{t.common.search}</span>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground rtl:left-auto rtl:right-3" />
      <Input className="h-11 bg-background/70 pl-10 rtl:pl-3 rtl:pr-10" placeholder={t.common.search} />
    </label>
  );
}
