import { ReviewStatus } from "@/app/generated/prisma/enums";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { ReviewListQuery, SubmitReviewRequest, UpdateReviewRequest } from "@/types/review";

function buildReviewWhere(query: ReviewListQuery): Prisma.ReviewWhereInput {
  return {
    status: query.status ?? ReviewStatus.APPROVED,
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: "insensitive" as const } },
            { email: { contains: query.search, mode: "insensitive" as const } },
            { comment: { contains: query.search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };
}

export async function findReviews(query: ReviewListQuery) {
  const where = buildReviewWhere(query);
  const skip = (query.page - 1) * query.limit;

  const [reviews, total] = await prisma.$transaction([
    prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: query.limit,
    }),
    prisma.review.count({ where }),
  ]);

  return {
    reviews,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

export async function findReviewById(id: string) {
  return prisma.review.findUnique({
    where: { id },
  });
}

export async function createReview(payload: SubmitReviewRequest) {
  return prisma.review.create({
    data: payload,
  });
}

export async function updateReview(id: string, payload: UpdateReviewRequest) {
  return prisma.review.update({
    where: { id },
    data: payload,
  });
}

export async function updateReviewStatus(id: string, status: ReviewStatus) {
  return prisma.review.update({
    where: { id },
    data: { status },
  });
}

export async function deleteReview(id: string) {
  return prisma.review.delete({
    where: { id },
    select: { id: true },
  });
}
