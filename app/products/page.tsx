import type { Metadata } from "next";
import { ProductsPage } from "@/components/public/pages";

export const metadata: Metadata = {
  title: "Products | Gujranwala Electric Wires",
  description: "Explore premium building wires, power cables, and safety-led cable ranges.",
};

export default function Products() {
  return <ProductsPage />;
}
