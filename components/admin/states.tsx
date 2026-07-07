import { AlertTriangle, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, className }: StateProps) {
  return (
    <div className={cn("flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center", className)}>
      <Inbox className="h-10 w-10 text-muted-foreground" />
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ title, description, className }: StateProps) {
  return (
    <div className={cn("rounded-lg border border-destructive/20 bg-destructive/5 p-5", className)} role="alert">
      <div className="flex gap-3">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <div>
          <h3 className="font-semibold text-destructive">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          <Button variant="outline" size="sm" className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
}
