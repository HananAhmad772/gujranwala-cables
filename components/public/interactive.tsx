"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { company, faqs } from "@/lib/public-data";
import { loadReviews, saveReviews } from "@/lib/review-store";
import { cn } from "@/lib/utils";
import { usePublicLocale } from "@/components/public/localized";

export function FAQAccordion({ limit }: { limit?: number }) {
  const { text } = usePublicLocale();
  const [open, setOpen] = useState(0);
  const items = limit ? faqs.slice(0, limit) : faqs;

  return (
    <div className="grid gap-3">
      {items.map((item, index) => (
        <div key={text(item.question)} className="overflow-hidden rounded-lg border bg-card shadow-sm">
          <button className="flex w-full items-center justify-between gap-4 p-5 text-start font-black" onClick={() => setOpen(open === index ? -1 : index)}>
            {text(item.question)}
            <ChevronDown className={cn("h-5 w-5 shrink-0 transition", open === index && "rotate-180")} aria-hidden="true" />
          </button>
          {open === index ? <p className="border-t px-5 pb-5 pt-4 text-sm leading-7 text-muted-foreground">{text(item.answer)}</p> : null}
        </div>
      ))}
    </div>
  );
}

export function ContactForm() {
  const { locale } = usePublicLocale();
  const [status, setStatus] = useState<string | null>(null);
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", description: "" });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.fullName.trim() || !form.phone.trim() || !form.email.trim() || !form.description.trim()) {
      setStatus(locale === "en" ? "Please complete all fields." : "براہ کرم تمام فیلڈز مکمل کریں۔");
      return;
    }

    const entry = {
      id: `contact-${Date.now()}`,
      fullName: form.fullName,
      phone: form.phone,
      email: form.email,
      description: form.description,
      status: "New" as const,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    const existing = loadReviews();
    saveReviews(existing);

    setStatus(locale === "en" ? "Thanks! Your quotation request has been received and will be reviewed shortly." : "شکریہ! آپ کی کوٹیشن درخواست موصول ہو گئی ہے اور جلد ہی جائزہ لیا جائے گا۔");
    setForm({ fullName: "", phone: "", email: "", description: "" });
    window.localStorage.setItem("gujranwala-cables-contact-inquiry", JSON.stringify(entry));
  };

  return (
    <form className="rounded-lg border bg-card p-5 shadow-sm sm:p-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input placeholder={locale === "en" ? "Full name" : "مکمل نام"} aria-label="Full name" value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} />
        <Input placeholder={locale === "en" ? "Phone number" : "فون نمبر"} aria-label="Phone number" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
        <Input className="sm:col-span-2" type="email" placeholder={locale === "en" ? "Email address" : "ای میل ایڈریس"} aria-label="Email address" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
        <Textarea className="min-h-36 sm:col-span-2" placeholder={locale === "en" ? "Tell us about quantity, cable type, and delivery timeline." : "مقدار، کیبل قسم اور ڈیلیوری ٹائم لائن بتائیں۔"} aria-label="Message" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
      </div>
      <Button type="submit" className="mt-5 w-full sm:w-auto">
        <Send className="h-4 w-4" aria-hidden="true" />
        {locale === "en" ? "Send Inquiry" : "انکوائری بھیجیں"}
      </Button>
      {status ? <p className="mt-3 text-sm text-primary">{status}</p> : null}
      <p className="mt-3 text-xs text-muted-foreground">{locale === "en" ? "Your request is logged for our sales team to follow up with product availability and quotations." : "آپ کی درخواست ہماری سیلز ٹیم کے لیے لاگ ہو گئی ہے تاکہ وہ مصنوعات کی دستیابی اور کوٹیشن کے لیے جواب دے۔"}</p>
    </form>
  );
}

export function ReviewSubmissionForm() {
  const { locale } = usePublicLocale();
  const [status, setStatus] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", rating: 5, review: "" });

  useEffect(() => {
    const reviews = loadReviews();
    saveReviews(reviews);
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.review.trim()) {
      setStatus(locale === "en" ? "Please add your name and feedback." : "براہ کرم اپنا نام اور رائے درج کریں۔");
      return;
    }

    const reviews = loadReviews();
    const next = [{ id: `rev-${Date.now()}`, name: form.name, rating: form.rating, review: form.review, status: "Pending" as const, createdAt: new Date().toISOString().slice(0, 10) }, ...reviews];
    saveReviews(next);
    setStatus(locale === "en" ? "Thanks! Your review is pending approval and will appear after moderation." : "شکریہ! آپ کی رائے منظوری کے انتظار میں ہے اور بعد میں ظاہر ہوگی۔");
    setForm({ name: "", rating: 5, review: "" });
  };

  return (
    <form className="rounded-lg border bg-card p-5 shadow-sm" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input placeholder={locale === "en" ? "Your name" : "آپ کا نام"} aria-label="Your name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
        <select className="h-10 rounded-md border bg-card px-3 text-sm" value={form.rating} onChange={(event) => setForm((current) => ({ ...current, rating: Number(event.target.value) }))}>
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>
              {value}/5
            </option>
          ))}
        </select>
        <Textarea className="min-h-28 sm:col-span-2" placeholder={locale === "en" ? "Share your experience with our products and service." : "ہمارے پروڈکٹس اور سروس کے بارے میں اپنی تجربہ بانٹیں۔"} aria-label="Review" value={form.review} onChange={(event) => setForm((current) => ({ ...current, review: event.target.value }))} />
      </div>
      <Button type="submit" className="mt-5 w-full sm:w-auto">
        <Send className="h-4 w-4" aria-hidden="true" />
        {locale === "en" ? "Submit Review" : "رائے جمع کروائیں"}
      </Button>
      {status ? <p className="mt-3 text-sm text-primary">{status}</p> : null}
    </form>
  );
}

export function GoogleMapSection() {
  const { text, locale } = usePublicLocale();

  return (
    <section className="bg-muted/45 py-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">{locale === "en" ? "Visit Us" : "ہم سے ملیں"}</p>
          <h2 className="mt-3 text-3xl font-black tracking-normal">{locale === "en" ? "Manufacturing and sales support in Gujranwala." : "گوجرانوالہ میں مینوفیکچرنگ اور سیلز سپورٹ۔"}</h2>
          <div className="mt-6 grid gap-4 text-sm text-muted-foreground">
            <span className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />{text(company.address)}</span>
            <span className="flex items-start gap-3"><Phone className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />{company.phone}</span>
            <span className="flex items-start gap-3"><Mail className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />{company.email}</span>
          </div>
        </div>
        <div className="min-h-80 overflow-hidden rounded-lg border bg-card shadow-sm">
          <iframe
            title="Gujranwala Electric Wires location"
            src="https://www.google.com/maps?q=Gujranwala%20Pakistan&output=embed"
            className="h-full min-h-80 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
