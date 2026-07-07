import { ZodError } from "zod";
import { apiError, created, serverError, success, validation } from "@/lib/response";
import { formatZodErrors, validateBody } from "@/lib/validations";
import { ApiError } from "@/lib/errors";
import { getReviews, submitReview } from "@/services/review.service";
import { reviewListQuerySchema, submitReviewSchema } from "@/validators/review";

async function readJson(request: Request) {
  try {
    return await request.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON payload";
    throw new ApiError("Invalid JSON payload", 400, { _error: [message] });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = reviewListQuerySchema.parse(Object.fromEntries(searchParams.entries()));
    const result = await getReviews(query);

    return success("Reviews fetched successfully", result);
  } catch (error) {
    if (error instanceof ZodError) {
      return validation("Validation failed", formatZodErrors(error));
    }

    if (error instanceof ApiError) {
      return apiError(error);
    }

    return serverError("Internal Server Error");
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson(request);
    const payload = validateBody(submitReviewSchema, body);
    const review = await submitReview(payload);

    return created("Review submitted successfully", { review });
  } catch (error) {
    if (error instanceof ZodError) {
      return validation("Validation failed", formatZodErrors(error));
    }

    if (error instanceof ApiError) {
      return apiError(error);
    }

    return serverError("Internal Server Error");
  }
}
