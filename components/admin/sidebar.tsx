"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { BrandMark } from "@/components/admin/brand-mark";
import { adminNavItems } from "@/components/admin/nav-config";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/contexts/preferences-context";
import { cn } from "@/lib/utils";

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

function SidebarContent({ collapsed, onToggle, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { t, direction } = usePreferences();
  const CollapseIcon = direction === "rtl" ? ChevronRight : ChevronLeft;

  return (
    <aside
      className={cn(
        "flex h-full flex-col bg-sidebar text-sidebar-foreground",
        collapsed ? "w-[5.25rem]" : "w-72",
      )}
      aria-label="Admin navigation"
    >
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        <BrandMark collapsed={collapsed} />
        <Button
          variant="ghost"
          size="icon"
          className="hidden text-sidebar-foreground hover:bg-white/10 hover:text-white lg:inline-flex"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <CollapseIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-sidebar-foreground hover:bg-white/10 hover:text-white lg:hidden"
          onClick={onMobileClose}
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4">
        {/* <div className={cn("mb-4 rounded-lg border border-white/10 bg-white/[0.06] p-3", collapsed && "hidden")}>
          <div className="flex items-center gap-2">
            <Factory className="h-4 w-4 text-secondary" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Plant Ops</p>
          </div>
          <p className="mt-2 text-sm text-white/80">Catalog, content, and trust operations</p>
          <Badge variant="secondary" className="mt-3 bg-secondary/20 text-orange-100 ring-secondary/30">
            Live UI
          </Badge>
        </div> */}

        <nav className="space-y-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            const label = t.nav[item.labelKey];

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={cn(
                  "group flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  active ? "bg-white text-slate-950 shadow-sm" : "text-white/78 hover:bg-white/10 hover:text-white",
                  collapsed && "justify-center px-2",
                )}
                aria-label={label}
                title={collapsed ? label : undefined}
              >
                <Icon className={cn("h-5 w-5 shrink-0", active ? "text-secondary" : "text-white/70 group-hover:text-secondary")} />
                {!collapsed ? <span className="truncate">{label}</span> : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export function Sidebar(props: SidebarProps) {
  return (
    <>
      <div className="hidden lg:block">
        <SidebarContent {...props} />
      </div>
      {props.mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-slate-950/50" onClick={props.onMobileClose} aria-label="Close menu overlay" />
          <div className="relative h-full w-80 max-w-[88vw] shadow-2xl">
            <SidebarContent {...props} collapsed={false} />
          </div>
        </div>
      ) : null}
    </>
  );
}
