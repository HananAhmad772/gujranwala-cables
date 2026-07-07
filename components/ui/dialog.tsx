"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DialogProps = {
  open: boolean;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onClose: () => void;
};

export function Dialog({ open, title, description, children, onClose }: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" role="presentation">
      <div
        className="w-full max-w-md rounded-lg border bg-card p-5 text-card-foreground shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="dialog-title" className="text-lg font-semibold">
              {title}
            </h2>
            {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close dialog">
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

type ConfirmDialogProps = DialogProps & {
  confirmText: string;
  cancelText: string;
  destructive?: boolean;
  onConfirm: () => void;
};

export function ConfirmDialog({
  confirmText,
  cancelText,
  destructive,
  onConfirm,
  onClose,
  children,
  ...props
}: ConfirmDialogProps) {
  return (
    <Dialog onClose={onClose} {...props}>
      <div className={cn("text-sm text-muted-foreground", children ? "" : "hidden")}>{children}</div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          {cancelText}
        </Button>
        <Button variant={destructive ? "destructive" : "default"} onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </Dialog>
  );
}
