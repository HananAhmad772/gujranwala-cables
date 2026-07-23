import { ZodError } from "zod";
import { successResponse, errorResponse, parseRequestBody } from "@/lib/response";
import { formatFirstZodError, validateBody } from "@/lib/validations";
import { ApiError } from "@/lib/errors";
import { getReviews, submitReview } from "@/services/review.service";
import { reviewListQuerySchema, submitReviewSchema } from "@/validators/review";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = reviewListQuerySchema.parse(Object.fromEntries(searchParams.entries()));
    const result = await getReviews(query);

    return successResponse(result, "Reviews fetched successfully");
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse(formatFirstZodError(error), 400);
    }

    if (error instanceof ApiError) {
      return errorResponse(error.message, error.statusCode);
    }

    return errorResponse("Internal Server Error", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const payload = validateBody(submitReviewSchema, body);
    const review = await submitReview(payload);

    return successResponse({ review }, "Review submitted successfully", 201);
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse(formatFirstZodError(error), 400);
    }

    if (error instanceof ApiError) {
      return errorResponse(error.message, error.statusCode);
    }

    return errorResponse("Internal Server Error", 500);
  }
}

