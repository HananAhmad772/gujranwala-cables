"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Inbox, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { usePublicLocale } from "@/components/public/localized";

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <Link href="/" className="hover:text-foreground">Home</Link>
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          {item.href ? <Link href={item.href} className="hover:text-foreground">{item.label}</Link> : <span className="font-semibold text-foreground">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function SearchBar({ placeholder }: { placeholder?: string }) {
  const { locale } = usePublicLocale();

  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <input
        className="h-12 w-full rounded-md border bg-card ps-11 pe-4 text-sm shadow-sm outline-none transition focus:border-ring"
        placeholder={placeholder ?? (locale === "en" ? "Search products..." : "مصنوعات تلاش کریں...")}
      />
    </label>
  );
}

export function Pagination() {
  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <button className="grid h-10 w-10 place-items-center rounded-md border bg-card text-muted-foreground">
        <ChevronLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
      </button>
      {[1, 2, 3].map((page) => (
        <button key={page} className={cn("h-10 min-w-10 rounded-md border px-3 text-sm font-bold", page === 1 ? "bg-primary text-primary-foreground" : "bg-card")}>
          {page}
        </button>
      ))}
      <button className="grid h-10 w-10 place-items-center rounded-md border bg-card text-muted-foreground">
        <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
      </button>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border bg-card p-10 text-center">
      <Inbox className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
      <h2 className="mt-4 text-xl font-black">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function ProductSkeletons() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="rounded-lg border bg-card p-4">
          <Skeleton className="aspect-[4/3] w-full rounded-md" />
          <Skeleton className="mt-5 h-5 w-3/4" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}
