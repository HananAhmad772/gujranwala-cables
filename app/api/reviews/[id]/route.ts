import { requireAuth } from "@/middlewares/auth.middleware";
import { apiError, serverError, success } from "@/lib/response";
import { ApiError } from "@/lib/errors";
import { removeReview } from "@/services/review.service";

type ReviewRouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(request: Request, { params }: ReviewRouteContext) {
  try {
    const authResult = requireAuth(request);

    if (authResult) {
      return authResult;
    }

    const { id } = await params;
    await removeReview(id);

    return success("Review deleted successfully", {});
  } catch (error) {
    if (error instanceof ApiError) {
      return apiError(error);
    }

    return serverError("Internal Server Error");
  }
}
