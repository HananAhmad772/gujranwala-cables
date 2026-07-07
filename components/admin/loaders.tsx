import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 text-sm font-medium shadow-sm">
        <Loader2 className="h-4 w-4 animate-spin text-secondary" />
        Loading workspace
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="grid grid-cols-4 gap-3 rounded-md border p-3">
          <Skeleton className="h-5" />
          <Skeleton className="h-5" />
          <Skeleton className="h-5" />
          <Skeleton className="h-5" />
        </div>
      ))}
    </div>
  );
}
