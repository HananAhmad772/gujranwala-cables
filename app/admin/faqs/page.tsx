"use client";

import { FileQuestion } from "lucide-react";
import { ModuleWorkspace } from "@/components/admin/module-workspace";

export default function FaqsPage() {
  return (
    <ModuleWorkspace
      title="FAQ Library"
      description="Prepare customer-facing answers about wire sizes, applications, warranties, and ordering."
      icon={FileQuestion}
    />
  );
}
