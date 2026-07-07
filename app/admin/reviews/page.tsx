"use client";

import { Star } from "lucide-react";
import { ModuleWorkspace } from "@/components/admin/module-workspace";

export default function ReviewsPage() {
  return (
    <ModuleWorkspace
      title="Review Moderation"
      description="Review customer feedback, approve strong testimonials, and reject unsuitable submissions."
      icon={Star}
      rows={[
        { name: "Ayesha Traders", type: "Customer review", status: "PENDING", updated: "12m ago" },
        { name: "M. Usman", type: "Customer review", status: "APPROVED", updated: "Today" },
        { name: "Sialkot Electric", type: "Customer review", status: "REJECTED", updated: "Yesterday" },
      ]}
    />
  );
}
