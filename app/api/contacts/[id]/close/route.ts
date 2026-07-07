import { requireAuth } from "@/middlewares/auth.middleware";
import { apiError, serverError, success } from "@/lib/response";
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

    return success("Contact submission closed successfully", { contact });
  } catch (error) {
    if (error instanceof ApiError) {
      return apiError(error);
    }

    return serverError("Internal Server Error");
  }
}
