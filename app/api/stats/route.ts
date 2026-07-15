import { serverError, success } from "@/lib/response";
import { prisma } from "@/lib/prisma";
import { ReviewStatus, BlogStatus, ContactStatus } from "@/app/generated/prisma/client";

export async function GET() {
  try {
    const [
      products,
      categories,
      brands,
      pendingReviews,
      totalReviews,
      contactMessages,
      blogPosts,
    ] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.category.count({ where: { isActive: true } }),
      prisma.brand.count({ where: { isActive: true } }),
      prisma.review.count({ where: { status: ReviewStatus.PENDING } }),
      prisma.review.count(),
      prisma.contactSubmission.count({ where: { status: ContactStatus.NEW } }),
      prisma.blogPost.count({ where: { status: BlogStatus.PUBLISHED } }),
    ]);

    return success("Stats fetched successfully", {
      products,
      categories,
      brands,
      pendingReviews,
      totalReviews,
      contactMessages,
      blogPosts,
    });
  } catch (error) {
    return serverError("Internal Server Error");
  }
}
