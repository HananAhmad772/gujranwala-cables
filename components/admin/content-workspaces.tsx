"use client";

import {
  BookOpenText,
  Building2,
  Check,
  Edit3,
  FileQuestion,
  FolderTree,
  MessageSquareText,
  Package,
  Plus,
  Star,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { PageHeader } from "@/components/admin/page-header";
import { SectionCard } from "@/components/admin/section-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Dialog, ConfirmDialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePreferences } from "@/contexts/preferences-context";
import { adminApi } from "@/services/admin-api";
import { ImageUpload } from "@/components/admin/image-upload";
import { useToast } from "@/components/ui/toast";

type ContactStatus = "New" | "Contacted" | "Closed";
type ReviewStatus = "Pending" | "Approved" | "Rejected";
type PublishStatus = "Draft" | "Published";
type ActiveStatus = "Active" | "Inactive";
type ProductStatus = "Active" | "Inactive";

type ContactRow = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  description: string;
  status: ContactStatus;
  createdAt: string;
};

type FAQRow = {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
};

type ReviewRow = {
  id: string;
  name: string;
  rating: number;
  review: string;
  status: ReviewStatus;
  createdAt: string;
};

type BlogRow = {
  id: string;
  featuredImage: string;
  title: string;
  subtitle: string;
  content: string;
  readingTime: string;
  publishedDate: string;
  status: PublishStatus;
};

type CategoryRow = {
  id: string;
  logo: string;
  title: string;
  description: string;
  status: ActiveStatus;
  createdAt: string;
};

type BrandRow = {
  id: string;
  logo: string;
  brandName: string;
  description: string;
  status: ActiveStatus;
  createdAt: string;
};

type ProductRow = {
  id: string;
  featuredImage: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  brand: string;
  status: ProductStatus;
  createdAt: string;
};

const TODAY_VALUE = new Date().toISOString().slice(0, 10);
let nextEntityId = 0;

function createEntityId(prefix: string) {
  nextEntityId += 1;
  return `${prefix}-${nextEntityId}`;
}

function getToday() {
  return TODAY_VALUE;
}

const contactRows: ContactRow[] = [
  {
    id: "inq-1",
    fullName: "Bilal Ahmed",
    phone: "+92 300 864 1200",
    email: "bilal@example.com",
    description: "Needs wholesale pricing for copper building wire and delivery timeline for Lahore.",
    status: "New",
    createdAt: "2026-07-07",
  },
  {
    id: "inq-2",
    fullName: "Gujrat Builders",
    phone: "+92 321 445 9901",
    email: "purchase@gujratbuilders.com",
    description: "Commercial project inquiry for PVC cable, DB accessories, and branded wiring stock.",
    status: "Contacted",
    createdAt: "2026-07-06",
  },
  {
    id: "inq-3",
    fullName: "Metro Supply",
    phone: "+92 333 778 4010",
    email: "sales@metrosupply.pk",
    description: "Retail stock discussion for authorized wire brands and monthly supply terms.",
    status: "Closed",
    createdAt: "2026-07-05",
  },
];

const faqRows: FAQRow[] = [
  {
    id: "faq-1",
    question: "Do you supply wholesale electrical wires?",
    answer: "Yes. We support wholesale and retail orders for premium wire and cable products.",
    createdAt: "2026-07-01",
  },
  {
    id: "faq-2",
    question: "Can I request product guidance before buying?",
    answer: "Yes. Our team can help match wire size, brand, and product type with your project needs.",
    createdAt: "2026-07-02",
  },
];

const blogRows: BlogRow[] = [
  {
    id: "blog-1",
    featuredImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=70",
    title: "How to choose wire size for a shop or home",
    subtitle: "A practical buying guide for safe electrical wiring.",
    content: "Choosing wire size depends on load, distance, installation method, brand quality, and the advice of a qualified electrician.",
    readingTime: "5 min",
    publishedDate: "2026-06-18",
    status: "Published",
  },
  {
    id: "blog-2",
    featuredImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=300&q=70",
    title: "Why authorized electrical brands matter",
    subtitle: "How branded stock helps protect your project investment.",
    content: "Authorized brands provide clearer specifications, better trust, and more consistent buying confidence for contractors and households.",
    readingTime: "4 min",
    publishedDate: "2026-05-27",
    status: "Draft",
  },
];

const brandRows: BrandRow[] = [
  {
    id: "brand-1",
    logo: "PL",
    brandName: "Premium Line",
    description: "Authorized premium wire and cable brand for regular retail and project supply.",
    status: "Active",
    createdAt: "2026-07-01",
  },
  {
    id: "brand-2",
    logo: "SF",
    brandName: "SafeFlex",
    description: "Quality electrical wiring range for homes, shops, and installers.",
    status: "Inactive",
    createdAt: "2026-07-02",
  },
];

const productRows: ProductRow[] = [
  {
    id: "prod-1",
    featuredImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=70",
    title: "Premium Copper Building Wire",
    subtitle: "Branded copper wire for safe everyday wiring.",
    description: "Available for retail counters, contractors, and wholesale project supply.",
    category: "Building Wires",
    brand: "Premium Line",
    status: "Active",
    createdAt: "2026-07-01",
  },
  {
    id: "prod-2",
    featuredImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300&q=70",
    title: "Low Voltage Power Cable",
    subtitle: "Quality cable stock for commercial electrical work.",
    description: "Suitable for builders, shops, and project procurement teams.",
    category: "Power Cables",
    brand: "SafeFlex",
    status: "Active",
    createdAt: "2026-07-03",
  },
];

function Thumbnail({ src, label }: { src?: string; label: string }) {
  if (!src) {
    return (
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
        {label.slice(0, 2)}
      </span>
    );
  }

  return <Image src={src} alt="" width={40} height={40} className="h-10 w-10 rounded-md object-cover" loading="lazy" />;
}

function LogoMark({ label }: { label: string }) {
  return <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">{label}</span>;
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={onEdit}>
        <Edit3 className="h-4 w-4" />
        Edit
      </Button>
      <Button variant="destructive" size="sm" onClick={onDelete}>
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
    </div>
  );
}

function StatusSelect<T extends string>({ value, options, onChange }: { value: T; options: T[]; onChange: (value: T) => void }) {
  return (
    <label className="inline-flex items-center gap-2">
      <StatusBadge status={value} />
      <select
        className="h-9 rounded-md border bg-card px-2 text-xs font-medium outline-none"
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        aria-label="Update status"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function WorkspaceHeader({
  title,
  description,
  icon: Icon,
  addLabel,
  onAdd,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  addLabel: string;
  onAdd: () => void;
}) {
  const { t } = usePreferences();

  return (
    <PageHeader
      breadcrumbs={[{ label: t.nav.dashboard, href: "/admin" }, { label: title }]}
      eyebrow="Workspace"
      title={title}
      description={description}
      actions={
        <>
          <span className="hidden h-10 w-10 items-center justify-center rounded-md border bg-card text-muted-foreground sm:flex">
            <Icon className="h-4 w-4" />
          </span>
          <Button onClick={onAdd}>
            <Plus className="h-4 w-4" />
            {addLabel}
          </Button>
        </>
      }
    />
  );
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function mapReviewStatusToUi(status: string): ReviewStatus {
  if (status === "APPROVED") return "Approved";
  if (status === "REJECTED") return "Rejected";
  return "Pending";
}

function mapReviewStatusToApi(status: ReviewStatus): "PENDING" | "APPROVED" | "REJECTED" {
  if (status === "Approved") return "APPROVED";
  if (status === "Rejected") return "REJECTED";
  return "PENDING";
}

function mapCategoryStatusToUi(isActive: boolean): ActiveStatus {
  return isActive ? "Active" : "Inactive";
}

function formatReviewRow(review: {
  id: string;
  name: string;
  rating: number;
  comment?: string | null;
  status?: string;
  createdAt?: string;
}): ReviewRow {
  return {
    id: review.id,
    name: review.name,
    rating: review.rating,
    review: review.comment ?? "",
    status: mapReviewStatusToUi(review.status ?? "PENDING"),
    createdAt: review.createdAt ? review.createdAt.slice(0, 10) : getToday(),
  };
}

function formatCategoryRow(category: {
  id: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
  createdAt?: string;
}): CategoryRow {
  return {
    id: category.id,
    logo: category.name.slice(0, 2).toUpperCase(),
    title: category.name,
    description: category.description ?? "",
    status: mapCategoryStatusToUi(category.isActive ?? true),
    createdAt: category.createdAt ? category.createdAt.slice(0, 10) : getToday(),
  };
}

function mapContactStatusToUi(status: string): ContactStatus {
  if (status === "CONTACTED") return "Contacted";
  if (status === "CLOSED") return "Closed";
  return "New";
}

function mapContactStatusToApi(status: ContactStatus): "NEW" | "CONTACTED" | "CLOSED" {
  if (status === "Contacted") return "CONTACTED";
  if (status === "Closed") return "CLOSED";
  return "NEW";
}

function formatContactRow(contact: any): ContactRow {
  return {
    id: contact.id,
    fullName: contact.name,
    phone: contact.phone ?? "",
    email: contact.email,
    description: contact.message,
    status: mapContactStatusToUi(contact.status),
    createdAt: contact.createdAt ? contact.createdAt.slice(0, 10) : getToday(),
  };
}

export function ContactMessagesWorkspace() {
  const [rows, setRows] = useState<ContactRow[]>([]);
  const [status, setStatus] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ContactRow | null>(null);
  const [draft, setDraft] = useState<ContactRow>({
    id: createEntityId("inq"),
    fullName: "",
    phone: "",
    email: "",
    description: "",
    status: "New",
    createdAt: getToday(),
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadContacts = async () => {
    setLoading(true);
    try {
      const data = await adminApi<{ contacts: any[] }>("/api/contacts?page=1&limit=100");
      setRows(data.contacts.map(formatContactRow));
    } catch (err) {
      console.error(err);
      toast({ variant: "error", title: "Failed to load inquiries", description: "Could not fetch contact messages." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadContacts();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setDraft({ id: createEntityId("inq"), fullName: "", phone: "", email: "", description: "", status: "New", createdAt: getToday() });
    setFormOpen(true);
  };

  const openEdit = (row: ContactRow) => {
    setEditingId(row.id);
    setDraft({ ...row });
    setFormOpen(true);
  };

  const saveEntry = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.fullName.trim() || !draft.phone.trim() || !draft.email.trim() || !draft.description.trim()) return;

    setLoading(true);
    try {
      if (editingId) {
        const result = await adminApi<{ contact: any }>(`/api/contacts/${editingId}`, {
          method: "PATCH",
          body: {
            status: mapContactStatusToApi(draft.status)
          }
        });
        setRows((current) => current.map((row) => (row.id === editingId ? formatContactRow(result.contact) : row)));
        toast({ variant: "success", title: "Inquiry updated", description: "Contact status has been saved." });
      } else {
        const result = await adminApi<{ contact: any }>("/api/contacts", {
          method: "POST",
          body: {
            name: draft.fullName,
            phone: draft.phone,
            email: draft.email,
            message: draft.description,
          }
        });
        setRows((current) => [formatContactRow(result.contact), ...current]);
        toast({ variant: "success", title: "Inquiry created", description: "New contact message has been added." });
      }
      setFormOpen(false);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      toast({ variant: "error", title: editingId ? "Update failed" : "Create failed", description: "Could not save the inquiry. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (row: ContactRow, nextStatus: ContactStatus) => {
    setLoading(true);
    try {
      const result = await adminApi<{ contact: any }>(`/api/contacts/${row.id}`, {
        method: "PATCH",
        body: { status: mapContactStatusToApi(nextStatus) }
      });
      setRows((current) => current.map((item) => (item.id === row.id ? formatContactRow(result.contact) : item)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    try {
      await adminApi(`/api/contacts/${deleteTarget.id}`, { method: "DELETE" });
      setRows((current) => current.filter((row) => row.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast({ variant: "success", title: "Inquiry deleted", description: "The contact message has been removed." });
    } catch (err) {
      console.error(err);
      toast({ variant: "error", title: "Delete failed", description: "Could not delete the inquiry. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const visibleRows = useMemo(() => (status === "All" ? rows : rows.filter((row) => row.status === status)), [rows, status]);

  const columns: DataTableColumn<ContactRow>[] = [
    { key: "fullName", header: "Full Name", render: (row) => <span className="font-medium">{row.fullName}</span> },
    { key: "phone", header: "Phone Number", render: (row) => row.phone },
    { key: "email", header: "Email Address", render: (row) => row.email },
    { key: "description", header: "Description", render: (row) => <span className="line-clamp-2 max-w-sm text-muted-foreground">{row.description}</span> },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    { key: "createdAt", header: "Created At", render: (row) => <span className="text-muted-foreground">{row.createdAt}</span> },
    {
      key: "actions",
      header: "Actions",
      render: (row) => <RowActions onEdit={() => openEdit(row)} onDelete={() => setDeleteTarget(row)} />,
    },
  ];

  return (
    <div>
      <WorkspaceHeader title="Contact Inbox" description="Manage request a quote inquiries from the landing page." icon={MessageSquareText} addLabel=" Add Inquiry" onAdd={openCreate} />
      <SectionCard title="Contact Messages" description="Search, filter, update, edit, or delete customer inquiries.">
        <DataTable
          rows={visibleRows}
          columns={columns}
          emptyTitle="No inquiries found"
          emptyDescription="Request a quote messages will appear here."
          searchPlaceholder="Search inquiries"
          getSearchText={(row) => `${row.fullName} ${row.phone} ${row.email} ${row.description} ${row.status}`}
          filters={[
            {
              label: "Status",
              value: status,
              onChange: setStatus,
              options: ["All", "New", "Contacted", "Closed"].map((value) => ({ label: value, value })),
            },
          ]}
        />
      </SectionCard>

      <Dialog open={formOpen} title={editingId ? "Edit inquiry" : "Add inquiry"} description="Capture the customer details and update the inquiry status." onClose={() => setFormOpen(false)}>
        <form className="space-y-4" onSubmit={saveEntry}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={draft.fullName} onChange={(event) => setDraft((current) => ({ ...current, fullName: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value={draft.phone} onChange={(event) => setDraft((current) => ({ ...current, phone: event.target.value }))} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={draft.email} onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inquiry-status">Status</Label>
              <select id="inquiry-status" className="h-10 w-full rounded-md border bg-card px-3 text-sm" value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as ContactStatus }))}>
                {(["New", "Contacted", "Closed"] as ContactStatus[]).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="createdAt">Created At</Label>
              <Input id="createdAt" value={draft.createdAt} onChange={(event) => setDraft((current) => ({ ...current, createdAt: event.target.value }))} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>{editingId ? "Save changes" : "Create inquiry"}</Button>
          </div>
        </form>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete inquiry"
        description="This will remove the inquiry from the inbox."
        confirmText="Delete"
        cancelText="Cancel"
        destructive
        onConfirm={() => {
          void handleDelete();
        }}
        onClose={() => setDeleteTarget(null)}
      >
        Delete this inquiry permanently?
      </ConfirmDialog>
    </div>
  );
}

function formatFAQRow(faq: any): FAQRow {
  return {
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
    createdAt: faq.createdAt ? faq.createdAt.slice(0, 10) : getToday(),
  };
}

export function FAQsWorkspace() {
  const [rows, setRows] = useState<FAQRow[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FAQRow | null>(null);
  const [draft, setDraft] = useState<FAQRow>({ id: createEntityId("faq"), question: "", answer: "", createdAt: getToday() });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadFAQs = async () => {
    setLoading(true);
    try {
      const data = await adminApi<{ faqs: any[] }>("/api/faqs?page=1&limit=100");
      setRows(data.faqs.map(formatFAQRow));
    } catch (err) {
      console.error(err);
      toast({ variant: "error", title: "Failed to load FAQs", description: "Could not fetch FAQ entries." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFAQs();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setDraft({ id: createEntityId("faq"), question: "", answer: "", createdAt: getToday() });
    setFormOpen(true);
  };

  const openEdit = (row: FAQRow) => {
    setEditingId(row.id);
    setDraft({ ...row });
    setFormOpen(true);
  };

  const saveEntry = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.question.trim() || !draft.answer.trim()) return;

    setLoading(true);
    try {
      const payload = {
        question: draft.question,
        answer: draft.answer,
      };

      if (editingId) {
        const result = await adminApi<{ faq: any }>(`/api/faqs/${editingId}`, {
          method: "PATCH",
          body: payload,
        });
        setRows((current) => current.map((row) => (row.id === editingId ? formatFAQRow(result.faq) : row)));
        toast({ variant: "success", title: "FAQ updated", description: "The question and answer have been saved." });
      } else {
        const result = await adminApi<{ faq: any }>("/api/faqs", {
          method: "POST",
          body: payload,
        });
        setRows((current) => [formatFAQRow(result.faq), ...current]);
        toast({ variant: "success", title: "FAQ created", description: "New FAQ has been added to the library." });
      }
      setFormOpen(false);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      toast({ variant: "error", title: editingId ? "Update failed" : "Create failed", description: "Could not save the FAQ. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    try {
      await adminApi(`/api/faqs/${deleteTarget.id}`, { method: "DELETE" });
      setRows((current) => current.filter((row) => row.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast({ variant: "success", title: "FAQ deleted", description: "The FAQ has been removed from the library." });
    } catch (err) {
      console.error(err);
      toast({ variant: "error", title: "Delete failed", description: "Could not delete the FAQ. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const columns: DataTableColumn<FAQRow>[] = [
    { key: "question", header: "Question", render: (row) => <span className="font-medium">{row.question}</span> },
    { key: "answer", header: "Answer", render: (row) => <span className="line-clamp-2 max-w-xl text-muted-foreground">{row.answer}</span> },
    { key: "createdAt", header: "Created At", render: (row) => <span className="text-muted-foreground">{row.createdAt}</span> },
    { key: "actions", header: "Actions", render: (row) => <RowActions onEdit={() => openEdit(row)} onDelete={() => setDeleteTarget(row)} /> },
  ];

  return (
    <div>
      <WorkspaceHeader title="FAQ Library" description="Manage public questions and answers." icon={FileQuestion} addLabel="Add FAQ" onAdd={openCreate} />
      <SectionCard title="Current FAQ List" description="Keep answers clear for product buyers and quotation requests.">
        <DataTable rows={rows} columns={columns} emptyTitle="No FAQs found" emptyDescription="Add FAQs for the public website." searchPlaceholder="Search FAQs" getSearchText={(row) => `${row.question} ${row.answer}`} />
      </SectionCard>

      <Dialog open={formOpen} title={editingId ? "Edit FAQ" : "Add FAQ"} description="Define a public answer for your customers." onClose={() => setFormOpen(false)}>
        <form className="space-y-4" onSubmit={saveEntry}>
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Input id="question" value={draft.question} onChange={(event) => setDraft((current) => ({ ...current, question: event.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="answer">Answer</Label>
            <Textarea id="answer" value={draft.answer} onChange={(event) => setDraft((current) => ({ ...current, answer: event.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="faq-date">Created At</Label>
            <Input id="faq-date" value={draft.createdAt} onChange={(event) => setDraft((current) => ({ ...current, createdAt: event.target.value }))} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>{editingId ? "Save changes" : "Create FAQ"}</Button>
          </div>
        </form>
      </Dialog>

      <ConfirmDialog open={Boolean(deleteTarget)} title="Delete FAQ" description="This will remove the FAQ from the public site." confirmText="Delete" cancelText="Cancel" destructive onConfirm={() => { void handleDelete(); }} onClose={() => setDeleteTarget(null)}>
        Delete this FAQ permanently?
      </ConfirmDialog>
    </div>
  );
}

export function ReviewsWorkspace() {
  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [status, setStatus] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ReviewRow | null>(null);
  const [draft, setDraft] = useState<ReviewRow>({ id: createEntityId("rev"), name: "", rating: 5, review: "", status: "Pending", createdAt: getToday() });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const visibleRows = useMemo(() => (status === "All" ? rows : rows.filter((row) => row.status === status)), [rows, status]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await adminApi<{ reviews: Array<{ id: string; name: string; rating: number; comment?: string | null; status?: string; createdAt?: string }> }>('/api/reviews?page=1&limit=100');
      setRows(data.reviews.map(formatReviewRow));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadReviews = async () => {
      setLoading(true);
      try {
        const data = await adminApi<{ reviews: Array<{ id: string; name: string; rating: number; comment?: string | null; status?: string; createdAt?: string }> }>('/api/reviews?page=1&limit=100');
        if (!isMounted) return;
        setRows(data.reviews.map(formatReviewRow));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setDraft({ id: createEntityId("rev"), name: "", rating: 5, review: "", status: "Pending", createdAt: getToday() });
    setFormOpen(true);
  };

  const openEdit = (row: ReviewRow) => {
    setEditingId(row.id);
    setDraft({ ...row });
    setFormOpen(true);
  };

  const saveEntry = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.name.trim() || !draft.review.trim()) return;

    setLoading(true);
    try {
      if (editingId) {
        const result = await adminApi<{ review: { id: string; name: string; rating: number; comment?: string | null; status?: string; createdAt?: string } }>(`/api/reviews/${editingId}`, {
          method: "PATCH",
          body: {
            name: draft.name,
            rating: draft.rating,
            comment: draft.review,
            status: mapReviewStatusToApi(draft.status),
          },
        });
        setRows((current) => current.map((row) => (row.id === editingId ? formatReviewRow(result.review) : row)));
        toast({ variant: "success", title: "Review updated", description: "The review details have been saved." });
      } else {
        const result = await adminApi<{ review: { id: string; name: string; rating: number; comment?: string | null; status?: string; createdAt?: string } }>('/api/reviews', {
          method: "POST",
          body: {
            name: draft.name,
            rating: draft.rating,
            comment: draft.review,
          },
        });
        setRows((current) => [formatReviewRow(result.review), ...current]);
        toast({ variant: "success", title: "Review created", description: "New review has been added." });
      }

      setFormOpen(false);
      setEditingId(null);
    } catch (err) {
      toast({ variant: "error", title: editingId ? "Update failed" : "Create failed", description: "Could not save the review. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (row: ReviewRow, nextStatus: ReviewStatus) => {
    setLoading(true);
    try {
      const result = await adminApi<{ review: { id: string; name: string; rating: number; comment?: string | null; status?: string; createdAt?: string } }>(`/api/reviews/${row.id}`, {
        method: "PATCH",
        body: { status: mapReviewStatusToApi(nextStatus) },
      });
      setRows((current) => current.map((item) => (item.id === row.id ? formatReviewRow(result.review) : item)));
      toast({ variant: "success", title: `Review ${nextStatus.toLowerCase()}`, description: `The review has been marked as ${nextStatus.toLowerCase()}.` });
    } catch (err) {
      toast({ variant: "error", title: "Status update failed", description: `Could not mark the review as ${nextStatus.toLowerCase()}.` });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setLoading(true);
    try {
      await adminApi(`/api/reviews/${deleteTarget.id}`, { method: "DELETE" });
      setRows((current) => current.filter((row) => row.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast({ variant: "success", title: "Review deleted", description: "The review has been removed." });
    } catch (err) {
      toast({ variant: "error", title: "Delete failed", description: "Could not delete the review. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const columns: DataTableColumn<ReviewRow>[] = [
    { key: "name", header: "Name", render: (row) => <span className="font-medium">{row.name}</span> },
    {
      key: "rating",
      header: "Rating",
      render: (row) => (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={`${row.id}-${index}`} className={`h-4 w-4 ${index < row.rating ? "fill-current text-amber-500" : "text-muted-foreground"}`} />
          ))}
        </div>
      ),
    },
    { key: "review", header: "Review", render: (row) => <span className="line-clamp-2 max-w-md text-muted-foreground">{row.review}</span> },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { key: "createdAt", header: "Created At", render: (row) => <span className="text-muted-foreground">{row.createdAt}</span> },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          {row.status === "Pending" && (
            <>
              <Button variant="outline" size="sm" onClick={() => void updateStatus(row, "Approved")}>
                <Check className="h-4 w-4" />
                Approve
              </Button>
              <Button variant="outline" size="sm" onClick={() => void updateStatus(row, "Rejected")}>
                <X className="h-4 w-4" />
                Reject
              </Button>
            </>
          )}
          <RowActions onEdit={() => openEdit(row)} onDelete={() => setDeleteTarget(row)} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <WorkspaceHeader title="Review Moderation" description="Display, edit, approve, reject, and delete customer feedback." icon={Star} addLabel="Add Review" onAdd={openCreate} />
      <SectionCard title="All Reviews" description="Only approved reviews should be shown on the public website.">
        <DataTable
          rows={visibleRows}
          columns={columns}
          emptyTitle="No reviews found"
          emptyDescription="Customer feedback will appear here."
          searchPlaceholder="Search reviews"
          getSearchText={(row) => `${row.name} ${row.rating} ${row.review} ${row.status}`}
          filters={[
            {
              label: "Status",
              value: status,
              onChange: setStatus,
              options: ["All", "Pending", "Approved", "Rejected"].map((value) => ({ label: value, value })),
            },
          ]}
        />
      </SectionCard>

      <Dialog open={formOpen} title={editingId ? "Edit review" : "Add review"} description="Manage customer feedback before it appears publicly." onClose={() => setFormOpen(false)}>
        <form className="space-y-4" onSubmit={saveEntry}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="review-name">Name</Label>
              <Input id="review-name" value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="review-rating">Rating</Label>
              <select id="review-rating" className="h-10 w-full rounded-md border bg-card px-3 text-sm" value={draft.rating} onChange={(event) => setDraft((current) => ({ ...current, rating: Number(event.target.value) }))}>
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value}/5
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="review-text">Review</Label>
              <Textarea id="review-text" value={draft.review} onChange={(event) => setDraft((current) => ({ ...current, review: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="review-status">Status</Label>
              <select id="review-status" className="h-10 w-full rounded-md border bg-card px-3 text-sm" value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as ReviewStatus }))}>
                {(["Pending", "Approved", "Rejected"] as ReviewStatus[]).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="review-date">Created At</Label>
              <Input id="review-date" value={draft.createdAt} onChange={(event) => setDraft((current) => ({ ...current, createdAt: event.target.value }))} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>{editingId ? "Save changes" : "Create review"}</Button>
          </div>
        </form>
      </Dialog>

      <ConfirmDialog open={Boolean(deleteTarget)} title="Delete review" description="This will remove the feedback from the moderation list." confirmText="Delete" cancelText="Cancel" destructive onConfirm={() => { void handleDelete(); }} onClose={() => setDeleteTarget(null)}>
        Delete this review permanently?
      </ConfirmDialog>
    </div>
  );
}

function formatBlogRow(post: any): BlogRow {
  const wordCount = post.content ? post.content.split(/\s+/).length : 0;
  const readingTime = `${Math.max(1, Math.ceil(wordCount / 200))} min`;
  return {
    id: post.id,
    featuredImage: post.featuredImage ?? "",
    title: post.title,
    subtitle: post.excerpt ?? "",
    content: post.content,
    readingTime,
    publishedDate: post.publishedAt ? post.publishedAt.slice(0, 10) : getToday(),
    status: post.status === "PUBLISHED" ? "Published" : "Draft",
  };
}

export function BlogsWorkspace() {
  const [rows, setRows] = useState<BlogRow[]>([]);
  const [selected, setSelected] = useState<BlogRow | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BlogRow | null>(null);
  const [draft, setDraft] = useState<BlogRow>({ id: createEntityId("blog"), featuredImage: "", title: "", subtitle: "", content: "", readingTime: "", publishedDate: getToday(), status: "Draft" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const data = await adminApi<{ blogs: any[] }>("/api/blogs?page=1&limit=100");
      setRows(data.blogs.map(formatBlogRow));
    } catch (err) {
      console.error(err);
      toast({ variant: "error", title: "Failed to load blogs", description: "Could not fetch blog posts." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBlogs();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setDraft({ id: createEntityId("blog"), featuredImage: "", title: "", subtitle: "", content: "", readingTime: "", publishedDate: getToday(), status: "Draft" });
    setFormOpen(true);
  };

  const openEdit = (row: BlogRow) => {
    setEditingId(row.id);
    setDraft({ ...row });
    setFormOpen(true);
  };

  const saveEntry = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim() || !draft.subtitle.trim() || !draft.content.trim()) return;

    setLoading(true);
    try {
      const payload = {
        title: draft.title,
        slug: toSlug(draft.title) || createEntityId("blog"),
        excerpt: draft.subtitle,
        content: draft.content,
        featuredImage: draft.featuredImage || null,
        status: draft.status === "Published" ? "PUBLISHED" : "DRAFT",
        publishedAt: draft.status === "Published" ? new Date().toISOString() : null,
      };

      if (editingId) {
        const result = await adminApi<{ blog: any }>(`/api/blogs/${editingId}`, {
          method: "PATCH",
          body: payload,
        });
        setRows((current) => current.map((row) => (row.id === editingId ? formatBlogRow(result.blog) : row)));
        if (selected?.id === editingId) {
          setSelected(formatBlogRow(result.blog));
        }
        toast({ variant: "success", title: "Blog updated", description: "The blog post has been saved." });
      } else {
        const result = await adminApi<{ blog: any }>("/api/blogs", {
          method: "POST",
          body: payload,
        });
        setRows((current) => [formatBlogRow(result.blog), ...current]);
        toast({ variant: "success", title: "Blog created", description: "New blog post has been added." });
      }
      setFormOpen(false);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      toast({ variant: "error", title: editingId ? "Update failed" : "Create failed", description: "Could not save the blog post. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    try {
      await adminApi(`/api/blogs/${deleteTarget.id}`, { method: "DELETE" });
      setRows((current) => current.filter((row) => row.id !== deleteTarget.id));
      if (selected?.id === deleteTarget.id) setSelected(null);
      setDeleteTarget(null);
      toast({ variant: "success", title: "Blog deleted", description: "The blog post has been removed." });
    } catch (err) {
      console.error(err);
      toast({ variant: "error", title: "Delete failed", description: "Could not delete the blog post. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const columns: DataTableColumn<BlogRow>[] = [
    { key: "featuredImage", header: "Featured Image", render: (row) => <Thumbnail src={row.featuredImage} label={row.title} /> },
    { key: "title", header: "Title", render: (row) => <button className="text-start font-medium text-primary" onClick={() => setSelected(row)}>{row.title}</button> },
    { key: "subtitle", header: "Subtitle", render: (row) => <span className="line-clamp-2 max-w-sm text-muted-foreground">{row.subtitle}</span> },
    { key: "readingTime", header: "Estimated Reading Time", render: (row) => row.readingTime },
    { key: "publishedDate", header: "Published Date", render: (row) => <span className="text-muted-foreground">{row.publishedDate}</span> },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { key: "actions", header: "Actions", render: (row) => <RowActions onEdit={() => openEdit(row)} onDelete={() => setDeleteTarget(row)} /> },
  ];

  return (
    <div>
      <WorkspaceHeader title="Knowledge Center" description="Manage blog posts, images, publishing status, and reading details." icon={BookOpenText} addLabel="Add Blog" onAdd={openCreate} />
      <div className="grid gap-6">
        <SectionCard title="Current Blogs" description="Click a blog title to open its details.">
          <DataTable rows={rows} columns={columns} emptyTitle="No blogs found" emptyDescription="Add blog posts for the public website." searchPlaceholder="Search blogs" getSearchText={(row) => `${row.title} ${row.subtitle} ${row.content} ${row.status}`} />
        </SectionCard>
        {selected ? (
          <SectionCard
            title={selected.title}
            description={selected.subtitle}
            action={<RowActions onEdit={() => openEdit(selected)} onDelete={() => { setDeleteTarget(selected); }} />}
          >
            <div className="grid gap-5 lg:grid-cols-[120px_1fr]">
              <Thumbnail src={selected.featuredImage} label={selected.title} />
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">{selected.content}</p>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={selected.status} />
                  <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">{selected.readingTime}</span>
                  <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">{selected.publishedDate}</span>
                </div>
              </div>
            </div>
          </SectionCard>
        ) : null}
      </div>

      <Dialog open={formOpen} title={editingId ? "Edit blog" : "Add blog"} description="Create or revise blog content for the public knowledge center." onClose={() => setFormOpen(false)}>
        <form className="space-y-4" onSubmit={saveEntry}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="blog-image">Featured Image</Label>
              <ImageUpload
                value={draft.featuredImage}
                onChange={(url) => setDraft((current) => ({ ...current, featuredImage: url }))}
                label="Blog Featured Image"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-title">Title</Label>
              <Input id="blog-title" value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-subtitle">Subtitle</Label>
              <Input id="blog-subtitle" value={draft.subtitle} onChange={(event) => setDraft((current) => ({ ...current, subtitle: event.target.value }))} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="blog-content">Content</Label>
              <Textarea id="blog-content" value={draft.content} onChange={(event) => setDraft((current) => ({ ...current, content: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-readtime">Estimated Reading Time</Label>
              <Input id="blog-readtime" value={draft.readingTime} onChange={(event) => setDraft((current) => ({ ...current, readingTime: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-date">Published Date</Label>
              <Input id="blog-date" value={draft.publishedDate} onChange={(event) => setDraft((current) => ({ ...current, publishedDate: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blog-status">Status</Label>
              <select id="blog-status" className="h-10 w-full rounded-md border bg-card px-3 text-sm" value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as PublishStatus }))}>
                {(["Draft", "Published"] as PublishStatus[]).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>{editingId ? "Save changes" : "Create blog"}</Button>
          </div>
        </form>
      </Dialog>

      <ConfirmDialog open={Boolean(deleteTarget)} title="Delete blog" description="This will remove the blog from the knowledge center." confirmText="Delete" cancelText="Cancel" destructive onConfirm={() => { void handleDelete(); }} onClose={() => setDeleteTarget(null)}>
        Delete this blog permanently?
      </ConfirmDialog>
    </div>
  );
}

export function CategoriesWorkspace() {
  const [rows, setRows] = useState<CategoryRow[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CategoryRow | null>(null);
  const [draft, setDraft] = useState<CategoryRow>({ id: createEntityId("cat"), logo: "", title: "", description: "", status: "Active", createdAt: getToday() });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await adminApi<{ categories: Array<{ id: string; name: string; description?: string | null; isActive?: boolean; createdAt?: string }> }>('/api/categories?page=1&limit=100');
      setRows(data.categories.map(formatCategoryRow));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      setLoading(true);
      try {
        const data = await adminApi<{ categories: Array<{ id: string; name: string; description?: string | null; isActive?: boolean; createdAt?: string }> }>('/api/categories?page=1&limit=100');
        if (!isMounted) return;
        setRows(data.categories.map(formatCategoryRow));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setDraft({ id: createEntityId("cat"), logo: "", title: "", description: "", status: "Active", createdAt: getToday() });
    setFormOpen(true);
  };

  const openEdit = (row: CategoryRow) => {
    setEditingId(row.id);
    setDraft({ ...row });
    setFormOpen(true);
  };

  const saveEntry = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim() || !draft.description.trim()) return;

    setLoading(true);
    try {
      const payload = {
        name: draft.title,
        slug: toSlug(draft.title) || createEntityId("category"),
        description: draft.description,
        isActive: draft.status === "Active",
      };

      if (editingId) {
        const result = await adminApi<{ category: { id: string; name: string; description?: string | null; isActive?: boolean; createdAt?: string } }>(`/api/categories/${editingId}`, {
          method: "PATCH",
          body: payload,
        });
        setRows((current) => current.map((row) => (row.id === editingId ? formatCategoryRow(result.category) : row)));
        toast({ variant: "success", title: "Category updated", description: "The category details have been saved." });
      } else {
        const result = await adminApi<{ category: { id: string; name: string; description?: string | null; isActive?: boolean; createdAt?: string } }>('/api/categories', {
          method: "POST",
          body: payload,
        });
        setRows((current) => [formatCategoryRow(result.category), ...current]);
        toast({ variant: "success", title: "Category created", description: "New category has been added to the catalog." });
      }

      setFormOpen(false);
      setEditingId(null);
    } catch (err) {
      toast({ variant: "error", title: editingId ? "Update failed" : "Create failed", description: "Could not save the category. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (row: CategoryRow, nextStatus: ActiveStatus) => {
    setLoading(true);
    try {
      const result = await adminApi<{ category: { id: string; name: string; description?: string | null; isActive?: boolean; createdAt?: string } }>(`/api/categories/${row.id}`, {
        method: "PATCH",
        body: {
          name: row.title,
          slug: toSlug(row.title) || `category-${row.id}`,
          description: row.description,
          isActive: nextStatus === "Active",
        },
      });
      setRows((current) => current.map((item) => (item.id === row.id ? formatCategoryRow(result.category) : item)));
      toast({ variant: "success", title: "Category status updated", description: `"${row.title}" is now ${nextStatus.toLowerCase()}.` });
    } catch (err) {
      toast({ variant: "error", title: "Status update failed", description: "Could not update the category status." });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setLoading(true);
    try {
      await adminApi(`/api/categories/${deleteTarget.id}`, { method: "DELETE" });
      setRows((current) => current.filter((row) => row.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast({ variant: "success", title: "Category deleted", description: "The category has been removed from the catalog." });
    } catch (err) {
      toast({ variant: "error", title: "Delete failed", description: "Could not delete the category. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const columns: DataTableColumn<CategoryRow>[] = [
    { key: "logo", header: "Logo", render: (row) => <LogoMark label={row.logo} /> },
    { key: "title", header: "Title", render: (row) => <span className="font-medium">{row.title}</span> },
    { key: "description", header: "Description", render: (row) => <span className="line-clamp-2 max-w-md text-muted-foreground">{row.description}</span> },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <button
          type="button"
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${row.status === "Active" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600" : "border-muted bg-muted text-muted-foreground"}`}
          onClick={() => void updateStatus(row, row.status === "Active" ? "Inactive" : "Active")}
        >
          <span className={`h-2.5 w-2.5 rounded-full ${row.status === "Active" ? "bg-emerald-500" : "bg-muted-foreground"}`} />
          {row.status}
        </button>
      ),
    },
    { key: "createdAt", header: "Created At", render: (row) => <span className="text-muted-foreground">{row.createdAt}</span> },
    { key: "actions", header: "Actions", render: (row) => <RowActions onEdit={() => openEdit(row)} onDelete={() => setDeleteTarget(row)} /> },
  ];

  return (
    <div>
      <WorkspaceHeader title="Category Matrix" description="Manage category logos, copy, visibility, and product grouping." icon={FolderTree} addLabel="Add Category" onAdd={openCreate} />
      <SectionCard title="Categories" description="Active categories are ready for public catalog navigation.">
        <DataTable rows={rows} columns={columns} emptyTitle="No categories found" emptyDescription="Add categories for product browsing." searchPlaceholder="Search categories" getSearchText={(row) => `${row.title} ${row.description} ${row.status}`} />
      </SectionCard>

      <Dialog open={formOpen} title={editingId ? "Edit category" : "Add category"} description="Create or update category records for the catalog." onClose={() => setFormOpen(false)}>
        <form className="space-y-4" onSubmit={saveEntry}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category-logo">Logo</Label>
              <Input id="category-logo" value={draft.logo} onChange={(event) => setDraft((current) => ({ ...current, logo: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-title">Title</Label>
              <Input id="category-title" value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="category-description">Description</Label>
              <Textarea id="category-description" value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="category-status">Status</Label>
              <label className="flex items-center gap-3 rounded-md border bg-card px-3 py-2 text-sm">
                <input
                  id="category-status"
                  type="checkbox"
                  checked={draft.status === "Active"}
                  onChange={() => setDraft((current) => ({ ...current, status: current.status === "Active" ? "Inactive" : "Active" }))}
                  className="h-4 w-4 rounded border-input accent-primary"
                />
                <span>{draft.status === "Active" ? "Active" : "Inactive"}</span>
              </label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-date">Created At</Label>
              <Input id="category-date" value={draft.createdAt} onChange={(event) => setDraft((current) => ({ ...current, createdAt: event.target.value }))} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>{editingId ? "Save changes" : "Create category"}</Button>
          </div>
        </form>
      </Dialog>

      <ConfirmDialog open={Boolean(deleteTarget)} title="Delete category" description="This will remove the category from the catalog." confirmText="Delete" cancelText="Cancel" destructive onConfirm={() => { void handleDelete(); }} onClose={() => setDeleteTarget(null)}>
        Delete this category permanently?
      </ConfirmDialog>
    </div>
  );
}

function formatBrandRow(brand: any): BrandRow {
  return {
    id: brand.id,
    logo: brand.logoUrl ?? "",
    brandName: brand.name,
    description: brand.description ?? "",
    status: brand.isActive ? "Active" : "Inactive",
    createdAt: brand.createdAt ? brand.createdAt.slice(0, 10) : getToday(),
  };
}

export function BrandsWorkspace() {
  const [rows, setRows] = useState<BrandRow[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BrandRow | null>(null);
  const [draft, setDraft] = useState<BrandRow>({ id: createEntityId("brand"), logo: "", brandName: "", description: "", status: "Active", createdAt: getToday() });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadBrands = async () => {
    setLoading(true);
    try {
      const data = await adminApi<{ brands: any[] }>("/api/brands?page=1&limit=100");
      setRows(data.brands.map(formatBrandRow));
    } catch (err) {
      console.error(err);
      toast({ variant: "error", title: "Failed to load brands", description: "Could not fetch brand records." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBrands();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setDraft({ id: createEntityId("brand"), logo: "", brandName: "", description: "", status: "Active", createdAt: getToday() });
    setFormOpen(true);
  };

  const openEdit = (row: BrandRow) => {
    setEditingId(row.id);
    setDraft({ ...row });
    setFormOpen(true);
  };

  const saveEntry = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.brandName.trim() || !draft.description.trim()) return;

    setLoading(true);
    try {
      const payload = {
        name: draft.brandName,
        slug: toSlug(draft.brandName) || createEntityId("brand"),
        description: draft.description,
        logoUrl: draft.logo || null,
        isActive: draft.status === "Active",
      };

      if (editingId) {
        const result = await adminApi<{ brand: any }>(`/api/brands/${editingId}`, {
          method: "PATCH",
          body: payload,
        });
        setRows((current) => current.map((row) => (row.id === editingId ? formatBrandRow(result.brand) : row)));
        toast({ variant: "success", title: "Brand updated", description: "The brand details have been saved." });
      } else {
        const result = await adminApi<{ brand: any }>("/api/brands", {
          method: "POST",
          body: payload,
        });
        setRows((current) => [formatBrandRow(result.brand), ...current]);
        toast({ variant: "success", title: "Brand created", description: "New brand has been added to the library." });
      }
      setFormOpen(false);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      toast({ variant: "error", title: editingId ? "Update failed" : "Create failed", description: "Could not save the brand. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (row: BrandRow, nextStatus: ActiveStatus) => {
    setLoading(true);
    try {
      const result = await adminApi<{ brand: any }>(`/api/brands/${row.id}`, {
        method: "PATCH",
        body: {
          name: row.brandName,
          slug: toSlug(row.brandName) || `brand-${row.id}`,
          description: row.description,
          isActive: nextStatus === "Active",
        }
      });
      setRows((current) => current.map((item) => (item.id === row.id ? formatBrandRow(result.brand) : item)));
      toast({ variant: "success", title: "Brand status updated", description: `"${row.brandName}" is now ${nextStatus.toLowerCase()}.` });
    } catch (err) {
      console.error(err);
      toast({ variant: "error", title: "Status update failed", description: "Could not update the brand status." });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    try {
      await adminApi(`/api/brands/${deleteTarget.id}`, { method: "DELETE" });
      setRows((current) => current.filter((row) => row.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast({ variant: "success", title: "Brand deleted", description: "The brand has been removed from the library." });
    } catch (err) {
      console.error(err);
      toast({ variant: "error", title: "Delete failed", description: "Could not delete the brand. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const columns: DataTableColumn<BrandRow>[] = [
    { key: "logo", header: "Logo", render: (row) => <Thumbnail src={row.logo || undefined} label={row.brandName} /> },
    { key: "brandName", header: "Brand Name", render: (row) => <span className="font-medium">{row.brandName}</span> },
    { key: "description", header: "Description", render: (row) => <span className="line-clamp-2 max-w-md text-muted-foreground">{row.description}</span> },
    { key: "status", header: "Status", render: (row) => <StatusSelect value={row.status} options={["Active", "Inactive"]} onChange={(value) => void updateStatus(row, value)} /> },
    { key: "createdAt", header: "Created At", render: (row) => <span className="text-muted-foreground">{row.createdAt}</span> },
    { key: "actions", header: "Actions", render: (row) => <RowActions onEdit={() => openEdit(row)} onDelete={() => setDeleteTarget(row)} /> },
  ];

  return (
    <div>
      <WorkspaceHeader title="Brand Library" description="Manage authorized brand records, descriptions, and visibility." icon={Building2} addLabel="Add Brand" onAdd={openCreate} />
      <SectionCard title="Brands" description="Use brand records to organize product supply and retail catalog content.">
        <DataTable rows={rows} columns={columns} emptyTitle="No brands found" emptyDescription="Add authorized brands." searchPlaceholder="Search brands" getSearchText={(row) => `${row.brandName} ${row.description} ${row.status}`} />
      </SectionCard>

      <Dialog open={formOpen} title={editingId ? "Edit brand" : "Add brand"} description="Capture the brand identity and visibility settings." onClose={() => setFormOpen(false)}>
        <form className="space-y-4" onSubmit={saveEntry}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="brand-logo">Logo</Label>
              <ImageUpload
                value={draft.logo}
                onChange={(url) => setDraft((current) => ({ ...current, logo: url }))}
                label="Brand Logo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand-name">Brand Name</Label>
              <Input id="brand-name" value={draft.brandName} onChange={(event) => setDraft((current) => ({ ...current, brandName: event.target.value }))} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="brand-description">Description</Label>
              <Textarea id="brand-description" value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand-status">Status</Label>
              <select id="brand-status" className="h-10 w-full rounded-md border bg-card px-3 text-sm" value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as ActiveStatus }))}>
                {(["Active", "Inactive"] as ActiveStatus[]).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand-date">Created At</Label>
              <Input id="brand-date" value={draft.createdAt} onChange={(event) => setDraft((current) => ({ ...current, createdAt: event.target.value }))} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>{editingId ? "Save changes" : "Create brand"}</Button>
          </div>
        </form>
      </Dialog>

      <ConfirmDialog open={Boolean(deleteTarget)} title="Delete brand" description="This will remove the brand from the catalog." confirmText="Delete" cancelText="Cancel" destructive onConfirm={() => { void handleDelete(); }} onClose={() => setDeleteTarget(null)}>
        Delete this brand permanently?
      </ConfirmDialog>
    </div>
  );
}

function formatProductRow(product: any): ProductRow {
  return {
    id: product.id,
    featuredImage: product.featuredImage ?? "",
    title: product.name,
    subtitle: product.size ?? "",
    description: product.description ?? "",
    category: product.category?.name ?? "",
    brand: product.brand?.name ?? "",
    status: product.isActive ? "Active" : "Inactive",
    createdAt: product.createdAt ? product.createdAt.slice(0, 10) : getToday(),
  };
}

export function ProductsWorkspace() {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProductRow | null>(null);
  const [draft, setDraft] = useState<ProductRow>({ id: createEntityId("prod"), featuredImage: "", title: "", subtitle: "", description: "", category: "", brand: "", status: "Active", createdAt: getToday() });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  const loadProductsAndRelations = async () => {
    setLoading(true);
    try {
      const pData = await adminApi<{ products: any[] }>("/api/products?page=1&limit=100");
      const cData = await adminApi<{ categories: any[] }>("/api/categories?page=1&limit=100");
      const bData = await adminApi<{ brands: any[] }>("/api/brands?page=1&limit=100");
      
      setRows(pData.products.map(formatProductRow));
      setCategories(cData.categories);
      setBrands(bData.brands);
    } catch (err) {
      console.error(err);
      toast({ variant: "error", title: "Failed to load products", description: "Could not fetch the product catalog." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProductsAndRelations();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setDraft({ 
      id: createEntityId("prod"), 
      featuredImage: "", 
      title: "", 
      subtitle: "", 
      description: "", 
      category: categories[0]?.name ?? "", 
      brand: brands[0]?.name ?? "", 
      status: "Active", 
      createdAt: getToday() 
    });
    setFormOpen(true);
  };

  const openEdit = (row: ProductRow) => {
    setEditingId(row.id);
    setDraft({ ...row });
    setFormOpen(true);
  };

  const saveEntry = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim() || !draft.description.trim()) return;

    const catId = categories.find((c) => c.name === draft.category)?.id;
    const brandId = brands.find((b) => b.name === draft.brand)?.id;

    if (!catId || !brandId) {
      alert("Please select a valid category and brand.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: draft.title,
        slug: toSlug(draft.title) || createEntityId("product"),
        description: draft.description,
        size: draft.subtitle,
        price: "100.00",
        categoryId: catId,
        brandId: brandId,
        featuredImage: draft.featuredImage || null,
        isActive: draft.status === "Active",
      };

      if (editingId) {
        const result = await adminApi<{ product: any }>(`/api/products/${editingId}`, {
          method: "PATCH",
          body: payload,
        });
        setRows((current) => current.map((row) => (row.id === editingId ? formatProductRow(result.product) : row)));
        toast({ variant: "success", title: "Product updated", description: "The product details have been saved." });
      } else {
        const result = await adminApi<{ product: any }>("/api/products", {
          method: "POST",
          body: payload,
        });
        setRows((current) => [formatProductRow(result.product), ...current]);
        toast({ variant: "success", title: "Product created", description: "New product has been added to the catalog." });
      }
      setFormOpen(false);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      toast({ variant: "error", title: editingId ? "Update failed" : "Create failed", description: "Could not save the product. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (row: ProductRow, nextStatus: ProductStatus) => {
    setLoading(true);
    try {
      const catId = categories.find((c) => c.name === row.category)?.id;
      const brandId = brands.find((b) => b.name === row.brand)?.id;
      
      const result = await adminApi<{ product: any }>(`/api/products/${row.id}`, {
        method: "PATCH",
        body: {
          name: row.title,
          slug: toSlug(row.title) || `product-${row.id}`,
          description: row.description,
          categoryId: catId,
          brandId: brandId,
          isActive: nextStatus === "Active",
        }
      });
      setRows((current) => current.map((item) => (item.id === row.id ? formatProductRow(result.product) : item)));
      toast({ variant: "success", title: "Product status updated", description: `"${row.title}" is now ${nextStatus.toLowerCase()}.` });
    } catch (err) {
      console.error(err);
      toast({ variant: "error", title: "Status update failed", description: "Could not update the product status." });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    try {
      await adminApi(`/api/products/${deleteTarget.id}`, { method: "DELETE" });
      setRows((current) => current.filter((row) => row.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast({ variant: "success", title: "Product deleted", description: "The product has been removed from the catalog." });
    } catch (err) {
      console.error(err);
      toast({ variant: "error", title: "Delete failed", description: "Could not delete the product. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const columns: DataTableColumn<ProductRow>[] = [
    { key: "featuredImage", header: "Featured Image", render: (row) => <Thumbnail src={row.featuredImage} label={row.title} /> },
    { key: "title", header: "Title", render: (row) => <span className="font-medium">{row.title}</span> },
    { key: "subtitle", header: "Subtitle", render: (row) => <span className="line-clamp-2 max-w-xs text-muted-foreground">{row.subtitle}</span> },
    { key: "description", header: "Description", render: (row) => <span className="line-clamp-2 max-w-sm text-muted-foreground">{row.description}</span> },
    { key: "category", header: "Category", render: (row) => row.category },
    { key: "brand", header: "Brand", render: (row) => row.brand },
    { key: "status", header: "Status", render: (row) => <StatusSelect value={row.status} options={["Active", "Inactive"]} onChange={(value) => void updateStatus(row, value)} /> },
    { key: "createdAt", header: "Created At", render: (row) => <span className="text-muted-foreground">{row.createdAt}</span> },
    { key: "actions", header: "Actions", render: (row) => <RowActions onEdit={() => openEdit(row)} onDelete={() => setDeleteTarget(row)} /> },
  ];

  return (
    <div>
      <WorkspaceHeader title="Product Catalog" description="Manage wire, cable, electrical product, brand, category, and visibility records." icon={Package} addLabel="Add Product" onAdd={openCreate} />
      <SectionCard title="Products" description="Keep retail and wholesale product listings ready for the public catalog.">
        <DataTable rows={rows} columns={columns} emptyTitle="No products found" emptyDescription="Add products for the public catalog." searchPlaceholder="Search products" getSearchText={(row) => `${row.title} ${row.subtitle} ${row.description} ${row.category} ${row.brand} ${row.status}`} />
      </SectionCard>

      <Dialog open={formOpen} title={editingId ? "Edit product" : "Add product"} description="Add the product details used in the public catalog." onClose={() => setFormOpen(false)}>
        <form className="space-y-4" onSubmit={saveEntry}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="product-image">Featured Image</Label>
              <ImageUpload
                value={draft.featuredImage}
                onChange={(url) => setDraft((current) => ({ ...current, featuredImage: url }))}
                label="Product Featured Image"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-title">Title</Label>
              <Input id="product-title" value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-subtitle">Subtitle</Label>
              <Input id="product-subtitle" value={draft.subtitle} onChange={(event) => setDraft((current) => ({ ...current, subtitle: event.target.value }))} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="product-description">Description</Label>
              <Textarea id="product-description" value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-category">Category</Label>
              <select
                id="product-category"
                className="h-10 w-full rounded-md border bg-card px-3 text-sm"
                value={draft.category}
                onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-brand">Brand</Label>
              <select
                id="product-brand"
                className="h-10 w-full rounded-md border bg-card px-3 text-sm"
                value={draft.brand}
                onChange={(event) => setDraft((current) => ({ ...current, brand: event.target.value }))}
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-status">Status</Label>
              <select id="product-status" className="h-10 w-full rounded-md border bg-card px-3 text-sm" value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as ProductStatus }))}>
                {(["Active", "Inactive"] as ProductStatus[]).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-date">Created At</Label>
              <Input id="product-date" value={draft.createdAt} onChange={(event) => setDraft((current) => ({ ...current, createdAt: event.target.value }))} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>{editingId ? "Save changes" : "Create product"}</Button>
          </div>
        </form>
      </Dialog>

      <ConfirmDialog open={Boolean(deleteTarget)} title="Delete product" description="This will remove the product from the public catalog." confirmText="Delete" cancelText="Cancel" destructive onConfirm={() => { void handleDelete(); }} onClose={() => setDeleteTarget(null)}>
        Delete this product permanently?
      </ConfirmDialog>
    </div>
  );
}
