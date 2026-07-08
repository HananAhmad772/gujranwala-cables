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

  useEffect(() => {
    if (authRoutes.includes(pathname)) {
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
  }, [pathname, router]);

  if (authRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="rounded-lg border bg-card px-6 py-4 text-sm text-muted-foreground shadow-sm">Checking your admin session…</div>
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
