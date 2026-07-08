"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Play, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { heroSlides, stats } from "@/lib/public-data";
import { cn } from "@/lib/utils";
import { usePublicLocale } from "@/components/public/localized";

export function HeroCarousel() {
  const { text, locale } = usePublicLocale();
  const [active, setActive] = useState(0);
  const slide = heroSlides[active];

  useEffect(() => {
    const interval = window.setInterval(() => setActive((value) => (value + 1) % heroSlides.length), 6500);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[calc(100svh-8rem)] overflow-hidden bg-[#07111f] text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.image}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image src={slide.image} alt={text(slide.title)} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07111f]/95 via-[#07111f]/68 to-[#07111f]/24 rtl:bg-gradient-to-l" />
        </motion.div>
      </AnimatePresence>

      <div className="relative mx-auto grid min-h-[calc(100svh-8rem)] max-w-7xl items-center gap-10 px-4 py-20 lg:grid-cols-[1fr_380px] lg:px-8">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-100 backdrop-blur">
            <ShieldCheck className="h-4 w-4 text-secondary" aria-hidden="true" />
            {text(slide.eyebrow)}
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-normal sm:text-6xl lg:text-7xl">{text(slide.title)}</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-xl">{text(slide.subtitle)}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/products" className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-secondary px-5 text-sm font-black text-secondary-foreground shadow-lg transition hover:bg-secondary/90">
              {locale === "en" ? "Explore Products" : "مصنوعات دیکھیں"}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
            <Link href="/contact" className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/20 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:bg-white/15">
              <Play className="h-4 w-4" aria-hidden="true" />
              {locale === "en" ? "Discuss a Project" : "پراجیکٹ پر بات کریں"}
            </Link>
          </div>
        </div>
        <div className="hidden rounded-lg border border-white/15 bg-white/10 p-5 backdrop-blur-xl lg:block">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-300">{locale === "en" ? "Production Snapshot" : "پروڈکشن خلاصہ"}</p>
          <div className="mt-5 grid gap-4">
            {stats.map((stat) => (
              <div key={stat.value} className="rounded-md border border-white/10 bg-white/10 p-4">
                <div className="text-3xl font-black">{stat.value}</div>
                <div className="mt-1 text-sm text-slate-300">{text(stat.label)}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 aspect-video overflow-hidden rounded-md border border-white/10 bg-black/40">
            <div className="flex h-full items-center justify-center gap-2 text-sm font-bold text-slate-300">
              <Play className="h-5 w-5" aria-hidden="true" />
              {locale === "en" ? "Video-ready hero slot" : "ویڈیو ہیرو سلاٹ تیار"}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3">
        <button className="grid h-10 w-10 place-items-center rounded-md border border-white/15 bg-white/10 text-white backdrop-blur" onClick={() => setActive((value) => (value - 1 + heroSlides.length) % heroSlides.length)} aria-label="Previous slide">
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
        </button>
        {heroSlides.map((item, index) => (
          <button key={item.image} className={cn("h-2.5 rounded-full transition-all", index === active ? "w-10 bg-secondary" : "w-2.5 bg-white/45")} onClick={() => setActive(index)} aria-label={`Go to slide ${index + 1}`} />
        ))}
        <button className="grid h-10 w-10 place-items-center rounded-md border border-white/15 bg-white/10 text-white backdrop-blur" onClick={() => setActive((value) => (value + 1) % heroSlides.length)} aria-label="Next slide">
          <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
