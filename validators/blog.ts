import { z } from "zod";
import { BlogStatus } from "@/app/generated/prisma/client";

const optionalText = z.string().trim().optional().nullable();

const publishedAtSchema = z
  .union([z.string().datetime(), z.date(), z.null()])
  .transform((value) => {
    if (value === null) return null;
    return value instanceof Date ? value : new Date(value);
  })
  .optional();

export const createBlogSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: z.string().trim().min(1, "Slug is required"),
  excerpt: optionalText,
  content: z.string().trim().min(1, "Content is required"),
  featuredImage: optionalText,
  metaTitle: optionalText,
  metaDescription: optionalText,
  status: z.enum(BlogStatus).optional(),
  publishedAt: publishedAtSchema,
});

export const updateBlogSchema = createBlogSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required",
});

export const blogListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  status: z.enum(BlogStatus).optional(),
});
