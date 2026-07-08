import type { Metadata } from "next";
import { BlogDetailsPage } from "@/components/public/pages";
import { blogPosts } from "@/lib/public-data";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  return {
    title: `${post?.title.en ?? "Blog"} | Gujranwala Electric Wires`,
    description: post?.excerpt.en,
  };
}

export default async function BlogDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BlogDetailsPage slug={slug} />;
}
