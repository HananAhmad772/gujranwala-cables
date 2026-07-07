import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  accent?: "blue" | "orange" | "green" | "amber";
};

const accentMap = {
  blue: "bg-primary/10 text-primary",
  orange: "bg-secondary/10 text-secondary",
  green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  amber: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

export function StatCard({ title, value, change, trend, icon: Icon, accent = "blue" }: StatCardProps) {
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="relative overflow-hidden p-5">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-3 text-2xl font-bold tracking-normal">{value}</p>
        </div>
        <span className={cn("flex h-11 w-11 items-center justify-center rounded-lg", accentMap[accent])}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <Badge variant={trend === "up" ? "success" : "warning"} className="mt-5 gap-1">
        <TrendIcon className="h-3.5 w-3.5" aria-hidden="true" />
        {change}
      </Badge>
    </Card>
  );
}
