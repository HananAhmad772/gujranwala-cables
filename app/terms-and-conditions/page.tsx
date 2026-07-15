import type { Metadata } from "next";
import { PolicyPage } from "@/components/public/pages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Terms & Conditions | Gujranwala Electric Wires",
};

export default function TermsAndConditions() {
  return <PolicyPage type="terms" />;
}
