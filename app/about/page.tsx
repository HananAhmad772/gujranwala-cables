import type { Metadata } from "next";
import { AboutPage } from "@/components/public/pages";

export const metadata: Metadata = {
  title: "About Us | Gujranwala Electric Wires",
  description: "Learn about Gujranwala Electric Wires, our manufacturing process, values, and quality discipline.",
};

export default function About() {
  return <AboutPage />;
}
