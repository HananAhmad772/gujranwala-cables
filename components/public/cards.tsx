"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import type { PublicBlogPost, PublicProduct } from "@/lib/public-data";
import { brands } from "@/lib/public-data";
import { cn } from "@/lib/utils";
import { usePublicLocale } from "@/components/public/localized";

export function ProductCard({ product, featured = false }: { product: PublicProduct; featured?: boolean }) {
  const { text, locale } = usePublicLocale();

  return (
    <article className={cn("group overflow-hidden rounded-lg border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl", featured && "lg:grid lg:grid-cols-[0.95fr_1.05fr]")}>
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-muted">
        <Image src={product.image} alt={text(product.name)} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-md bg-background/90 px-3 py-1 text-xs font-bold text-foreground backdrop-blur">{text(product.category)}</span>
      </Link>
      <div className="flex flex-col p-5">
        <div className="flex items-center gap-1 text-secondary">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} className={cn("h-4 w-4", index < Math.round(product.rating) && "fill-current")} aria-hidden="true" />
          ))}
          <span className="ms-2 text-xs font-bold text-muted-foreground">{product.rating}</span>
        </div>
        <h2 className="mt-4 text-xl font-black tracking-normal">{text(product.name)}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted-foreground">{text(product.summary)}</p>
        <div className="mt-5 grid gap-2 text-sm">
          {product.specs.slice(0, 2).map((spec) => (
            <div key={text(spec.label)} className="flex items-center justify-between gap-3 border-t pt-2">
              <span className="text-muted-foreground">{text(spec.label)}</span>
              <span className="font-bold">{text(spec.value)}</span>
            </div>
          ))}
        </div>
        <Link href={`/products/${product.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-black text-primary">
          {locale === "en" ? "View details" : "تفصیل دیکھیں"}
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export function BrandCard({ brand = brands[0] }: { brand?: (typeof brands)[number] }) {
  const { text } = usePublicLocale();

  return (
    <article className="rounded-lg border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex h-14 w-14 items-center justify-center rounded-md bg-primary text-lg font-black text-primary-foreground">
        {brand.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
      </div>
      <h2 className="mt-6 text-xl font-black tracking-normal">{brand.name}</h2>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{text(brand.description)}</p>
    </article>
  );
}

export function BlogCard({ post }: { post: PublicBlogPost }) {
  const { text } = usePublicLocale();

  return (
    <article className="group overflow-hidden rounded-lg border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-muted">
        <Image src={post.image} alt={text(post.title)} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-md bg-background/90 px-3 py-1 text-xs font-bold backdrop-blur">{text(post.category)}</span>
      </Link>
      <div className="p-5">
        <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground">
          <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
          <span>{text(post.readTime)}</span>
        </div>
        <h2 className="mt-3 text-xl font-black tracking-normal">{text(post.title)}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted-foreground">{text(post.excerpt)}</p>
      </div>
    </article>
  );
}

export function ReviewCard({ review }: { review: { name: { en: string; ur: string }; role: { en: string; ur: string }; quote: { en: string; ur: string } } }) {
  const { text } = usePublicLocale();

  return (
    <article className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex gap-1 text-secondary">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className="h-4 w-4 fill-current" aria-hidden="true" />
        ))}
      </div>
      <p className="mt-5 text-sm leading-7 text-muted-foreground">&ldquo;{text(review.quote)}&rdquo;</p>
      <div className="mt-6 border-t pt-4">
        <h3 className="font-black">{text(review.name)}</h3>
        <p className="text-sm text-muted-foreground">{text(review.role)}</p>
      </div>
    </article>
  );
}
