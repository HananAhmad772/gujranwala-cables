import type { Metadata } from "next";
import { HomePage } from "@/components/public/home-page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gujranwala Electric Wires | Premium Electrical Wires & Cables",
  description: "Modern manufacturing website for Gujranwala Electric Wires, showcasing electrical wires, cables, brands, quality process, and project support.",
};

export default function Home() {
  return <HomePage />;
}
