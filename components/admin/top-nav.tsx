"use client";

import Link from "next/link";
import { Bell, ChevronDown, Menu, Moon, Sun, UserRound } from "lucide-react";
import { BrandMark } from "@/components/admin/brand-mark";
import { SearchCommand } from "@/components/admin/search-command";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { usePreferences } from "@/contexts/preferences-context";
import { locales } from "@/translations";
import { useState } from "react";

type TopNavProps = {
  onMenuClick: () => void;
};

export function TopNav({ onMenuClick }: TopNavProps) {
  const { t, locale, setLocale, theme, setTheme, resolvedTheme } = usePreferences();
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/88 px-4 backdrop-blur-xl lg:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick} aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </Button>

      <Link href="/admin" className="flex shrink-0 items-center text-foreground lg:hidden" aria-label={t.nav.dashboard}>
        <BrandMark collapsed />
      </Link>

      <div className="hidden min-w-0 flex-1 items-center gap-4 lg:flex">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Admin Console</p>
          {/* <p className="text-sm font-semibold">{t.common.appName}</p> */}
        </div>
        <SearchCommand />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <select
          value={locale}
          onChange={(event) => setLocale(event.target.value === "ur" ? "ur" : "en")}
          className="h-10 rounded-md border bg-card px-3 text-sm shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          aria-label={t.common.language}
        >
          {locales.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(nextTheme)}
          aria-label={`${t.common.theme}: ${theme}`}
          title={`${t.common.theme}: ${theme}`}
        >
          {resolvedTheme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>

        <Button variant="outline" size="icon" aria-label={t.common.notifications}>
          <Bell className="h-4 w-4" />
        </Button>

        <Button variant="ghost" className="h-10 gap-2 px-2" onClick={() => setProfileOpen(true)} aria-label={t.common.profile}>
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <UserRound className="h-4 w-4" />
          </span>
          <span className="hidden text-sm font-medium xl:inline">Admin</span>
          <ChevronDown className="hidden h-4 w-4 text-muted-foreground xl:inline" />
        </Button>
      </div>

      <Dialog open={profileOpen} onClose={() => setProfileOpen(false)} title={t.common.profile} description="Admin account and session options.">
        <div className="space-y-2">
          <Link className="block rounded-md px-3 py-2 text-sm hover:bg-muted" href="/admin/profile" onClick={() => setProfileOpen(false)}>
            {t.nav.profile}
          </Link>
          <Link className="block rounded-md px-3 py-2 text-sm hover:bg-muted" href="/admin/profile" onClick={() => setProfileOpen(false)}>
            {t.nav.changePassword}
          </Link>
          <button
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10"
            onClick={() => {
              setProfileOpen(false);
              setLogoutOpen(true);
            }}
          >
            {t.nav.logout}
          </button>
        </div>
      </Dialog>

      <Dialog open={logoutOpen} onClose={() => setLogoutOpen(false)} title="Logout confirmation" description="End this admin session?">
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setLogoutOpen(false)}>
            {t.common.cancel}
          </Button>
          <Button onClick={() => setLogoutOpen(false)}>
            {t.common.logout}
          </Button>
        </div>
      </Dialog>
    </header>
  );
}
