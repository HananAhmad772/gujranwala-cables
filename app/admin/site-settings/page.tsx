"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  Camera,
  Globe2,
  ImagePlus,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  Type,
  UploadCloud,
  Video,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { SectionCard } from "@/components/admin/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePreferences } from "@/contexts/preferences-context";
import { useToast } from "@/components/ui/toast";
import { adminApi } from "@/services/admin-api";


type Tab = "general" | "contact" | "social";
type Errors = Record<string, string>;

const urlFields = ["googleMapsEmbedUrl", "facebook", "instagram", "linkedIn", "tikTok", "youTube"];

export default function SiteSettingsPage() {
  const { t } = usePreferences();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    companyName: "Gujranwala Electric Wires",
    websiteTitle: "Premium Electric Wires & Cables",
    websiteDescription: "Manufacturing reliable electrical wires and cable solutions for homes, contractors, and industrial buyers.",
    primaryPhone: "+92 310 232432",
    whatsappNumber: "+92 310 232432",
    email: "info@gujranwalaelectricwires.com",
    officeAddress: "Gujranwala, Punjab, Pakistan",
    googleMapsEmbedUrl: "",
    facebook: "",
    instagram: "",
    linkedIn: "",
    tikTok: "",
    youTube: "",
  });

  const tabs = useMemo(
    () => [
      { id: "general" as const, label: t.siteSettings.general, icon: Building2 },
      { id: "contact" as const, label: t.siteSettings.contact, icon: Phone },
      { id: "social" as const, label: t.siteSettings.socialMedia, icon: Share2 },
    ],
    [t],
  );

  useEffect(() => {
    let isMounted = true;
    const loadSettings = async () => {
      try {
        const data = await adminApi<{ settings: any }>("/api/site-settings");
        if (!isMounted || !data?.settings) return;
        const s = data.settings;
        setValues({
          companyName: s.companyName || "",
          websiteTitle: "Premium Electric Wires & Cables",
          websiteDescription: "Manufacturing reliable electrical wires and cable solutions for homes, contractors, and industrial buyers.",
          primaryPhone: s.phone || "",
          whatsappNumber: s.whatsappNumber || "",
          email: s.email || "",
          officeAddress: s.address || "",
          googleMapsEmbedUrl: s.mapEmbedUrl || "",
          facebook: s.facebookUrl || "",
          instagram: s.instagramUrl || "",
          linkedIn: s.linkedinUrl || "",
          tikTok: s.tiktokUrl || "",
          youTube: s.youtubeUrl || "",
        });
      } catch (err) {
        console.error(err);
      }
    };
    void loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  function updateValue(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validate() {
    const nextErrors: Errors = {};
    const requiredFields: (keyof typeof values)[] = [
      "companyName",
      "websiteTitle",
      "websiteDescription",
      "primaryPhone",
      "whatsappNumber",
      "email",
      "officeAddress",
    ];

    requiredFields.forEach((field) => {
      if (!values[field].trim()) nextErrors[field] = "Required";
    });

    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = "Invalid email";
    }

    urlFields.forEach((field) => {
      const value = values[field as keyof typeof values];
      if (value && !/^https?:\/\/.+/i.test(value)) {
        nextErrors[field] = "Use a valid URL";
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        companyName: values.companyName,
        address: values.officeAddress,
        phone: values.primaryPhone,
        whatsappNumber: values.whatsappNumber,
        email: values.email || null,
        facebookUrl: values.facebook || null,
        instagramUrl: values.instagram || null,
        linkedinUrl: values.linkedIn || null,
        youtubeUrl: values.youTube || null,
        mapEmbedUrl: values.googleMapsEmbedUrl || null,
      };

      await adminApi("/api/site-settings", {
        method: "POST",
        body: payload,
      });

      toast({
        title: t.siteSettings.settingsSaved,
        description: t.siteSettings.settingsSavedDescription,
        variant: "success",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error saving settings",
        description: err instanceof Error ? err.message : "Request failed",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleLogoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
  }


  return (
    <div>
      <PageHeader
        title={t.siteSettings.title}
        description={t.siteSettings.description}
        breadcrumbs={[{ label: t.nav.dashboard, href: "/admin" }, { label: t.nav.siteSettings }]}
        actions={<Button form="site-settings-form">{t.common.save}</Button>}
      />

      <div className="mb-6 flex gap-2 overflow-x-auto rounded-lg border bg-card p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex min-h-10 shrink-0 items-center gap-2 rounded-md px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              aria-pressed={active}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <form id="site-settings-form" onSubmit={handleSubmit}>
        {activeTab === "general" ? (
          <SectionCard title={t.siteSettings.general} description={t.siteSettings.validationHint}>
            <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
              <div className="grid gap-4 md:grid-cols-2">
                <Field icon={Building2} label={t.siteSettings.companyName} error={errors.companyName}>
                  <Input value={values.companyName} onChange={(event) => updateValue("companyName", event.target.value)} />
                </Field>
                <Field icon={Type} label={t.siteSettings.websiteTitle} error={errors.websiteTitle}>
                  <Input value={values.websiteTitle} onChange={(event) => updateValue("websiteTitle", event.target.value)} />
                </Field>
                <Field className="md:col-span-2" icon={Globe2} label={t.siteSettings.websiteDescription} error={errors.websiteDescription}>
                  <Textarea value={values.websiteDescription} onChange={(event) => updateValue("websiteDescription", event.target.value)} />
                </Field>
              </div>

              {/* <div className="rounded-lg border bg-muted/25 p-4">
                <Label>{t.siteSettings.companyLogo}</Label>
                <div className="mt-3 flex aspect-video items-center justify-center overflow-hidden rounded-lg border bg-card">
                  {logoPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoPreview} alt={t.siteSettings.logoPreview} className="h-full w-full object-contain p-4" />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <ImagePlus className="mx-auto h-10 w-10" />
                      <p className="mt-2 text-sm">{t.siteSettings.logoPreview}</p>
                    </div>
                  )}
                </div>
                <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-md border bg-card px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent">
                  <UploadCloud className="h-4 w-4" />
                  {t.siteSettings.uploadLogo}
                  <input type="file" accept="image/*" className="sr-only" onChange={handleLogoUpload} />
                </label>
              </div> */}
            </div>
          </SectionCard>
        ) : null}

        {activeTab === "contact" ? (
          <SectionCard title={t.siteSettings.contact} description={t.siteSettings.validationHint}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field icon={Phone} label={t.siteSettings.primaryPhone} error={errors.primaryPhone}>
                <Input value={values.primaryPhone} onChange={(event) => updateValue("primaryPhone", event.target.value)} />
              </Field>
              <Field icon={MessageCircle} label={t.siteSettings.whatsappNumber} error={errors.whatsappNumber}>
                <Input value={values.whatsappNumber} onChange={(event) => updateValue("whatsappNumber", event.target.value)} />
              </Field>
              <Field icon={Mail} label={t.siteSettings.email} error={errors.email}>
                <Input type="email" value={values.email} onChange={(event) => updateValue("email", event.target.value)} />
              </Field>
              <Field icon={MapPin} label={t.siteSettings.googleMapsEmbedUrl} error={errors.googleMapsEmbedUrl}>
                <Input value={values.googleMapsEmbedUrl} onChange={(event) => updateValue("googleMapsEmbedUrl", event.target.value)} />
              </Field>
              <Field className="md:col-span-2" icon={MapPin} label={t.siteSettings.officeAddress} error={errors.officeAddress}>
                <Textarea value={values.officeAddress} onChange={(event) => updateValue("officeAddress", event.target.value)} />
              </Field>
            </div>
          </SectionCard>
        ) : null}

        {activeTab === "social" ? (
          <SectionCard title={t.siteSettings.socialMedia} description={t.siteSettings.validationHint}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field icon={Globe2} label={t.siteSettings.facebook} error={errors.facebook}>
                <Input value={values.facebook} onChange={(event) => updateValue("facebook", event.target.value)} placeholder="https://facebook.com/..." />
              </Field>
              <Field icon={Camera} label={t.siteSettings.instagram} error={errors.instagram}>
                <Input value={values.instagram} onChange={(event) => updateValue("instagram", event.target.value)} placeholder="https://instagram.com/..." />
              </Field>
              <Field icon={BriefcaseBusiness} label={t.siteSettings.linkedIn} error={errors.linkedIn}>
                <Input value={values.linkedIn} onChange={(event) => updateValue("linkedIn", event.target.value)} placeholder="https://linkedin.com/..." />
              </Field>
              <Field icon={Share2} label={t.siteSettings.tikTok} error={errors.tikTok}>
                <Input value={values.tikTok} onChange={(event) => updateValue("tikTok", event.target.value)} placeholder="https://tiktok.com/..." />
              </Field>
              <Field icon={Video} label={t.siteSettings.youTube} error={errors.youTube}>
                <Input value={values.youTube} onChange={(event) => updateValue("youTube", event.target.value)} placeholder="https://youtube.com/..." />
              </Field>
            </div>
          </SectionCard>
        ) : null}
      </form>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  error,
  className,
  children,
}: {
  icon: typeof Building2;
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-secondary" />
        {label}
      </Label>
      {children}
      {error ? <p className="mt-2 text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}
