import { z } from "zod";
import { ReviewStatus } from "@/app/generated/prisma/enums";

export const submitReviewSchema = z.object({
  name: z.string().trim().nonempty("Name is required"),
  email: z.string().trim().email("Invalid email address").optional().nullable(),
  rating: z.coerce.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  comment: z.string().trim().nonempty("Comment is required"),
});

export const updateReviewSchema = z.object({
  name: z.string().trim().nonempty("Name is required").optional(),
  email: z.string().trim().email("Invalid email address").optional().nullable(),
  rating: z.coerce.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5").optional(),
  comment: z.string().trim().nonempty("Comment is required").optional(),
  status: z.enum(ReviewStatus).optional(),
});

export const reviewListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  status: z.enum(ReviewStatus).optional(),
});
