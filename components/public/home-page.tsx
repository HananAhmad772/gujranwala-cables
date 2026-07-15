"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { BlogCard, BrandCard, ProductCard, ReviewCard } from "@/components/public/cards";
import { CTABanner } from "@/components/public/cta-banner";
import { HeroCarousel } from "@/components/public/hero-carousel";
import { FAQAccordion, GoogleMapSection, ReviewSubmissionForm } from "@/components/public/interactive";
import { usePublicLocale } from "@/components/public/localized";
import { FadeIn } from "@/components/public/motion";
import { PublicShell } from "@/components/public/public-shell";
import { SectionHeading } from "@/components/public/section-heading";
import { blogPosts as staticBlogPosts, brands as staticBrands, categories, certifications, processSteps, products as staticProducts, reviews as staticReviews, stats, whyChoose } from "@/lib/public-data";
import type { ApiBlog, ApiBrand, ApiProduct, ApiReview } from "@/lib/public-api";

// Transform API product → card shape
function toProductCard(p: ApiProduct) {
  return {
    slug: p.slug,
    name: { en: p.name, ur: p.name },
    category: { en: p.category?.name ?? "", ur: p.category?.name ?? "" },
    summary: { en: p.description.slice(0, 120), ur: p.description.slice(0, 120) },
    description: { en: p.description, ur: p.description },
    image: p.featuredImage ?? "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1400&q=82",
    rating: 4.8,
    specs: Array.isArray(p.specs) ? p.specs.map((s) => ({ label: { en: s.label, ur: s.label }, value: { en: s.value, ur: s.value } })) : [],
    features: [],
    applications: [],
  };
}

// Transform API brand → card shape
function toBrandCard(b: ApiBrand) {
  return {
    name: b.name,
    description: { en: b.description ?? "", ur: b.description ?? "" },
  };
}

// Transform API blog → card shape
function toBlogCard(b: ApiBlog) {
  return {
    slug: b.slug,
    title: { en: b.title, ur: b.title },
    excerpt: { en: b.excerpt ?? "", ur: b.excerpt ?? "" },
    body: [],
    image: b.featuredImage ?? "https://images.unsplash.com/photo-1581091014534-8987c1d64718?auto=format&fit=crop&w=1400&q=82",
    date: b.publishedAt ? b.publishedAt.slice(0, 10) : b.createdAt.slice(0, 10),
    readTime: { en: "5 min read", ur: "5 منٹ مطالعہ" },
    category: { en: "", ur: "" },
  };
}

// Transform API review → card shape
function toReviewCard(r: ApiReview) {
  return {
    name: { en: r.name, ur: r.name },
    role: { en: "Customer", ur: "کسٹمر" },
    quote: { en: r.comment, ur: r.comment },
  };
}

export function HomePage() {
  const { text, locale } = usePublicLocale();
  const [liveProducts, setLiveProducts] = useState<ApiProduct[] | null>(null);
  const [liveBrands, setLiveBrands] = useState<ApiBrand[] | null>(null);
  const [liveBlogs, setLiveBlogs] = useState<ApiBlog[] | null>(null);
  const [liveReviews, setLiveReviews] = useState<ApiReview[] | null>(null);

  useEffect(() => {
    fetch("/api/products?page=1&limit=6&isActive=true")
      .then((r) => r.ok ? r.json() : null)
      .then((j) => j?.success && setLiveProducts(j.data.products))
      .catch(() => null);

    fetch("/api/brands?page=1&limit=6&isActive=true")
      .then((r) => r.ok ? r.json() : null)
      .then((j) => j?.success && setLiveBrands(j.data.brands))
      .catch(() => null);

    fetch("/api/blogs?page=1&limit=3&status=PUBLISHED")
      .then((r) => r.ok ? r.json() : null)
      .then((j) => j?.success && setLiveBlogs(j.data.blogs))
      .catch(() => null);

    fetch("/api/reviews?page=1&limit=6&status=APPROVED")
      .then((r) => r.ok ? r.json() : null)
      .then((j) => j?.success && setLiveReviews(j.data.reviews))
      .catch(() => null);
  }, []);

  const displayProducts = liveProducts && liveProducts.length > 0 ? liveProducts.map(toProductCard) : staticProducts;
  const displayBrands = liveBrands && liveBrands.length > 0 ? liveBrands.map(toBrandCard) : staticBrands;
  const displayBlogs = liveBlogs && liveBlogs.length > 0 ? liveBlogs.map(toBlogCard) : staticBlogPosts;
  const displayReviews = liveReviews && liveReviews.length > 0 ? liveReviews.map(toReviewCard) : staticReviews;

  return (
    <PublicShell>
      <HeroCarousel />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            eyebrow={{ en: "Featured Products", ur: "نمایاں مصنوعات" }}
            title={{ en: "Cable ranges built for real electrical work.", ur: "حقیقی الیکٹریکل کام کے لیے تیار کیبل رینجز۔" }}
            description={{ en: "A focused catalog for contractors, dealers, builders, and industrial buyers.", ur: "کنٹریکٹرز، ڈیلرز، بلڈرز اور صنعتی خریداروں کے لیے فوکسڈ کیٹلاگ۔" }}
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {displayProducts.map((product, index) => (
              <FadeIn key={product.slug} delay={index * 0.08}>
                <ProductCard product={product} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/45 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            eyebrow={{ en: "Categories", ur: "کیٹیگریز" }}
            title={{ en: "Organized for faster product selection.", ur: "تیز پروڈکٹ انتخاب کے لیے منظم۔" }}
            align="center"
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <article key={text(category.title)} className="rounded-lg border bg-card p-6 shadow-sm">
                <category.icon className="h-8 w-8 text-secondary" aria-hidden="true" />
                <h2 className="mt-5 text-lg font-black">{text(category.title)}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{text(category.description)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <SectionHeading
              eyebrow={{ en: "Why Choose GEW", ur: "GEW کیوں منتخب کریں" }}
              title={{ en: "Trust comes from process, proof, and people.", ur: "اعتماد عمل، ثبوت اور لوگوں سے بنتا ہے۔" }}
              description={{ en: "The public website is designed to surface quality signals clearly before API-managed certificates and project stories are connected.", ur: "یہ ویب سائٹ API سرٹیفکیٹس اور پراجیکٹ اسٹوریز سے پہلے کوالٹی سگنلز واضح دکھانے کے لیے بنائی گئی ہے۔" }}
            />
            <div className="mt-8 grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.value} className="rounded-lg border bg-card p-5">
                  <div className="text-3xl font-black text-primary">{stat.value}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{text(stat.label)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {whyChoose.map((item) => (
              <article key={text(item.title)} className="rounded-lg border bg-card p-6 shadow-sm">
                <item.icon className="h-8 w-8 text-primary" aria-hidden="true" />
                <h2 className="mt-5 text-lg font-black">{text(item.title)}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{text(item.text)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#07111f] py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="relative min-h-96 overflow-hidden rounded-lg">
            <Image src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1600&q=85" alt="Industrial manufacturing floor" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="self-center">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">{locale === "en" ? "Company Introduction" : "کمپنی تعارف"}</p>
            <h2 className="mt-3 text-3xl font-black tracking-normal sm:text-5xl">{locale === "en" ? "A trusted electrical supply partner for premium wires and cables." : "پریمیم وائرز اور کیبلز کے لیے قابل اعتماد الیکٹریکل سپلائی پارٹنر۔"}</h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              {locale === "en"
                ? "We supply premium electrical wires, cables, and accessories from authorized brands for retail counters, contractors, and project buyers seeking dependable stock and practical support."
                : "ہم ریٹیل کاؤنٹرز، کنٹریکٹرز اور پراجیکٹ خریداروں کے لیے قابل اعتماد اسٹاک اور عملی سپورٹ کے ساتھ مجاز برانڈز سے پریمیم الیکٹریکل وائرز، کیبلز اور اسیسریز فراہم کرتے ہیں۔"}
            </p>
            <div className="mt-6 grid gap-3">
              {certifications.map((item) => (
                <span key={text(item.label)} className="flex items-center gap-3 text-sm font-semibold text-slate-200">
                  <item.icon className="h-5 w-5 text-secondary" aria-hidden="true" />
                  {text(item.label)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            eyebrow={{ en: "Quality Process", ur: "کوالٹی عمل" }}
            title={{ en: "From raw conductor to tested cable.", ur: "خام کنڈکٹر سے ٹیسٹڈ کیبل تک۔" }}
            align="center"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {processSteps.map((step, index) => (
              <article key={text(step.title)} className="relative rounded-lg border bg-card p-6 shadow-sm">
                <div className="grid h-11 w-11 place-items-center rounded-md bg-secondary text-lg font-black text-secondary-foreground">{index + 1}</div>
                <h2 className="mt-6 text-xl font-black">{text(step.title)}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{text(step.text)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/45 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading eyebrow={{ en: "Our Brands", ur: "ہمارے برانڈز" }} title={{ en: "Product families with clear purpose.", ur: "واضح مقصد والی پروڈکٹ فیملیز۔" }} />
            <Link href="/brands" className="inline-flex items-center gap-2 text-sm font-black text-primary">
              {locale === "en" ? "View all brands" : "تمام برانڈز دیکھیں"}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {displayBrands.map((brand) => <BrandCard key={brand.name} brand={brand} />)}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading eyebrow={{ en: "Knowledge Center", ur: "نالج سینٹر" }} title={{ en: "Practical guidance for better electrical decisions.", ur: "بہتر الیکٹریکل فیصلوں کے لیے عملی رہنمائی۔" }} />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {displayBlogs.map((post) => <BlogCard key={post.slug} post={post} />)}
          </div>
        </div>
      </section>

      <section className="bg-muted/45 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading eyebrow={{ en: "Customer Reviews", ur: "کسٹمر ریویوز" }} title={{ en: "Trusted by teams who install under pressure.", ur: "دباؤ میں انسٹال کرنے والی ٹیموں کا اعتماد۔" }} align="center" />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {displayReviews.map((review, i) => <ReviewCard key={i} review={review} />)}
          </div>
          <div className="mt-10 rounded-lg border bg-card p-6 shadow-sm">
            <SectionHeading eyebrow={{ en: "Leave a review", ur: "رائے دیں" }} title={{ en: "Share your experience with our supply team.", ur: "ہمارے سپلائی ٹیم کے ساتھ اپنا تجربہ بانٹیں۔" }} align="center" />
            <div className="mt-6">
              <ReviewSubmissionForm />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <SectionHeading eyebrow={{ en: "FAQs", ur: "عمومی سوالات" }} title={{ en: "Clear answers before you call.", ur: "کال سے پہلے واضح جوابات۔" }} />
            <ul className="mt-6 grid gap-3 text-sm text-muted-foreground">
              <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" /> {locale === "en" ? "Premium electrical wire and cable supply with authorized brands" : "مجاز برانڈز کے ساتھ پریمیم الیکٹریکل وائر اور کیبل سپلائی"}</li>
              <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" /> {locale === "en" ? "Wholesale and retail support for contractors, dealers, and project buyers" : "کنٹریکٹرز، ڈیلرز اور پراجیکٹ خریداروں کے لیے ہول سیل اور ریٹیل سپورٹ"}</li>
            </ul>
          </div>
          <FAQAccordion limit={3} />
        </div>
      </section>

      <CTABanner />
      <GoogleMapSection />
    </PublicShell>
  );
}
