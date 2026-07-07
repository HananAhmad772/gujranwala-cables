"use client";

import { MessageSquareText } from "lucide-react";
import { ModuleWorkspace } from "@/components/admin/module-workspace";

export default function ContactMessagesPage() {
  return (
    <ModuleWorkspace
      title="Contact Inbox"
      description="Track customer inquiries, quotation requests, dealer messages, and closed conversations."
      icon={MessageSquareText}
      rows={[
        { name: "Bilal Engineering", type: "Quotation request", status: "NEW", updated: "4m ago" },
        { name: "Gujrat Builders", type: "Project inquiry", status: "CONTACTED", updated: "3h ago" },
        { name: "Metro Supply", type: "Dealer partnership", status: "CLOSED", updated: "Yesterday" },
      ]}
    />
  );
}
