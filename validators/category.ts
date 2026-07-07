import { z } from "zod";

const optionalText = z.string().trim().optional().nullable();

export const createCategorySchema = z.object({
  name: z.string().trim().nonempty("Name is required"),
  slug: z.string().trim().nonempty("Slug is required"),
  description: optionalText,
});

export const updateCategorySchema = createCategorySchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required",
});

export const categoryListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
});
