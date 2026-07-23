"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, Menu, Moon, Sun, UserRound } from "lucide-react";
import { BrandMark } from "@/components/admin/brand-mark";
import { SearchCommand } from "@/components/admin/search-command";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { usePreferences } from "@/contexts/preferences-context";
import { adminApi } from "@/services/admin-api";
import { locales } from "@/translations";
import { useEffect, useState } from "react";

type TopNavProps = {
  onMenuClick: () => void;
};

export function TopNav({ onMenuClick }: TopNavProps) {
  const { t, locale, setLocale, theme, setTheme, resolvedTheme } = usePreferences();
  const router = useRouter();
  const { toast } = useToast();
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [adminName, setAdminName] = useState("Admin");

  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

  useEffect(() => {
    let mounted = true;

    async function loadAdmin() {
      try {
        const result = await adminApi<{ admin: { name?: string; email?: string } }>('/api/auth/me');
        if (!mounted) return;
        setAdminName(result.admin.name || "Admin");
      } catch {
        if (!mounted) return;
        setAdminName("Admin");
      }
    }

    void loadAdmin();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    if (!profileOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-profile-menu]')) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  async function handleLogout() {
    try {
      await adminApi('/api/auth/logout', { method: "POST" });
      setLogoutOpen(false);
      setProfileOpen(false);
      router.replace("/admin/login");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: error instanceof Error ? error.message : "Unable to sign out.",
      });
    }
  }

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

        <div className="relative" data-profile-menu>
          <Button 
            variant="ghost" 
            className="h-10 gap-2 px-2" 
            onClick={() => setProfileOpen(!profileOpen)} 
            aria-label={t.common.profile}
            aria-expanded={profileOpen}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <UserRound className="h-4 w-4" />
            </span>
            <span className="hidden text-sm font-medium xl:inline">{adminName}</span>
            <ChevronDown className={`hidden h-4 w-4 text-muted-foreground transition-transform xl:inline ${profileOpen ? 'rotate-180' : ''}`} />
          </Button>

          {profileOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border bg-card shadow-lg">
              <div className="space-y-1 p-2">
                <Link 
                  className="block rounded-md px-3 py-2 text-sm hover:bg-muted" 
                  href="/admin/profile" 
                  onClick={() => setProfileOpen(false)}
                >
                  {t.nav.profile}
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
            </div>
          )}
        </div>
      </div>

      <Dialog open={logoutOpen} onClose={() => setLogoutOpen(false)} title="Logout confirmation" description="End this admin session?">
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setLogoutOpen(false)}>
            {t.common.cancel}
          </Button>
          <Button onClick={() => void handleLogout()}>
            {t.common.logout}
          </Button>
        </div>
      </Dialog>
    </header>
  );
}
