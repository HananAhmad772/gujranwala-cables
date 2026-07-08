import type { Metadata } from "next";
import { PolicyPage } from "@/components/public/pages";

export const metadata: Metadata = {
  title: "Privacy Policy | Gujranwala Electric Wires",
};

export default function PrivacyPolicy() {
  return <PolicyPage type="privacy" />;
}
