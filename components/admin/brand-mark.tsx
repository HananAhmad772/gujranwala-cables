import { Cable } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandMark({ collapsed = false, className }: { collapsed?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground shadow-lg shadow-orange-500/20">
        <Cable className="h-5 w-5" aria-hidden="true" />
      </div>
      {!collapsed ? (
        <div className="min-w-0">
          <p className="truncate text-sm font-bold leading-5 text-current">Gujranwala</p>
          <p className="truncate text-xs font-medium text-current/70">Electric Wires</p>
        </div>
      ) : null}
    </div>
  );
}
