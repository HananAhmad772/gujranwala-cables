"use client";

import { FolderTree } from "lucide-react";
import { ModuleWorkspace } from "@/components/admin/module-workspace";

export default function CategoriesPage() {
  return (
    <ModuleWorkspace
      title="Category Matrix"
      description="Organize product families by application, cable type, and catalog browsing needs."
      icon={FolderTree}
    />
  );
}
