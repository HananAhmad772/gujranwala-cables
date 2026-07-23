import { z } from "zod";

export const createFaqSchema = z.object({
  question: z.string().trim().min(1, "Question is required"),
  answer: z.string().trim().min(1, "Answer is required"),
  sortOrder: z.number().int().min(0, "Sort order must be greater than or equal to 0").optional(),
});

export const updateFaqSchema = createFaqSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required",
});

export const faqListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
});
