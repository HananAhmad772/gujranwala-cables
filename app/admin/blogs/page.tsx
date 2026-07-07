"use client";

import { BookOpenText } from "lucide-react";
import { ModuleWorkspace } from "@/components/admin/module-workspace";

export default function BlogsPage() {
  return (
    <ModuleWorkspace
      title="Knowledge Center"
      description="Plan technical articles, safety guidance, cable education, and SEO content."
      icon={BookOpenText}
      imageTools
    />
  );
}
