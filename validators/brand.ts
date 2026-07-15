import { z } from "zod";

const optionalText = z.string().trim().optional().nullable();

export const createBrandSchema = z.object({
  name: z.string().trim().nonempty("Name is required"),
  slug: z.string().trim().nonempty("Slug is required"),
  logoUrl: optionalText,
  description: optionalText,
  isActive: z.boolean().optional(),
});

export const updateBrandSchema = createBrandSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required",
});

export const brandListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  isActive: z.preprocess((val) => {
    if (val === "true") return true;
    if (val === "false") return false;
    return val;
  }, z.boolean().optional()),
});

