"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowLeft, LockKeyhole, Mail } from "lucide-react";
import { BrandMark } from "@/components/admin/brand-mark";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { usePreferences } from "@/contexts/preferences-context";
import { adminApi } from "@/services/admin-api";

type AuthShellProps = {
  mode: "login" | "forgot";
};

export function AuthShell({ mode }: AuthShellProps) {
  const { t } = usePreferences();
  const router = useRouter();
  const { toast } = useToast();
  const isForgot = mode === "forgot";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isForgot) {
      return;
    }

    setLoading(true);

    try {
      await adminApi<{ admin: { id: string; name: string; email: string; role: string } }>('/api/auth/login', {
        method: "POST",
        body: { email, password },
      });
      router.replace("/admin");
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "Unable to sign in.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[1fr_0.95fr]">
      <section
        className="relative hidden overflow-hidden bg-slate-950 text-white lg:block"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(6,18,37,0.88), rgba(6,18,37,0.58)), url(https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="industrial-grid absolute inset-0 opacity-20" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <BrandMark />
          <div className="max-w-xl pb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-200">Industrial Control Room</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight">Built for cable manufacturing operations that demand accuracy.</h1>
            <p className="mt-4 text-sm leading-6 text-blue-100">
              Catalog integrity, technical content, customer messages, and trust signals in a premium admin experience.
            </p>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="mb-3 lg:hidden">
              <BrandMark />
            </div>
            <CardTitle className="text-2xl">{isForgot ? t.auth.forgotTitle : t.auth.welcome}</CardTitle>
            <CardDescription>{isForgot ? t.auth.forgotSubtitle : t.auth.subtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">{t.auth.email}</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground rtl:left-auto rtl:right-3" />
                  <Input id="email" type="email" className="pl-10 rtl:pl-3 rtl:pr-10" placeholder="admin@example.com" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
                </div>
              </div>

              {!isForgot ? (
                <div className="space-y-2">
                  <Label htmlFor="password">{t.auth.password}</Label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground rtl:left-auto rtl:right-3" />
                    <Input id="password" type="password" className="pl-10 rtl:pl-3 rtl:pr-10" placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
                  </div>
                </div>
              ) : null}

              {!isForgot ? (
                <div className="flex items-center justify-between gap-3 text-sm">
                  <label className="flex items-center gap-2 text-muted-foreground">
                    <input type="checkbox" className="h-4 w-4 rounded border-input accent-primary" />
                    {t.auth.remember}
                  </label>
                  <Link href="/admin/forgot-password" className="font-medium text-primary hover:underline">
                    {t.auth.forgotPassword}
                  </Link>
                </div>
              ) : null}

              <Button className="w-full" type="submit" loading={loading} disabled={loading}>
                {isForgot ? t.auth.sendReset : t.auth.signIn}
              </Button>

              {isForgot ? (
                <Link href="/admin/login" className="flex items-center justify-center gap-2 text-sm font-medium text-primary hover:underline">
                  <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                  {t.auth.backToLogin}
                </Link>
              ) : null}
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
