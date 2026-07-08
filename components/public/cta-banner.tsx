"use client";

import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { company } from "@/lib/public-data";
import { usePublicLocale } from "@/components/public/localized";

export function CTABanner() {
  const { locale } = usePublicLocale();

  return (
    <section className="bg-primary py-14 text-primary-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] opacity-80">{locale === "en" ? "Project Support" : "پراجیکٹ سپورٹ"}</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-normal sm:text-4xl">
            {locale === "en" ? "Need reliable wires for a commercial or industrial project?" : "کمرشل یا صنعتی پراجیکٹ کے لیے قابل اعتماد وائرز چاہئیں؟"}
          </h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href={`tel:${company.phone}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-black text-primary shadow-sm">
            <Phone className="h-4 w-4" aria-hidden="true" />
            {company.phone}
          </a>
          <Link href="/contact" className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/25 px-5 text-sm font-black text-white">
            {locale === "en" ? "Request a Quote" : "قیمت معلوم کریں"}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
