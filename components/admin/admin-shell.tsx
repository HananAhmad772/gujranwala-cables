"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/admin/sidebar";
import { TopNav } from "@/components/admin/top-nav";
import { adminApi } from "@/services/admin-api";

const authRoutes = ["/admin/login", "/admin/forgot-password"];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(!authRoutes.includes(pathname));
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (authRoutes.includes(pathname)) {
      setCheckingAuth(false);
      return;
    }

    // If already authenticated in this session, skip the check
    if (authChecked) {
      setCheckingAuth(false);
      return;
    }

    let mounted = true;
    setCheckingAuth(true);

    async function verifySession() {
      try {
        await adminApi<{ admin: { id: string } }>('/api/auth/me');
        if (mounted) {
          setCheckingAuth(false);
          setAuthChecked(true);
        }
      } catch {
        if (mounted) {
          router.replace("/admin/login");
        }
      }
    }

    void verifySession();

    return () => {
      mounted = false;
    };
  }, [pathname, router, authChecked]);

  if (authRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 rounded-lg border bg-card px-6 py-4 shadow-sm">
          <svg className="h-5 w-5 animate-spin text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((current) => !current)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav onMenuClick={() => setMobileOpen(true)} />
        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1800px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
