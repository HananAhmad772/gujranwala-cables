import { z } from "zod";

const optionalText = z.string().trim().optional().nullable();

export const siteSettingsSchema = z.object({
  companyName: z.string().trim().nonempty("Company Name is required"),
  address: optionalText,
  phone: optionalText,
  whatsappNumber: optionalText,
  email: z.preprocess((val) => (val === "" ? null : val), z.string().trim().email("Invalid email address").optional().nullable()),
  facebookUrl: optionalText,
  instagramUrl: optionalText,
  linkedinUrl: optionalText,
  youtubeUrl: optionalText,
  mapEmbedUrl: optionalText,
});
