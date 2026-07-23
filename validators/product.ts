import { z } from "zod";
import { StockStatus } from "@/app/generated/prisma/client";
import { Prisma } from "@/app/generated/prisma/client";

const jsonSchema: z.ZodType<unknown> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonSchema),
    z.record(z.string(), jsonSchema),
  ]),
);

const optionalText = z.string().trim().optional().nullable();

const priceSchema = z
  .union([z.string(), z.number()])
  .transform((value) => String(value).trim())
  .refine((value) => value.length > 0, "Price is required")
  .refine((value) => /^\d+(\.\d{1,2})?$/.test(value), "Price must be a valid amount with up to 2 decimals")
  .refine((value) => Number(value) >= 0, "Price must be greater than or equal to 0");

export const productImageSchema = z.object({
  imageUrl: z.string().trim().min(1, "Image URL is required"),
  altText: optionalText,
  isPrimary: z.boolean().optional(),
  sortOrder: z.number().int().min(0, "Sort order must be greater than or equal to 0").optional(),
});

export const createProductSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: z.string().trim().min(1, "Slug is required"),
  description: z.string().trim().min(1, "Description is required"),
  size: optionalText,
  coreType: optionalText,
  application: optionalText,
  price: priceSchema,
  stockStatus: z.enum(StockStatus).optional(),
  isActive: z.boolean().optional(),
  featuredImage: optionalText,
  metaTitle: optionalText,
  metaDescription: optionalText,
  specs: jsonSchema
    .transform((value) => (value === null ? Prisma.JsonNull : (value as Prisma.InputJsonValue)))
    .optional(),
  brandId: z.string().trim().min(1, "Brand is required"),
  categoryId: z.string().trim().min(1, "Category is required"),
  images: z.array(productImageSchema).optional(),
});

export const updateProductSchema = createProductSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required",
});

export const productListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  brandId: z.string().trim().optional(),
  categoryId: z.string().trim().optional(),
  stockStatus: z.enum(StockStatus).optional(),
  featured: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
  isActive: z.preprocess((val) => {
    if (val === "true") return true;
    if (val === "false") return false;
    return val;
  }, z.boolean().optional()),
});

