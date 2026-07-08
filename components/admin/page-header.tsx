import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-3 inline-flex flex-wrap items-center gap-1 rounded-full border border-border/70 bg-background/70 px-3 py-2 text-sm text-muted-foreground shadow-sm shadow-black/5 backdrop-blur">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-1">
          {index > 0 ? <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" /> : null}
          {item.href ? (
            <a href={item.href} className="rounded-full px-1.5 py-0.5 transition hover:bg-muted hover:text-foreground">
              {item.label}
            </a>
          ) : (
            <span className="rounded-full px-1.5 py-0.5 text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function PageHeader({ eyebrow, title, description, actions, breadcrumbs, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between", className)}>
      <div className="min-w-0">
        {breadcrumbs ? <Breadcrumb items={breadcrumbs} /> : null}
        {eyebrow ? <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{eyebrow}</p> : null}
        <h1 className="text-2xl font-bold tracking-normal text-foreground sm:text-3xl">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
