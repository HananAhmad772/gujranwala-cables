import { getSiteSettings, upsertSiteSettings, type UpsertSiteSettingsInput } from "@/repositories/site-settings.repository";

function formatSiteSettings(settings: any) {
  if (!settings) return null;
  return {
    ...settings,
    createdAt: settings.createdAt.toISOString(),
    updatedAt: settings.updatedAt.toISOString(),
  };
}

export async function fetchSiteSettings() {
  const settings = await getSiteSettings();
  return formatSiteSettings(settings);
}

export async function saveSiteSettings(data: UpsertSiteSettingsInput) {
  const settings = await upsertSiteSettings(data);
  return formatSiteSettings(settings);
}
