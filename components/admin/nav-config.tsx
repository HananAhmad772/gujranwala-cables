import {
  BarChart3,
  BookOpenText,
  Building2,
  Cable,
  Contact,
  FileQuestion,
  FolderTree,
  LogOut,
  MessageSquareText,
  Package,
  Settings,
  ShieldUser,
  Star,
} from "lucide-react";

export const adminNavItems = [
  { href: "/admin", labelKey: "dashboard", icon: BarChart3 },
  { href: "/admin/products", labelKey: "products", icon: Package },
  { href: "/admin/brands", labelKey: "brands", icon: Building2 },
  { href: "/admin/categories", labelKey: "categories", icon: FolderTree },
  { href: "/admin/blogs", labelKey: "blogs", icon: BookOpenText },
  { href: "/admin/reviews", labelKey: "reviews", icon: Star },
  { href: "/admin/faqs", labelKey: "faqs", icon: FileQuestion },
  { href: "/admin/contact-messages", labelKey: "contactMessages", icon: MessageSquareText },
  { href: "/admin/site-settings", labelKey: "siteSettings", icon: Settings },
  { href: "/admin/profile", labelKey: "profile", icon: ShieldUser },
] as const;

export const adminUtilityItems = [{ href: "/admin/login", labelKey: "logout", icon: LogOut }] as const;

export const manufacturingShortcuts = [
  { label: "Cable catalog", icon: Cable },
  { label: "Customer inbox", icon: Contact },
] as const;
