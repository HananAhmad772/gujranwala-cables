import type { Metadata } from "next";
import { BlogPage } from "@/components/public/pages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | Gujranwala Electric Wires",
  description: "Read practical cable selection, quality, and manufacturing guidance.",
};

export default function Blog() {
  return <BlogPage />;
}
