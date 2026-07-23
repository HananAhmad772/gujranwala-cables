import { requireAuth } from "@/middlewares/auth.middleware";
import { successResponse, errorResponse } from "@/lib/response";
import { ApiError } from "@/lib/errors";
import { closeContact } from "@/services/contact.service";

type ContactRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: ContactRouteContext) {
  try {
    const authResult = requireAuth(request);

    if (authResult) {
      return authResult;
    }

    const { id } = await params;
    const contact = await closeContact(id);

    return successResponse({ contact }, "Contact submission closed successfully");
  } catch (error) {
    if (error instanceof ApiError) {
      return errorResponse(error.message, error.statusCode);
    }

    return errorResponse("Internal Server Error", 500);
  }
}

