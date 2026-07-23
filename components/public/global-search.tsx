"use client";

import Link from "next/link";
import { BookOpenText, Package, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePublicLocale } from "@/components/public/localized";

type SearchResult = {
  type: "product" | "blog";
  slug: string;
  title: string;
  subtitle: string;
  href: string;
};

function useGlobalSearch(query: string) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      try {
        const [productsRes, blogsRes] = await Promise.all([
          fetch(`/api/products?page=1&limit=100&isActive=true`, { signal: controller.signal }),
          fetch(`/api/blogs?page=1&limit=100&status=PUBLISHED`, { signal: controller.signal }),
        ]);

        if (cancelled) return;

        const q = trimmed.toLowerCase();
        const combined: SearchResult[] = [];

        if (productsRes.ok) {
          const json = await productsRes.json();
          const products: any[] = json?.data?.products ?? [];
          for (const p of products) {
            if (
              p.name?.toLowerCase().includes(q) ||
              p.description?.toLowerCase().includes(q) ||
              p.category?.name?.toLowerCase().includes(q)
            ) {
              combined.push({
                type: "product",
                slug: p.slug,
                title: p.name,
                subtitle: p.category?.name ?? "",
                href: `/products/${p.slug}`,
              });
            }
          }
        }

        if (blogsRes.ok) {
          const json = await blogsRes.json();
          const blogs: any[] = json?.data?.blogs ?? [];
          for (const b of blogs) {
            if (
              b.title?.toLowerCase().includes(q) ||
              b.excerpt?.toLowerCase().includes(q)
            ) {
              combined.push({
                type: "blog",
                slug: b.slug,
                title: b.title,
                subtitle: b.excerpt ?? "",
                href: `/blog/${b.slug}`,
              });
            }
          }
        }

        if (!cancelled) setResults(combined.slice(0, 10));
      } catch {
        // Aborted or network error — do nothing
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const timer = window.setTimeout(() => { void run(); }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return { results, loading };
}

export function GlobalSearch() {
  const { locale } = usePublicLocale();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { results, loading } = useGlobalSearch(query);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const productResults = results.filter((r) => r.type === "product");
  const blogResults = results.filter((r) => r.type === "blog");
  const hasResults = results.length > 0;
  const showEmpty = query.trim().length >= 2 && !loading && !hasResults;

  return (
    <>
      {/* Trigger button */}
      <button
        className="grid h-10 w-10 place-items-center rounded-md border bg-card text-muted-foreground transition hover:text-foreground"
        aria-label={locale === "en" ? "Search" : "تلاش"}
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" aria-hidden="true" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-black/50 px-4 pt-[10vh] backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          role="dialog"
          aria-modal="true"
          aria-label={locale === "en" ? "Global search" : "عالمی تلاش"}
        >
          <div className="w-full max-w-xl rounded-xl border bg-background shadow-2xl">
            {/* Search input */}
            <div className="flex items-center gap-3 border-b px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <input
                ref={inputRef}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                placeholder={locale === "en" ? "Search products and articles…" : "مصنوعات اور مضامین تلاش کریں…"}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
              />
              {loading && (
                <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-label="Loading" />
              )}
              <button
                className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-foreground"
                onClick={() => setOpen(false)}
                aria-label={locale === "en" ? "Close search" : "تلاش بند کریں"}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results */}
            {hasResults && (
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {productResults.length > 0 && (
                  <div>
                    <p className="px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      {locale === "en" ? "Products" : "مصنوعات"}
                    </p>
                    {productResults.map((r) => (
                      <Link
                        key={r.href}
                        href={r.href}
                        className="flex items-start gap-3 rounded-md px-3 py-2.5 text-sm transition hover:bg-accent"
                        onClick={() => setOpen(false)}
                      >
                        <Package className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                        <span>
                          <span className="block font-semibold text-foreground">{r.title}</span>
                          {r.subtitle && <span className="block text-xs text-muted-foreground">{r.subtitle}</span>}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
                {blogResults.length > 0 && (
                  <div className={productResults.length > 0 ? "mt-1 border-t pt-1" : ""}>
                    <p className="px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      {locale === "en" ? "Articles" : "مضامین"}
                    </p>
                    {blogResults.map((r) => (
                      <Link
                        key={r.href}
                        href={r.href}
                        className="flex items-start gap-3 rounded-md px-3 py-2.5 text-sm transition hover:bg-accent"
                        onClick={() => setOpen(false)}
                      >
                        <BookOpenText className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                        <span>
                          <span className="block font-semibold text-foreground">{r.title}</span>
                          {r.subtitle && <span className="block line-clamp-1 text-xs text-muted-foreground">{r.subtitle}</span>}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {showEmpty && (
              <p className="px-5 py-6 text-center text-sm text-muted-foreground">
                {locale === "en" ? `No results for "${query}"` : `"${query}" کے لیے کوئی نتیجہ نہیں`}
              </p>
            )}

            {/* Footer hint */}
            <div className="border-t px-4 py-2.5 text-xs text-muted-foreground">
              {locale === "en" ? "Press Esc to close" : "بند کرنے کے لیے Esc دبائیں"}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
