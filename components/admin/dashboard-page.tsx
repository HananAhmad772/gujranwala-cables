"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  BookOpenText,
  Building2,
  CheckCircle2,
  Clock3,
  Factory,
  FileQuestion,
  FolderTree,
  MessageSquareText,
  Package,
  Plus,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { SectionCard } from "@/components/admin/section-card";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePreferences } from "@/contexts/preferences-context";

const MonthlySignalsChart = dynamic(
  () => import("@/components/admin/dashboard-charts").then((mod) => mod.MonthlySignalsChart),
  { loading: () => <Skeleton className="h-80 w-full" /> },
);

const CatalogMixChart = dynamic(
  () => import("@/components/admin/dashboard-charts").then((mod) => mod.CatalogMixChart),
  { loading: () => <Skeleton className="h-80 w-full" /> },
);

const activities = [
  { title: "XLPE cable catalog reviewed", meta: "Product quality queue", status: "ACTIVE" },
  { title: "New contractor inquiry received", meta: "Contact inbox", status: "NEW" },
  { title: "Industrial wiring article drafted", meta: "Knowledge center", status: "DRAFT" },
  { title: "Dealer review awaiting approval", meta: "Review moderation", status: "PENDING" },
];

const reviews = [
  { name: "M. Usman", comment: "Fast response and strong cable quality.", rating: "5.0", status: "APPROVED" },
  { name: "Ayesha Traders", comment: "Need quotation details for bulk order.", rating: "4.0", status: "PENDING" },
  { name: "Sialkot Electric", comment: "Reliable insulation and packing.", rating: "5.0", status: "APPROVED" },
];

const contacts = [
  { name: "Bilal Engineering", subject: "Industrial cable quote", status: "NEW" },
  { name: "Gujrat Builders", subject: "House wiring inquiry", status: "CONTACTED" },
  { name: "Metro Supply", subject: "Dealer partnership", status: "CLOSED" },
];

const blogs = [
  { title: "Choosing the right wire gauge", status: "PUBLISHED" },
  { title: "Cable safety standards for contractors", status: "DRAFT" },
  { title: "Industrial power cable maintenance", status: "PUBLISHED" },
];

export function DashboardPage() {
  const { t } = usePreferences();

  const stats = [
    { title: t.dashboard.totalProducts, value: "148", change: "+12 this month", trend: "up" as const, icon: Package, accent: "blue" as const },
    { title: t.dashboard.categories, value: "18", change: "+3 refined", trend: "up" as const, icon: FolderTree, accent: "orange" as const },
    { title: t.dashboard.brands, value: "24", change: "+2 active", trend: "up" as const, icon: Building2, accent: "green" as const },
    { title: t.dashboard.pendingReviews, value: "9", change: "Needs review", trend: "down" as const, icon: Clock3, accent: "amber" as const },
    { title: t.dashboard.contactMessages, value: "31", change: "+8 inquiries", trend: "up" as const, icon: MessageSquareText, accent: "blue" as const },
    { title: t.dashboard.blogPosts, value: "16", change: "+4 drafts", trend: "up" as const, icon: BookOpenText, accent: "orange" as const },
    { title: t.dashboard.reviews, value: "86", change: "94% positive", trend: "up" as const, icon: Star, accent: "green" as const },
    { title: t.dashboard.qualityScore, value: "98%", change: "Catalog health", trend: "up" as const, icon: ShieldCheck, accent: "blue" as const },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Industrial Admin"
        title={t.dashboard.title}
        description={t.dashboard.subtitle}
        actions={
          <>
            <Button variant="outline">
              <Factory className="h-4 w-4" />
              Plant View
            </Button>
            <Button>
              <Plus className="h-4 w-4" />
              Quick Add
            </Button>
          </>
        }
      />

      <section className="mb-6 overflow-hidden rounded-lg border bg-card shadow-sm">
        <div className="industrial-grid relative p-5 sm:p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-card via-card/92 to-card/75" />
          <div className="relative grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <Badge variant="secondary" className="mb-3">
                <Zap className="mr-1 h-3.5 w-3.5" />
                {t.dashboard.inventoryNote}
              </Badge>
              <h2 className="max-w-3xl text-xl font-bold sm:text-2xl">Premium cable operations, content readiness, and customer trust in one console.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Built for a manufacturing business where product accuracy, fast inquiry response, and brand reliability matter every day.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {["ISO-ready catalog", "Dealer pipeline", "Review queue", "Content calendar"].map((item) => (
                <div key={item} className="rounded-lg border bg-background/80 p-4 shadow-sm">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <p className="mt-3 text-sm font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <SectionCard title={t.dashboard.monthlySignals} description="Dummy operational data ready for API-backed analytics.">
          <MonthlySignalsChart />
        </SectionCard>
        <SectionCard title={t.dashboard.catalogMix} description="Portfolio spread across cable families.">
          <CatalogMixChart />
        </SectionCard>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-3">
        <SectionCard title={t.dashboard.recentActivity}>
          <div className="space-y-3">
            {activities.map((item) => (
              <div key={item.title} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.meta}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title={t.dashboard.quickActions}
          action={
            <Link href="/admin/products" className="text-sm font-medium text-primary hover:underline">
              {t.common.viewAll}
            </Link>
          }
        >
          <div className="grid gap-3">
            {[
              { label: t.nav.products, icon: Package, href: "/admin/products" },
              { label: t.nav.blogs, icon: BookOpenText, href: "/admin/blogs" },
              { label: t.nav.faqs, icon: FileQuestion, href: "/admin/faqs" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted">
                <item.icon className="h-5 w-5 text-secondary" />
                <span className="text-sm font-semibold">{item.label}</span>
              </Link>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={t.dashboard.operations} description="Manufacturing-grade operational pulse.">
          <div className="space-y-4">
            {[
              ["Catalog completion", "86%"],
              ["Response SLA", "92%"],
              ["Published content", "74%"],
              ["Review approval", "68%"],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium">{label}</span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: value }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-3">
        <SectionCard title={t.dashboard.recentReviews}>
          <List items={reviews.map((item) => ({ title: item.name, meta: item.comment, status: item.status }))} />
        </SectionCard>
        <SectionCard title={t.dashboard.recentContacts}>
          <List items={contacts.map((item) => ({ title: item.name, meta: item.subject, status: item.status }))} />
        </SectionCard>
        <SectionCard title={t.dashboard.latestBlogs}>
          <List items={blogs.map((item) => ({ title: item.title, meta: "Knowledge center", status: item.status }))} />
        </SectionCard>
      </section>
    </div>
  );
}

function List({ items }: { items: { title: string; meta: string; status: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.title} className="rounded-lg border p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{item.meta}</p>
            </div>
            <StatusBadge status={item.status} />
          </div>
        </div>
      ))}
    </div>
  );
}
