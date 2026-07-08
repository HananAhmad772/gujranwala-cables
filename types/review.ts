import type { ReviewStatus } from "@/app/generated/prisma/client";

export type SubmitReviewRequest = {
  name: string;
  email?: string | null;
  rating: number;
  comment: string;
};

export type UpdateReviewRequest = Partial<SubmitReviewRequest> & {
  status?: ReviewStatus;
};

export type ReviewListQuery = {
  page: number;
  limit: number;
  search?: string;
  status?: ReviewStatus;
};
