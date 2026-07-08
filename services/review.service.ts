import { ReviewStatus } from "@/app/generated/prisma/enums";
import { Prisma } from "@/app/generated/prisma/client";
import { NotFoundError } from "@/lib/errors";
import {
  createReview,
  deleteReview,
  findReviewById,
  findReviews,
  updateReview,
  updateReviewStatus,
} from "@/repositories/review.repository";
import type { ReviewListQuery, SubmitReviewRequest, UpdateReviewRequest } from "@/types/review";

type Review = NonNullable<Awaited<ReturnType<typeof findReviewById>>>;

function formatReview(review: Review) {
  return {
    ...review,
    createdAt: review.createdAt.toISOString(),
  };
}

function handlePrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    throw new NotFoundError("Review not found");
  }

  throw error;
}

export async function getReviews(query: ReviewListQuery) {
  const result = await findReviews(query);

  return {
    reviews: result.reviews.map(formatReview),
    pagination: result.pagination,
  };
}

export async function submitReview(payload: SubmitReviewRequest) {
  const review = await createReview(payload);
  return formatReview(review);
}

export async function editReview(id: string, payload: UpdateReviewRequest) {
  try {
    const review = await updateReview(id, payload);
    return formatReview(review);
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function approveReview(id: string) {
  try {
    const review = await updateReviewStatus(id, ReviewStatus.APPROVED);
    return formatReview(review);
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function rejectReview(id: string) {
  try {
    const review = await updateReviewStatus(id, ReviewStatus.REJECTED);
    return formatReview(review);
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function removeReview(id: string) {
  try {
    await deleteReview(id);
    return true;
  } catch (error) {
    handlePrismaError(error);
  }
}
