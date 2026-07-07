import { requireAuth } from "@/middlewares/auth.middleware";
import { apiError, serverError, success } from "@/lib/response";
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

    return success("Review rejected successfully", { review });
  } catch (error) {
    if (error instanceof ApiError) {
      return apiError(error);
    }

    return serverError("Internal Server Error");
  }
}
