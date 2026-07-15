"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Factory, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { BlogCard, BrandCard, ProductCard } from "@/components/public/cards";
import { CTABanner } from "@/components/public/cta-banner";
import { ContactForm, FAQAccordion, GoogleMapSection } from "@/components/public/interactive";
import { usePublicLocale } from "@/components/public/localized";
import { PublicShell } from "@/components/public/public-shell";
import { SectionHeading } from "@/components/public/section-heading";
import { Breadcrumb, Pagination, SearchBar } from "@/components/public/utility";
import {
  blogPosts as staticBlogPosts,
  brands as staticBrands,
  categories as staticCategories,
  company,
  processSteps,
  products as staticProducts,
  whyChoose,
} from "@/lib/public-data";
import type { ApiBlog, ApiBrand, ApiProduct } from "@/lib/public-api";

// ─── shape transforms ────────────────────────────────────────────────────────

function toProductCard(p: ApiProduct) {
  return {
    slug: p.slug,
    name: { en: p.name, ur: p.name },
    category: { en: p.category?.name ?? "", ur: p.category?.name ?? "" },
    summary: { en: p.description.slice(0, 120), ur: p.description.slice(0, 120) },
    description: { en: p.description, ur: p.description },
    image: p.featuredImage ?? "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1400&q=82",
    rating: 4.8,
    specs: Array.isArray(p.specs)
      ? p.specs.map((s) => ({ label: { en: s.label, ur: s.label }, value: { en: s.value, ur: s.value } }))
      : [],
    features: [] as { en: string; ur: string }[],
    applications: [] as { en: string; ur: string }[],
  };
}

function toBrandCard(b: ApiBrand) {
  return { name: b.name, description: { en: b.description ?? "", ur: b.description ?? "" } };
}

function toBlogCard(b: ApiBlog) {
  return {
    slug: b.slug,
    title: { en: b.title, ur: b.title },
    excerpt: { en: b.excerpt ?? "", ur: b.excerpt ?? "" },
    body: [] as { en: string; ur: string }[],
    image: b.featuredImage ?? "https://images.unsplash.com/photo-1581091014534-8987c1d64718?auto=format&fit=crop&w=1400&q=82",
    date: b.publishedAt ? b.publishedAt.slice(0, 10) : b.createdAt.slice(0, 10),
    readTime: { en: "5 min read", ur: "5 منٹ مطالعہ" },
    category: { en: "", ur: "" },
  };
}

// ─── shared helpers ───────────────────────────────────────────────────────────

function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: { en: string; ur: string };
  title: { en: string; ur: string };
  description?: { en: string; ur: string };
}) {
  return (
    <section className="border-b bg-muted/45 py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      </div>
    </section>
  );
}

// ─── Products page ────────────────────────────────────────────────────────────

export function ProductsPage() {
  const { text, locale } = usePublicLocale();
  const [liveProducts, setLiveProducts] = useState<ApiProduct[] | null>(null);
  const [liveCategories, setLiveCategories] = useState<{ id: string; name: string }[] | null>(null);

  useEffect(() => {
    fetch("/api/products?page=1&limit=50&isActive=true")
      .then((r) => r.ok ? r.json() : null)
      .then((j) => j?.success && setLiveProducts(j.data.products))
      .catch(() => null);

    fetch("/api/categories?page=1&limit=100&isActive=true")
      .then((r) => r.ok ? r.json() : null)
      .then((j) => j?.success && setLiveCategories(j.data.categories))
      .catch(() => null);
  }, []);

  const displayProducts = liveProducts && liveProducts.length > 0 ? liveProducts.map(toProductCard) : staticProducts;
  const catOptions = liveCategories && liveCategories.length > 0 ? liveCategories : staticCategories.map((c, i) => ({ id: String(i), name: c.title.en }));

  return (
    <PublicShell>
      <PageHero
        eyebrow={{ en: "Products", ur: "مصنوعات" }}
        title={{ en: "Premium wires and cables for dependable installations.", ur: "قابل اعتماد انسٹالیشنز کے لیے پریمیم وائرز اور کیبلز۔" }}
        description={{ en: "Browse our full product catalog.", ur: "ہماری مکمل پروڈکٹ کیٹلاگ دیکھیں۔" }}
      />
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <SearchBar />
            <select className="h-12 rounded-md border bg-card px-4 text-sm font-semibold outline-none">
              <option>{locale === "en" ? "All categories" : "تمام کیٹیگریز"}</option>
              {catOptions.map((cat) => (
                <option key={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {displayProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          <Pagination />
        </div>
      </section>
      <CTABanner />
    </PublicShell>
  );
}

// ─── Product details page ─────────────────────────────────────────────────────

export function ProductDetailsPage({ slug }: { slug: string }) {
  const { text, locale } = usePublicLocale();  const [liveProduct, setLiveProduct] = useState<ApiProduct | null | undefined>(undefined);

  useEffect(() => {
    fetch(`/api/products?slug=${slug}`)
      .then((r) => r.ok ? r.json() : null)
      .then((j) => {
        if (j?.success && Array.isArray(j.data?.products)) {
          const found = j.data.products.find((p: ApiProduct) => p.slug === slug);
          setLiveProduct(found ?? null);
        } else {
          setLiveProduct(null);
        }
      })
      .catch(() => setLiveProduct(null));
  }, [slug]);

  // Fall back to static data while loading or if not found in API
  const staticProduct = staticProducts.find((p) => p.slug === slug);

  // Still loading — show static fallback or skeleton
  if (liveProduct === undefined) {
    if (!staticProduct) {
      return (
        <PublicShell>
          <div className="py-32 text-center text-muted-foreground">Loading…</div>
        </PublicShell>
      );
    }
    const p = staticProduct;
    return (
      <PublicShell>
        <section className="py-10">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <Breadcrumb items={[{ label: "Products", href: "/products" }, { label: locale === "en" ? p.name.en : p.name.ur }]} />
          </div>
        </section>
        <CTABanner />
      </PublicShell>
    );
  }

  if (liveProduct === null && !staticProduct) notFound();

  // Use live data if available, otherwise static
  const product = liveProduct ? toProductCard(liveProduct) : staticProduct;
  if (!product) notFound();

  const specs = "specs" in product ? product.specs : [];
  const features = "features" in product ? product.features : [];
  const applications = "applications" in product ? product.applications : [];

  return (
    <PublicShell>
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Breadcrumb items={[{ label: "Products", href: "/products" }, { label: text(product.name) }]} />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_0.9fr]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted shadow-sm">
              <Image src={product.image} alt={text(product.name)} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">{text(product.category)}</p>
              <h1 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">{text(product.name)}</h1>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">{text(product.description)}</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {specs.map((spec) => (
                  <div key={text(spec.label)} className="rounded-lg border bg-card p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{text(spec.label)}</p>
                    <p className="mt-2 font-black">{text(spec.value)}</p>
                  </div>
                ))}
              </div>
              <Link href="/contact" className="mt-8 inline-flex h-12 items-center justify-center rounded-md bg-secondary px-5 text-sm font-black text-secondary-foreground">
                {locale === "en" ? "Request Quote" : "قیمت معلوم کریں"}
              </Link>
            </div>
          </div>
          {(features.length > 0 || applications.length > 0) && (
            <div className="mt-14 grid gap-8 lg:grid-cols-2">
              {features.length > 0 && (
                <div className="rounded-lg border bg-card p-6">
                  <h2 className="text-2xl font-black">{locale === "en" ? "Key Features" : "اہم خصوصیات"}</h2>
                  <div className="mt-5 grid gap-3">
                    {features.map((feature) => (
                      <span key={text(feature)} className="flex gap-3 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
                        {text(feature)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {applications.length > 0 && (
                <div className="rounded-lg border bg-card p-6">
                  <h2 className="text-2xl font-black">{locale === "en" ? "Applications" : "استعمالات"}</h2>
                  <div className="mt-5 grid gap-3">
                    {applications.map((application) => (
                      <span key={text(application)} className="flex gap-3 text-sm text-muted-foreground">
                        <Factory className="h-5 w-5 text-primary" aria-hidden="true" />
                        {text(application)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      <CTABanner />
    </PublicShell>
  );
}

// ─── Brands page ──────────────────────────────────────────────────────────────

export function BrandsPage() {
  const [liveBrands, setLiveBrands] = useState<ApiBrand[] | null>(null);

  useEffect(() => {
    fetch("/api/brands?page=1&limit=50&isActive=true")
      .then((r) => r.ok ? r.json() : null)
      .then((j) => j?.success && setLiveBrands(j.data.brands))
      .catch(() => null);
  }, []);

  const displayBrands = liveBrands && liveBrands.length > 0 ? liveBrands.map(toBrandCard) : staticBrands;

  return (
    <PublicShell>
      <PageHero
        eyebrow={{ en: "Brands", ur: "برانڈز" }}
        title={{ en: "Purpose-built product families for every electrical workflow.", ur: "ہر الیکٹریکل ورک فلو کے لیے مقصدی پروڈکٹ فیملیز۔" }}
      />
      <section className="py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-3 lg:px-8">
          {displayBrands.map((brand) => (
            <BrandCard key={brand.name} brand={brand} />
          ))}
        </div>
      </section>
      <CTABanner />
    </PublicShell>
  );
}

// ─── About page ───────────────────────────────────────────────────────────────

export function AboutPage() {
  const { text, locale } = usePublicLocale();

  return (
    <PublicShell>
      <PageHero
        eyebrow={{ en: "About Us", ur: "ہمارے بارے میں" }}
        title={{ en: "A manufacturing brand shaped around quality and reliability.", ur: "کوالٹی اور اعتماد کے گرد بنا مینوفیکچرنگ برانڈ۔" }}
        description={{ en: "Premium electrical supply from Gujranwala for contractors, dealers, and project buyers.", ur: "کنٹریکٹرز، ڈیلرز اور پراجیکٹ خریداروں کے لیے گوجرانوالہ سے پریمیم الیکٹریکل سپلائی۔" }}
      />
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="relative min-h-96 overflow-hidden rounded-lg border bg-muted">
            <Image
              src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1600&q=85"
              alt="Manufacturing team"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="self-center">
            <h2 className="text-3xl font-black tracking-normal sm:text-4xl">
              {locale === "en"
                ? "Built for builders, dealers, engineers, and everyday users."
                : "بلڈرز، ڈیلرز، انجینئرز اور روزمرہ صارفین کے لیے تیار۔"}
            </h2>
            <p className="mt-5 text-base leading-8 text-muted-foreground">
              {locale === "en"
                ? "Gujranwala Electric Cables focuses on dependable conductors, clear specifications, responsive sales support, and a quality-led supply chain based at New Bilal Ganj Market, Sheikhupura Road, Gujranwala."
                : "گوجرانوالہ الیکٹرک کیبلز قابل اعتماد کنڈکٹرز، واضح اسپیسفکیشنز، فوری سیلز سپورٹ اور نیو بلال گنج مارکیٹ، شیخوپورہ روڈ، گوجرانوالہ میں کوالٹی لیڈ سپلائی چین پر فوکس کرتی ہے۔"}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {whyChoose.map((item) => (
                <div key={text(item.title)} className="rounded-lg border bg-card p-5">
                  <item.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h3 className="mt-4 font-black">{text(item.title)}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-muted/45 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeading
            eyebrow={{ en: "Our Process", ur: "ہمارا عمل" }}
            title={{ en: "From product selection to delivery.", ur: "پروڈکٹ انتخاب سے ڈیلیوری تک۔" }}
            align="center"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {processSteps.map((step, index) => (
              <article key={text(step.title)} className="rounded-lg border bg-card p-6">
                <div className="text-4xl font-black text-secondary">{String(index + 1).padStart(2, "0")}</div>
                <h2 className="mt-5 text-xl font-black">{text(step.title)}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{text(step.text)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}

// ─── Blog list page ───────────────────────────────────────────────────────────

export function BlogPage() {
  const [liveBlogs, setLiveBlogs] = useState<ApiBlog[] | null>(null);

  useEffect(() => {
    fetch("/api/blogs?page=1&limit=20&status=PUBLISHED")
      .then((r) => r.ok ? r.json() : null)
      .then((j) => j?.success && setLiveBlogs(j.data.blogs))
      .catch(() => null);
  }, []);

  const displayBlogs = liveBlogs && liveBlogs.length > 0 ? liveBlogs.map(toBlogCard) : staticBlogPosts;

  return (
    <PublicShell>
      <PageHero
        eyebrow={{ en: "Blog", ur: "بلاگ" }}
        title={{ en: "Engineering notes for cable buyers and installers.", ur: "کیبل خریداروں اور انسٹالرز کے لیے انجینئرنگ نوٹس۔" }}
      />
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SearchBar placeholder="Search articles..." />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {displayBlogs.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
          <Pagination />
        </div>
      </section>
    </PublicShell>
  );
}

// ─── Blog detail page ─────────────────────────────────────────────────────────

export function BlogDetailsPage({ slug }: { slug: string }) {
  const { text } = usePublicLocale();
  const [liveBlog, setLiveBlog] = useState<ApiBlog | null | undefined>(undefined);

  useEffect(() => {
    fetch(`/api/blogs?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.ok ? r.json() : null)
      .then((j) => {
        if (j?.success && Array.isArray(j.data?.blogs)) {
          const found = j.data.blogs.find((b: ApiBlog) => b.slug === slug);
          setLiveBlog(found ?? null);
        } else {
          setLiveBlog(null);
        }
      })
      .catch(() => setLiveBlog(null));
  }, [slug]);

  const staticPost = staticBlogPosts.find((p) => p.slug === slug);

  // Still loading: show static fallback if available, else skeleton
  if (liveBlog === undefined) {
    if (staticPost) {
      return (
        <PublicShell>
          <article className="py-10">
            <div className="mx-auto max-w-4xl px-4 lg:px-8">
              <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: text(staticPost.title) }]} />
              <p className="mt-8 text-sm font-black uppercase tracking-[0.18em] text-secondary">{text(staticPost.category)}</p>
              <h1 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">{text(staticPost.title)}</h1>
              <div className="mt-4 flex gap-3 text-sm text-muted-foreground">
                <time dateTime={staticPost.date}>{new Date(staticPost.date).toLocaleDateString()}</time>
                <span>{text(staticPost.readTime)}</span>
              </div>
            </div>
            <div className="mx-auto mt-10 max-w-6xl px-4 lg:px-8">
              <div className="relative aspect-[16/7] overflow-hidden rounded-lg border bg-muted">
                <Image src={staticPost.image} alt={text(staticPost.title)} fill priority sizes="100vw" className="object-cover" />
              </div>
            </div>
            <div className="mx-auto mt-10 grid max-w-4xl gap-6 px-4 text-lg leading-9 text-muted-foreground lg:px-8">
              {staticPost.body.map((paragraph) => (
                <p key={text(paragraph)}>{text(paragraph)}</p>
              ))}
            </div>
          </article>
          <CTABanner />
        </PublicShell>
      );
    }
    // No static post either — show minimal loading shell
    return (
      <PublicShell>
        <div className="py-32 text-center text-muted-foreground">Loading…</div>
      </PublicShell>
    );
  }

  // Fetch done, not found in API or static
  if (liveBlog === null && !staticPost) notFound();

  if (liveBlog) {
    const post = toBlogCard(liveBlog);
    return (
      <PublicShell>
        <article className="py-10">
          <div className="mx-auto max-w-4xl px-4 lg:px-8">
            <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: post.title.en }]} />
            <h1 className="mt-8 text-4xl font-black tracking-normal sm:text-5xl">{post.title.en}</h1>
            <div className="mt-4 flex gap-3 text-sm text-muted-foreground">
              <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
              <span>{post.readTime.en}</span>
            </div>
          </div>
          <div className="mx-auto mt-10 max-w-6xl px-4 lg:px-8">
            <div className="relative aspect-[16/7] overflow-hidden rounded-lg border bg-muted">
              <Image src={post.image} alt={post.title.en} fill priority sizes="100vw" className="object-cover" />
            </div>
          </div>
          <div className="mx-auto mt-10 max-w-4xl px-4 lg:px-8">
            <p className="text-lg leading-9 text-muted-foreground">{liveBlog.content}</p>
          </div>
        </article>
        <CTABanner />
      </PublicShell>
    );
  }

  // liveBlog is null but static post exists — use static
  const post = staticPost!;
  return (
    <PublicShell>
      <article className="py-10">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: text(post.title) }]} />
          <p className="mt-8 text-sm font-black uppercase tracking-[0.18em] text-secondary">{text(post.category)}</p>
          <h1 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">{text(post.title)}</h1>
          <div className="mt-4 flex gap-3 text-sm text-muted-foreground">
            <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
            <span>{text(post.readTime)}</span>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-6xl px-4 lg:px-8">
          <div className="relative aspect-[16/7] overflow-hidden rounded-lg border bg-muted">
            <Image src={post.image} alt={text(post.title)} fill priority sizes="100vw" className="object-cover" />
          </div>
        </div>
        <div className="mx-auto mt-10 grid max-w-4xl gap-6 px-4 text-lg leading-9 text-muted-foreground lg:px-8">
          {post.body.map((paragraph) => (
            <p key={text(paragraph)}>{text(paragraph)}</p>
          ))}
        </div>
      </article>
      <CTABanner />
    </PublicShell>
  );
}

// ─── FAQs page ────────────────────────────────────────────────────────────────

export function FAQsPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow={{ en: "FAQs", ur: "عمومی سوالات" }}
        title={{ en: "Answers for product selection, inquiries, and support.", ur: "پروڈکٹ انتخاب، انکوائریز اور سپورٹ کے جوابات۔" }}
      />
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <FAQAccordion />
        </div>
      </section>
    </PublicShell>
  );
}

// ─── Contact page ─────────────────────────────────────────────────────────────

export function ContactPage() {
  const { locale } = usePublicLocale();

  return (
    <PublicShell>
      <PageHero
        eyebrow={{ en: "Contact Us", ur: "رابطہ کریں" }}
        title={{ en: "Talk to our team about wires, cables, and project supply.", ur: "وائرز، کیبلز اور پراجیکٹ سپلائی کے لیے ہماری ٹیم سے بات کریں۔" }}
      />
      <section className="py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-black">{locale === "en" ? "Contact information" : "رابطہ معلومات"}</h2>
            <div className="mt-6 grid gap-4 text-sm text-muted-foreground">
              <span className="flex gap-3">
                <Phone className="h-5 w-5 text-primary" aria-hidden="true" />
                {company.phone}
              </span>
              <span className="flex gap-3">
                <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
                {company.email}
              </span>
              <span className="flex gap-3">
                <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
                New Bilal Ganj Market, Sheikhupura Road, Gujranwala, Punjab, Pakistan
              </span>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
      <GoogleMapSection />
    </PublicShell>
  );
}

// ─── Policy page ──────────────────────────────────────────────────────────────

export function PolicyPage({ type }: { type: "privacy" | "terms" }) {
  const { locale } = usePublicLocale();
  const isPrivacy = type === "privacy";

  return (
    <PublicShell>
      <PageHero
        eyebrow={{ en: isPrivacy ? "Privacy Policy" : "Terms & Conditions", ur: isPrivacy ? "پرائیویسی پالیسی" : "شرائط و ضوابط" }}
        title={{
          en: isPrivacy ? "How customer information will be handled." : "Terms for using this website.",
          ur: isPrivacy ? "کسٹمر معلومات کیسے استعمال ہوں گی۔" : "اس ویب سائٹ کے استعمال کی شرائط۔",
        }}
      />
      <section className="py-14">
        <div className="mx-auto grid max-w-4xl gap-6 px-4 leading-8 text-muted-foreground lg:px-8">
          <p>
            {locale === "en"
              ? "This page contains placeholder legal content. Final legal copy should be reviewed before launch."
              : "یہ صفحہ پلیس ہولڈر قانونی مواد رکھتا ہے۔ لانچ سے پہلے حتمی قانونی کاپی ریویو ہونی چاہیے۔"}
          </p>
          <div className="rounded-lg border bg-card p-6">
            <ShieldCheck className="h-8 w-8 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-black text-foreground">
              {locale === "en" ? "Launch note" : "لانچ نوٹ"}
            </h2>
            <p className="mt-2 text-sm">
              {locale === "en"
                ? "Replace this section with approved company policy content before production launch."
                : "پروڈکشن لانچ سے پہلے اس حصے کو منظور شدہ کمپنی پالیسی مواد سے بدلیں۔"}
            </p>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
