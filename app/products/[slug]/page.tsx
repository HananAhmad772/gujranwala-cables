import type { Metadata } from "next";
import { ProductDetailsPage } from "@/components/public/pages";
import { products } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  return {
    title: `${product?.name.en ?? "Product"} | Gujranwala Electric Wires`,
    description: product?.summary.en,
  };
}

export default async function ProductDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductDetailsPage slug={slug} />;
}
