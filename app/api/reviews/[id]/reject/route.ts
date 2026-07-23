import { requireAuth } from "@/middlewares/auth.middleware";
import { successResponse, errorResponse } from "@/lib/response";
import { ApiError } from "@/lib/errors";
import { rejectReview } from "@/services/review.service";

type ReviewRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: ReviewRouteContext) {
  try {
    const authResult = requireAuth(request);

    if (authResult) {
      return authResult;
    }

    const { id } = await params;
    const review = await rejectReview(id);

    return successResponse({ review }, "Review rejected successfully");
  } catch (error) {
    if (error instanceof ApiError) {
      return errorResponse(error.message, error.statusCode);
    }

    return errorResponse("Internal Server Error", 500);
  }
}

