"use client";

import type { LocalizedText } from "@/lib/public-data";
import { cn } from "@/lib/utils";
import { usePublicLocale } from "@/components/public/localized";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: LocalizedText;
  title: LocalizedText;
  description?: LocalizedText;
  align?: "left" | "center";
}) {
  const { text } = usePublicLocale();

  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">{text(eyebrow)}</p> : null}
      <h1 className="mt-3 text-3xl font-black tracking-normal text-foreground sm:text-4xl lg:text-5xl">{text(title)}</h1>
      {description ? <p className="mt-4 text-base leading-8 text-muted-foreground sm:text-lg">{text(description)}</p> : null}
    </div>
  );
}
