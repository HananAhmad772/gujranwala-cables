import type { Metadata } from "next";
import { BrandsPage } from "@/components/public/pages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Brands | Gujranwala Electric Wires",
  description: "Discover GEW product families designed for building, industrial, and safety-focused applications.",
};

export default function Brands() {
  return <BrandsPage />;
}
