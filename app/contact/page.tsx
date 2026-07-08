import type { Metadata } from "next";
import { ContactPage } from "@/components/public/pages";

export const metadata: Metadata = {
  title: "Contact Us | Gujranwala Electric Wires",
  description: "Contact Gujranwala Electric Wires for product inquiries, quotations, and project support.",
};

export default function Contact() {
  return <ContactPage />;
}
