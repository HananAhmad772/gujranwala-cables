import type { ReviewStatus } from "@/app/generated/prisma/enums";

export type SubmitReviewRequest = {
  name: string;
  email?: string | null;
  rating: number;
  comment: string;
};

export type ReviewListQuery = {
  page: number;
  limit: number;
  search?: string;
  status?: ReviewStatus;
};
