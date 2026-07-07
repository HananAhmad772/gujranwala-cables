import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset", {
  variants: {
    variant: {
      default: "bg-primary/10 text-primary ring-primary/20",
      secondary: "bg-secondary/10 text-secondary ring-secondary/25",
      success: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-300",
      warning: "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-300",
      muted: "bg-muted text-muted-foreground ring-border",
      destructive: "bg-destructive/10 text-destructive ring-destructive/20",
    },
  },
  defaultVariants: { variant: "default" },
});

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
