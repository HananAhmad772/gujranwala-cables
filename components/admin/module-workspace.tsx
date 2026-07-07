"use client";

import { Plus, UploadCloud, type LucideIcon } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { ImageUpload } from "@/components/admin/image-upload";
import { PageHeader } from "@/components/admin/page-header";
import { SectionCard } from "@/components/admin/section-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePreferences } from "@/contexts/preferences-context";

type Row = {
  name: string;
  type: string;
  status: string;
  updated: string;
};

type ModuleWorkspaceProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  rows?: Row[];
  imageTools?: boolean;
};

const fallbackRows: Row[] = [
  { name: "XLPE Power Cable", type: "Product record", status: "API READY", updated: "Today" },
  { name: "Dealer inquiry queue", type: "Workflow", status: "PENDING", updated: "2h ago" },
  { name: "Industrial automation article", type: "Content", status: "DRAFT", updated: "Yesterday" },
];

export function ModuleWorkspace({ title, description, icon: Icon, rows = fallbackRows, imageTools }: ModuleWorkspaceProps) {
  const { t } = usePreferences();

  const columns: DataTableColumn<Row>[] = [
    {
      key: "name",
      header: "Name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </span>
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    { key: "type", header: "Type", render: (row) => row.type },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { key: "updated", header: "Updated", render: (row) => <span className="text-muted-foreground">{row.updated}</span> },
  ];

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: t.nav.dashboard, href: "/admin" }, { label: title }]}
        eyebrow="Workspace"
        title={title}
        description={description}
        actions={
          <>
            {/* <Button variant="outline">
              <UploadCloud className="h-4 w-4" />
              Import
            </Button> */}
            <Button>
              <Plus className="h-4 w-4" />
              Prepare New
            </Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <SectionCard
          title={title}
          description={t.common.comingSoon}
          action={<Badge variant="secondary">Backend ready</Badge>}
        >
          <DataTable
            rows={rows}
            columns={columns}
            emptyTitle={t.states.emptyTitle}
            emptyDescription={t.states.emptyDescription}
            searchPlaceholder={`Search ${title.toLowerCase()}`}
          />
        </SectionCard>

        {/* <div className="space-y-6">
          <SectionCard title="Integration Plan" description="Reusable API hooks are prepared for this workspace.">
            <div className="space-y-3 text-sm">
              {["Connect list endpoint", "Map create/edit forms", "Add delete confirmation", "Enable toast feedback"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-md border p-3">
                  <span className="h-2 w-2 rounded-full bg-secondary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </SectionCard>
          {imageTools ? <ImageUpload /> : null}
        </div> */}
      </div>
    </div>
  );
}
