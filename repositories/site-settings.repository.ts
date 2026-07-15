import { prisma } from "@/lib/prisma";

export async function getSiteSettings() {
  return prisma.siteSettings.findFirst();
}

export type UpsertSiteSettingsInput = {
  companyName: string;
  address?: string | null;
  phone?: string | null;
  whatsappNumber?: string | null;
  email?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  youtubeUrl?: string | null;
  mapEmbedUrl?: string | null;
};

export async function upsertSiteSettings(data: UpsertSiteSettingsInput) {
  const existing = await prisma.siteSettings.findFirst({ select: { id: true } });
  const id = existing?.id ?? "global-settings";

  return prisma.siteSettings.upsert({
    where: { id },
    update: data,
    create: {
      id,
      ...data,
    },
  });
}
