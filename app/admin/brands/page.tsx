"use client";

import { Building2 } from "lucide-react";
import { ModuleWorkspace } from "@/components/admin/module-workspace";

export default function BrandsPage() {
  return (
    <ModuleWorkspace
      title="Brand Library"
      description="Prepare brand records, logo assets, descriptions, and product relationships."
      icon={Building2}
      imageTools
    />
  );
}
