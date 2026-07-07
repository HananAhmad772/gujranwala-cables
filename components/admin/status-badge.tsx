import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const variant =
    normalized.includes("approved") || normalized.includes("active") || normalized.includes("closed")
      ? "success"
      : normalized.includes("pending") || normalized.includes("new")
        ? "warning"
        : normalized.includes("rejected")
          ? "destructive"
          : "muted";

  return <Badge variant={variant}>{status}</Badge>;
}
