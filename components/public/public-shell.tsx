"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Globe2,
  Mail,
  MapPin,
  Menu,
  Moon,
  Phone,
  Search,
  Sun,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { company, products } from "@/lib/public-data";
import { cn } from "@/lib/utils";
import { usePublicLocale } from "@/components/public/localized";

const navItems = [
  { href: "/", label: { en: "Home", ur: "ہوم" } },
  { href: "/products", label: { en: "Products", ur: "مصنوعات" } },
  { href: "/brands", label: { en: "Brands", ur: "برانڈز" } },
  { href: "/about", label: { en: "About", ur: "ہمارے بارے میں" } },
  { href: "/blog", label: { en: "Blog", ur: "بلاگ" } },
  { href: "/faqs", label: { en: "FAQs", ur: "سوالات" } },
  { href: "/contact", label: { en: "Contact", ur: "رابطہ" } },
];

function BrandMark({ inverted = false }: { inverted?: boolean }) {
  const { text } = usePublicLocale();

  return (
    <Link href="/" className="flex items-center gap-3" aria-label={text(company.name)}>
      <span className="grid h-11 w-11 place-items-center rounded-md bg-primary text-primary-foreground shadow-sm">
        <Zap className="h-6 w-6" aria-hidden="true" />
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-black uppercase tracking-[0.18em] text-primary">GEW</span>
        <span className={cn("block text-sm font-semibold", inverted ? "text-white" : "text-foreground")}>{text(company.name)}</span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { locale, setLocale, theme, setTheme, text } = usePublicLocale();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/88 backdrop-blur-xl">
      <div className="border-b bg-foreground text-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2 text-xs sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="inline-flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {company.phone}
            </span>
            <span className="inline-flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              {company.email}
            </span>
          </div>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {text(company.address)}
          </span>
        </div>
      </div>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8" aria-label="Main navigation">
        <BrandMark />
        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-accent hover:text-accent-foreground",
                  active && "bg-accent text-accent-foreground",
                )}
              >
                {text(item.label)}
              </Link>
            );
          })}
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <button
            className="grid h-10 w-10 place-items-center rounded-md border bg-card text-muted-foreground transition hover:text-foreground"
            aria-label="Search"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            className="grid h-10 w-10 place-items-center rounded-md border bg-card text-muted-foreground transition hover:text-foreground"
            onClick={() => setLocale(locale === "en" ? "ur" : "en")}
            aria-label="Switch language"
          >
            <Globe2 className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            className="grid h-10 w-10 place-items-center rounded-md border bg-card text-muted-foreground transition hover:text-foreground"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
          </button>
          <Link
            href="/contact"
            className="rounded-md bg-secondary px-4 py-2.5 text-sm font-bold text-secondary-foreground shadow-sm transition hover:bg-secondary/90"
          >
            {locale === "en" ? "Request Quote" : "قیمت معلوم کریں"}
          </Link>
        </div>
        <button
          className="grid h-10 w-10 place-items-center rounded-md border bg-card lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </nav>
      {open ? (
        <div className="border-t bg-background px-4 py-4 lg:hidden">
          <div className="grid gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-md px-3 py-3 text-sm font-semibold hover:bg-accent" onClick={() => setOpen(false)}>
                {text(item.label)}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <button className="h-10 flex-1 rounded-md border bg-card text-sm font-semibold" onClick={() => setLocale(locale === "en" ? "ur" : "en")}>
              {locale === "en" ? "اردو" : "English"}
            </button>
            <button className="h-10 flex-1 rounded-md border bg-card text-sm font-semibold" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export function Footer() {
  const { text, locale } = usePublicLocale();
  const quickLinks = navItems.slice(1);

  return (
    <footer className="border-t bg-[#07111f] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:px-8">
        <div className="space-y-5">
          <BrandMark inverted />
          <p className="max-w-sm text-sm leading-7 text-slate-300">{text(company.tagline)}</p>
          <div className="flex gap-2">
            {["Fb", "Ig", "In", "Yt"].map((label) => (
              <a key={label} href="#" className="grid h-10 w-10 place-items-center rounded-md border border-white/15 text-xs font-black text-slate-300 transition hover:bg-white/10 hover:text-white" aria-label={`${label} social link`}>
                {label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">{locale === "en" ? "Quick Links" : "فوری لنکس"}</h2>
          <div className="mt-5 grid gap-3 text-sm">
            {quickLinks.map((item) => (
              <Link key={item.href} href={item.href} className="text-slate-300 transition hover:text-white">
                {text(item.label)}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">{locale === "en" ? "Products" : "مصنوعات"}</h2>
          <div className="mt-5 grid gap-3 text-sm">
            {products.map((product) => (
              <Link key={product.slug} href={`/products/${product.slug}`} className="text-slate-300 transition hover:text-white">
                {text(product.name)}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">{locale === "en" ? "Contact" : "رابطہ"}</h2>
          <div className="mt-5 grid gap-3 text-sm text-slate-300">
            <span>{company.phone}</span>
            <span>{company.whatsapp}</span>
            <span>{company.email}</span>
            <span>{text(company.address)}</span>
          </div>
          <div className="mt-5 overflow-hidden rounded-md border border-white/10">
            <iframe
              title="Gujranwala Electric Wires map preview"
              src="https://www.google.com/maps?q=Gujranwala%20Pakistan&output=embed"
              className="h-32 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span>Copyright 2026 {text(company.name)}. All rights reserved.</span>
          <span className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-white">Terms & Conditions</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
