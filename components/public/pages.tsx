"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Factory, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { BlogCard, BrandCard, ProductCard } from "@/components/public/cards";
import { CTABanner } from "@/components/public/cta-banner";
import { ContactForm, FAQAccordion, GoogleMapSection } from "@/components/public/interactive";
import { usePublicLocale } from "@/components/public/localized";
import { PublicShell } from "@/components/public/public-shell";
import { SectionHeading } from "@/components/public/section-heading";
import { Breadcrumb, Pagination, SearchBar } from "@/components/public/utility";
import { blogPosts, brands, categories, company, processSteps, products, whyChoose } from "@/lib/public-data";

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

export function ProductsPage() {
  const { text, locale } = usePublicLocale();

  return (
    <PublicShell>
      <PageHero
        eyebrow={{ en: "Products", ur: "مصنوعات" }}
        title={{ en: "Premium wires and cables for dependable installations.", ur: "قابل اعتماد انسٹالیشنز کے لیے پریمیم وائرز اور کیبلز۔" }}
        description={{ en: "Browse realistic placeholder products. API-powered filtering and inventory will connect later.", ur: "حقیقی جیسے پلیس ہولڈر مصنوعات دیکھیں۔ API فلٹرنگ اور انوینٹری بعد میں منسلک ہوگی۔" }}
      />
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <SearchBar />
            <select className="h-12 rounded-md border bg-card px-4 text-sm font-semibold outline-none">
              <option>{locale === "en" ? "All categories" : "تمام کیٹیگریز"}</option>
              {categories.map((category) => <option key={text(category.title)}>{text(category.title)}</option>)}
            </select>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {products.map((product) => <ProductCard key={product.slug} product={product} />)}
          </div>
          <Pagination />
        </div>
      </section>
      <CTABanner />
    </PublicShell>
  );
}

export function ProductDetailsPage({ slug }: { slug: string }) {
  const { text, locale } = usePublicLocale();
  const product = products.find((item) => item.slug === slug);

  if (!product) notFound();

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
                {product.specs.map((spec) => (
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
          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-2xl font-black">{locale === "en" ? "Key Features" : "اہم خصوصیات"}</h2>
              <div className="mt-5 grid gap-3">
                {product.features.map((feature) => (
                  <span key={text(feature)} className="flex gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
                    {text(feature)}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-2xl font-black">{locale === "en" ? "Applications" : "استعمالات"}</h2>
              <div className="mt-5 grid gap-3">
                {product.applications.map((application) => (
                  <span key={text(application)} className="flex gap-3 text-sm text-muted-foreground">
                    <Factory className="h-5 w-5 text-primary" aria-hidden="true" />
                    {text(application)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <CTABanner />
    </PublicShell>
  );
}

export function BrandsPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow={{ en: "Brands", ur: "برانڈز" }}
        title={{ en: "Purpose-built product families for every electrical workflow.", ur: "ہر الیکٹریکل ورک فلو کے لیے مقصدی پروڈکٹ فیملیز۔" }}
      />
      <section className="py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-3 lg:px-8">
          {brands.map((brand) => <BrandCard key={brand.name} brand={brand} />)}
        </div>
      </section>
      <CTABanner />
    </PublicShell>
  );
}

export function AboutPage() {
  const { text, locale } = usePublicLocale();

  return (
    <PublicShell>
      <PageHero
        eyebrow={{ en: "About Us", ur: "ہمارے بارے میں" }}
        title={{ en: "A manufacturing brand shaped around quality and reliability.", ur: "کوالٹی اور اعتماد کے گرد بنا مینوفیکچرنگ برانڈ۔" }}
        description={{ en: "This public website presents the company with the polish, proof, and structure expected from a premium industrial supplier.", ur: "یہ عوامی ویب سائٹ کمپنی کو پریمیم صنعتی سپلائر کے معیار، ثبوت اور ڈھانچے کے ساتھ پیش کرتی ہے۔" }}
      />
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="relative min-h-96 overflow-hidden rounded-lg border bg-muted">
            <Image src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1600&q=85" alt="Manufacturing team" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
          <div className="self-center">
            <h2 className="text-3xl font-black tracking-normal sm:text-4xl">{locale === "en" ? "Built for builders, dealers, engineers, and everyday users." : "بلڈرز، ڈیلرز، انجینئرز اور روزمرہ صارفین کے لیے تیار۔"}</h2>
            <p className="mt-5 text-base leading-8 text-muted-foreground">
              {locale === "en"
                ? "Gujranwala Electric Wires focuses on dependable conductors, clear specifications, responsive sales support, and a quality-led manufacturing culture."
                : "گوجرانوالہ الیکٹرک وائرز قابل اعتماد کنڈکٹرز، واضح اسپیسفکیشنز، فوری سیلز سپورٹ اور کوالٹی لیڈ مینوفیکچرنگ کلچر پر فوکس کرتی ہے۔"}
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
          <SectionHeading eyebrow={{ en: "Manufacturing Process", ur: "مینوفیکچرنگ عمل" }} title={{ en: "Disciplined production from conductor to pack.", ur: "کنڈکٹر سے پیک تک منظم پروڈکشن۔" }} align="center" />
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

export function BlogPage() {
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
            {blogPosts.map((post) => <BlogCard key={post.slug} post={post} />)}
          </div>
          <Pagination />
        </div>
      </section>
    </PublicShell>
  );
}

export function BlogDetailsPage({ slug }: { slug: string }) {
  const { text } = usePublicLocale();
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) notFound();

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
          {post.body.map((paragraph) => <p key={text(paragraph)}>{text(paragraph)}</p>)}
        </div>
      </article>
      <CTABanner />
    </PublicShell>
  );
}

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

export function ContactPage() {
  const { text, locale } = usePublicLocale();

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
              <span className="flex gap-3"><Phone className="h-5 w-5 text-primary" aria-hidden="true" />{company.phone}</span>
              <span className="flex gap-3"><Mail className="h-5 w-5 text-primary" aria-hidden="true" />{company.email}</span>
              <span className="flex gap-3"><MapPin className="h-5 w-5 text-primary" aria-hidden="true" />{text(company.address)}</span>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
      <GoogleMapSection />
    </PublicShell>
  );
}

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
              ? "This page contains placeholder legal content for the UI build. Final legal copy should be reviewed before launch."
              : "یہ صفحہ UI بلڈ کے لیے پلیس ہولڈر قانونی مواد رکھتا ہے۔ لانچ سے پہلے حتمی قانونی کاپی ریویو ہونی چاہیے۔"}
          </p>
          <p>
            {locale === "en"
              ? "Future API integration may store contact inquiries, product interests, and communication preferences according to approved business policies."
              : "مستقبل کی API انٹیگریشن منظور شدہ کاروباری پالیسیز کے مطابق رابطہ انکوائریز، پروڈکٹ دلچسپی اور کمیونیکیشن ترجیحات محفوظ کر سکتی ہے۔"}
          </p>
          <div className="rounded-lg border bg-card p-6">
            <ShieldCheck className="h-8 w-8 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-black text-foreground">{locale === "en" ? "Launch note" : "لانچ نوٹ"}</h2>
            <p className="mt-2 text-sm">{locale === "en" ? "Replace this section with approved company policy content before production launch." : "پروڈکشن لانچ سے پہلے اس حصے کو منظور شدہ کمپنی پالیسی مواد سے بدلیں۔"}</p>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
