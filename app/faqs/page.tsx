import type { Metadata } from "next";
import { FAQsPage } from "@/components/public/pages";

export const metadata: Metadata = {
  title: "FAQs | Gujranwala Electric Wires",
  description: "Answers to common product, project, and support questions.",
};

export default function FAQs() {
  return <FAQsPage />;
}
