"use client";

import { Package } from "lucide-react";
import { ModuleWorkspace } from "@/components/admin/module-workspace";

export default function ProductsPage() {
  return (
    <ModuleWorkspace
      title="Product Catalog"
      description="Manage cable products, technical specifications, stock status, images, brands, and categories."
      icon={Package}
      imageTools
    />
  );
}
