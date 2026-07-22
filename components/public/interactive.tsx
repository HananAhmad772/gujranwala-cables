"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { company } from "@/lib/public-data";
import type { ApiFaq } from "@/lib/public-api";
import { cn } from "@/lib/utils";
import { usePublicLocale } from "@/components/public/localized";
import { useSiteSettings } from "@/components/providers/site-settings-provider";
import { WhatsAppButton } from "@/components/public/whatsapp-button";

// TikTok SVG icon (lucide-react doesn't include it)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.16 8.16 0 0 0 4.77 1.52V6.73a4.85 4.85 0 0 1-1-.04Z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const HARDCODED_SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/profile.php?id=61591522142534&mibextid=wwXIfr&mibextid=wwXIfr",
  instagram: "https://www.instagram.com/gujranwalaelectric?igsh=NWd2NTJrMHV1eGRq&utm_source=qr",
  tiktok: "https://www.tiktok.com/@gujranwala.electri?_r=1&_t=ZS-97ppTG8DAvp",
  youtube: "https://youtube.com/@gecgujranwalaelectriccables?si=_pUb3pXCbn2l63V1",
};

// TODO: tiktokUrl not in SiteSettings schema yet; keep hardcoded fallback until schema is updated.

function getSocialLinks(settings: { facebookUrl?: string | null; instagramUrl?: string | null; youtubeUrl?: string | null } | null) {
  return {
    facebook: settings?.facebookUrl ?? HARDCODED_SOCIAL_LINKS.facebook,
    instagram: settings?.instagramUrl ?? HARDCODED_SOCIAL_LINKS.instagram,
    youtube: settings?.youtubeUrl ?? HARDCODED_SOCIAL_LINKS.youtube,
    tiktok: HARDCODED_SOCIAL_LINKS.tiktok,
  };
}

export function FAQAccordion({ limit }: { limit?: number }) {
  const [open, setOpen] = useState(0);
  const [faqs, setFaqs] = useState<ApiFaq[]>([]);

  useEffect(() => {
    fetch("/api/faqs?page=1&limit=20")
      .then((r) => r.ok ? r.json() : null)
      .then((j) => {
        if (j?.success && Array.isArray(j.data?.faqs)) {
          setFaqs(j.data.faqs);
        }
      })
      .catch(() => null);
  }, []);

  const items = limit ? faqs.slice(0, limit) : faqs;

  if (items.length === 0) return null;

  return (
    <div className="grid gap-3">
      {items.map((item, index) => (
        <div key={item.id} className="overflow-hidden rounded-lg border bg-card shadow-sm">
          <button className="flex w-full items-center justify-between gap-4 p-5 text-start font-black" onClick={() => setOpen(open === index ? -1 : index)}>
            {item.question}
            <ChevronDown className={cn("h-5 w-5 shrink-0 transition", open === index && "rotate-180")} aria-hidden="true" />
          </button>
          {open === index ? <p className="border-t px-5 pb-5 pt-4 text-sm leading-7 text-muted-foreground">{item.answer}</p> : null}
        </div>
      ))}
    </div>
  );
}

export function ContactForm() {
  const { locale } = usePublicLocale();
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", description: "" });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.fullName.trim() || !form.phone.trim() || !form.email.trim() || !form.description.trim()) {
      setStatus(locale === "en" ? "Please complete all fields." : "براہ کرم تمام فیلڈز مکمل کریں۔");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.fullName,
          phone: form.phone,
          email: form.email,
          message: form.description,
        }),
      });

      if (res.ok) {
        setStatus(locale === "en" ? "Thanks! Your quotation request has been received and will be reviewed shortly." : "شکریہ! آپ کی کوٹیشن درخواست موصول ہو گئی ہے اور جلد ہی جائزہ لیا جائے گا۔");
        setForm({ fullName: "", phone: "", email: "", description: "" });
      } else {
        const j = await res.json().catch(() => ({}));
        setStatus(j.message || (locale === "en" ? "Failed to submit. Please try again." : "جمع کرنے میں ناکامی۔ دوبارہ کوشش کریں۔"));
      }
    } catch {
      setStatus(locale === "en" ? "Network error. Please try again." : "نیٹ ورک خرابی۔ دوبارہ کوشش کریں۔");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="rounded-lg border bg-card p-5 shadow-sm sm:p-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input placeholder={locale === "en" ? "Full name" : "مکمل نام"} aria-label="Full name" value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} />
        <Input placeholder={locale === "en" ? "Phone number" : "فون نمبر"} aria-label="Phone number" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
        <Input className="sm:col-span-2" type="email" placeholder={locale === "en" ? "Email address" : "ای میل ایڈریس"} aria-label="Email address" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
        <Textarea className="min-h-36 sm:col-span-2" placeholder={locale === "en" ? "Tell us about quantity, cable type, and delivery timeline." : "مقدار، کیبل قسم اور ڈیلیوری ٹائم لائن بتائیں۔"} aria-label="Message" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
      </div>
      <Button type="submit" className="mt-5 w-full sm:w-auto" disabled={loading}>
        <Send className="h-4 w-4" aria-hidden="true" />
        {loading ? (locale === "en" ? "Sending…" : "بھیجا جا رہا ہے…") : (locale === "en" ? "Send Inquiry" : "انکوائری بھیجیں")}
      </Button>
      {status ? <p className="mt-3 text-sm text-primary">{status}</p> : null}
      <p className="mt-3 text-xs text-muted-foreground">{locale === "en" ? "Your request is logged for our sales team to follow up with product availability and quotations." : "آپ کی درخواست ہماری سیلز ٹیم کے لیے لاگ ہو گئی ہے تاکہ وہ مصنوعات کی دستیابی اور کوٹیشن کے لیے جواب دے۔"}</p>
    </form>
  );
}

export function ReviewSubmissionForm() {
  const { locale } = usePublicLocale();
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", rating: 5, review: "" });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.review.trim()) {
      setStatus(locale === "en" ? "Please add your name and feedback." : "براہ کرم اپنا نام اور رائے درج کریں۔");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          rating: form.rating,
          comment: form.review,
        }),
      });

      if (res.ok) {
        setStatus(locale === "en" ? "Thanks! Your review is pending approval and will appear after moderation." : "شکریہ! آپ کی رائے منظوری کے انتظار میں ہے اور بعد میں ظاہر ہوگی۔");
        setForm({ name: "", rating: 5, review: "" });
      } else {
        const j = await res.json().catch(() => ({}));
        setStatus(j.message || (locale === "en" ? "Failed to submit. Please try again." : "جمع کرنے میں ناکامی۔ دوبارہ کوشش کریں۔"));
      }
    } catch {
      setStatus(locale === "en" ? "Network error. Please try again." : "نیٹ ورک خرابی۔ دوبارہ کوشش کریں۔");
    } finally {
      setLoading(false);
    }
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
      <Button type="submit" className="mt-5 w-full sm:w-auto" disabled={loading}>
        <Send className="h-4 w-4" aria-hidden="true" />
        {loading ? (locale === "en" ? "Submitting…" : "جمع ہو رہا ہے…") : (locale === "en" ? "Submit Review" : "رائے جمع کروائیں")}
      </Button>
      {status ? <p className="mt-3 text-sm text-primary">{status}</p> : null}
    </form>
  );
}

export function SocialLinks() {
  const { settings } = useSiteSettings();
  const links = getSocialLinks(settings);

  return (
    <div className="flex items-center gap-2">
      <a
        href={links.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="grid h-10 w-10 place-items-center rounded-md border border-white/15 text-slate-300 transition hover:bg-white/10 hover:text-white"
        aria-label="Facebook"
      >
        <FacebookIcon className="h-4 w-4" />
      </a>
      <a
        href={links.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="grid h-10 w-10 place-items-center rounded-md border border-white/15 text-slate-300 transition hover:bg-white/10 hover:text-white"
        aria-label="Instagram"
      >
        <InstagramIcon className="h-4 w-4" />
      </a>
      <a
        href={links.tiktok}
        target="_blank"
        rel="noopener noreferrer"
        className="grid h-10 w-10 place-items-center rounded-md border border-white/15 text-slate-300 transition hover:bg-white/10 hover:text-white"
        aria-label="TikTok"
      >
        <TikTokIcon className="h-4 w-4" />
      </a>
      <a
        href={links.youtube}
        target="_blank"
        rel="noopener noreferrer"
        className="grid h-10 w-10 place-items-center rounded-md border border-white/15 text-slate-300 transition hover:bg-white/10 hover:text-white"
        aria-label="YouTube"
      >
        <YoutubeIcon className="h-4 w-4" />
      </a>
    </div>
  );
}

export function GoogleMapSection() {
  const { locale } = usePublicLocale();
  const { settings } = useSiteSettings();

  const address = settings?.address ?? "New Bilal Ganj Market, Sheikhupura Road, Gujranwala";
  const phone = settings?.phone ?? company.phone;
  const email = settings?.email ?? company.email;
  const mapSrc =
    settings?.mapEmbedUrl ??
    `https://www.google.com/maps?q=${encodeURIComponent(address + ", Punjab, Pakistan")}&output=embed`;
  const links = getSocialLinks(settings);

  return (
    <section className="bg-muted/45 py-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary">{locale === "en" ? "Visit Us" : "ہم سے ملیں"}</p>
          <h2 className="mt-3 text-3xl font-black tracking-normal">{locale === "en" ? "Find us at New Bilal Ganj Market, Gujranwala." : "نیو بلال گنج مارکیٹ، گوجرانوالہ میں ہمیں تلاش کریں۔"}</h2>
          <div className="mt-6 grid gap-4 text-sm text-muted-foreground">
            <span className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
              <span>
                <strong className="block font-semibold text-foreground">{address}</strong>
                {locale === "en" ? "Punjab, Pakistan" : "پنجاب، پاکستان"}
              </span>
            </span>
            <span className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
              {phone}
            </span>
            <span className="flex items-start gap-3">
              <WhatsAppButton phoneNumber={settings?.whatsappNumber ?? company.whatsapp} variant="inline" message="Hi, I'm interested in your electric cables" className="text-slate-300 hover:text-white" />
            </span>
            <span className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
              {email}
            </span>
          </div>
          <div className="mt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {locale === "en" ? "Follow us" : "ہمیں فالو کریں"}
            </p>
            <div className="flex gap-2">
              <a href={links.facebook} target="_blank" rel="noopener noreferrer" className="grid h-9 w-9 place-items-center rounded-md border bg-card transition hover:bg-accent" aria-label="Facebook">
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a href={links.instagram} target="_blank" rel="noopener noreferrer" className="grid h-9 w-9 place-items-center rounded-md border bg-card transition hover:bg-accent" aria-label="Instagram">
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a href={links.tiktok} target="_blank" rel="noopener noreferrer" className="grid h-9 w-9 place-items-center rounded-md border bg-card transition hover:bg-accent" aria-label="TikTok">
                <TikTokIcon className="h-4 w-4" />
              </a>
              <a href={links.youtube} target="_blank" rel="noopener noreferrer" className="grid h-9 w-9 place-items-center rounded-md border bg-card transition hover:bg-accent" aria-label="YouTube">
                <YoutubeIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="min-h-80 overflow-hidden rounded-lg border bg-card shadow-sm">
          <iframe
            title="New Bilal Ganj Market, Sheikhupura Road, Gujranwala"
            src={mapSrc}
            className="h-full min-h-80 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
