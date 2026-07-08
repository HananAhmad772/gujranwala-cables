"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Eye, EyeOff, KeyRound, Mail, ShieldUser, UserRound } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { SectionCard } from "@/components/admin/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { usePreferences } from "@/contexts/preferences-context";
import { adminApi } from "@/services/admin-api";
import { cn } from "@/lib/utils";

type PasswordField = "currentPassword" | "newPassword" | "confirmPassword";

export default function ProfilePage() {
  const { t } = usePreferences();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    createdAt: "",
  });
  const [visible, setVisible] = useState<Record<PasswordField, boolean>>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [passwords, setPasswords] = useState<Record<PasswordField, string>>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const strength = useMemo(() => getPasswordStrength(passwords.newPassword), [passwords.newPassword]);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const result = await adminApi<{ admin: { name?: string; email?: string; role?: string; createdAt?: string } }>('/api/auth/me');
        if (!mounted) return;
        setProfile({
          name: result.admin.name || "Admin User",
          email: result.admin.email || "admin@example.com",
          role: result.admin.role || "admin",
          createdAt: result.admin.createdAt || "",
        });
      } catch (error) {
        if (!mounted) return;
        toast({
          title: "Unable to load profile",
          description: error instanceof Error ? error.message : "Please sign in again.",
        });
        router.replace("/admin/login");
      }
    }

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, [router, toast]);

  function updatePassword(field: PasswordField, value: string) {
    setPasswords((current) => ({ ...current, [field]: value }));
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({ title: t.profile.passwordsDoNotMatch });
      return;
    }

    setLoading(true);

    try {
      await adminApi("/api/auth/change-password", {
        method: "PATCH",
        body: {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        },
      });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast({
        title: t.profile.passwordUpdated,
        description: t.profile.passwordUpdateQueued,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Password update failed",
        description: error instanceof Error ? error.message : "Unable to update password.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title={t.profile.title}
        description={t.profile.description}
        breadcrumbs={[{ label: t.nav.dashboard, href: "/admin" }, { label: t.nav.profile }]}
      />

      <div className="grid gap-6 xl:grid-cols-[24rem_1fr]">
        <SectionCard title={t.profile.adminInformation} description="Authenticated account details.">
          <div className="flex flex-col items-center text-center">
            <div className="relative flex h-28 w-28 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-blue-500/15">
              <ShieldUser className="h-12 w-12" />
              <span className="absolute -bottom-2 rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-secondary-foreground">
                {t.common.admin}
              </span>
            </div>
            <h2 className="mt-6 text-lg font-semibold">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">Manufacturing console administrator</p>
          </div>

          <div className="mt-6 space-y-3">
            <InfoRow icon={UserRound} label={t.profile.name} value={profile.name} />
            <InfoRow icon={Mail} label={t.profile.email} value={profile.email} />
            <InfoRow icon={ShieldUser} label={t.profile.role} value={<Badge variant="success">{profile.role}</Badge>} />
            <InfoRow icon={CalendarDays} label={t.profile.createdDate} value={profile.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"} />
          </div>
        </SectionCard>

        <SectionCard title={t.profile.changePassword} description="Update the admin password using the existing protected auth endpoint.">
          <form className="max-w-2xl space-y-5" onSubmit={handlePasswordSubmit}>
            <PasswordInput
              id="currentPassword"
              label={t.profile.currentPassword}
              value={passwords.currentPassword}
              visible={visible.currentPassword}
              onToggle={() => setVisible((current) => ({ ...current, currentPassword: !current.currentPassword }))}
              onChange={(value) => updatePassword("currentPassword", value)}
            />
            <PasswordInput
              id="newPassword"
              label={t.profile.newPassword}
              value={passwords.newPassword}
              visible={visible.newPassword}
              onToggle={() => setVisible((current) => ({ ...current, newPassword: !current.newPassword }))}
              onChange={(value) => updatePassword("newPassword", value)}
            />

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-muted-foreground">{t.profile.strength}</span>
                <span className={cn("font-semibold", strength.color)}>{strength.label}</span>
              </div>
              <div className="grid h-2 grid-cols-4 gap-1">
                {Array.from({ length: 4 }).map((_, index) => (
                  <span
                    key={index}
                    className={cn("rounded-full bg-muted", index < strength.score ? strength.bar : "")}
                  />
                ))}
              </div>
            </div>

            <PasswordInput
              id="confirmPassword"
              label={t.profile.confirmPassword}
              value={passwords.confirmPassword}
              visible={visible.confirmPassword}
              onToggle={() => setVisible((current) => ({ ...current, confirmPassword: !current.confirmPassword }))}
              onChange={(value) => updatePassword("confirmPassword", value)}
            />

            <Button loading={loading} type="submit">
              <KeyRound className="h-4 w-4" />
              {t.profile.updatePassword}
            </Button>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Icon className="h-4 w-4 text-secondary" />
        {label}
      </div>
      <div className="text-right text-sm font-semibold">{value}</div>
    </div>
  );
}

function PasswordInput({
  id,
  label,
  value,
  visible,
  onToggle,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  visible: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground rtl:left-auto rtl:right-3" />
        <Input
          id={id}
          type={visible ? "text" : "password"}
          className="pl-10 pr-11 rtl:pl-11 rtl:pr-10"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          minLength={8}
          required
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground rtl:left-2 rtl:right-auto"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) {
    return { score: Math.max(score, 1), label: "Weak", color: "text-destructive", bar: "bg-destructive" };
  }

  if (score <= 3) {
    return { score, label: "Fair", color: "text-amber-600 dark:text-amber-300", bar: "bg-amber-500" };
  }

  return { score, label: "Strong", color: "text-emerald-600 dark:text-emerald-300", bar: "bg-emerald-500" };
}
