import { ZodError } from "zod";
import { requireAuth } from "@/middlewares/auth.middleware";
import { successResponse, errorResponse, parseRequestBody } from "@/lib/response";
import { formatFirstZodError, validateBody } from "@/lib/validations";
import { ApiError } from "@/lib/errors";
import { editContact, removeContact } from "@/services/contact.service";
import { updateContactStatusSchema } from "@/validators/contact";

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
    const body = await parseRequestBody(request);
    const payload = validateBody(updateContactStatusSchema, body);
    const contact = await editContact(id, payload.status);

    return successResponse({ contact }, "Contact submission updated successfully");
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

export async function DELETE(request: Request, { params }: ContactRouteContext) {
  try {
    const authResult = requireAuth(request);
    if (authResult) {
      return authResult;
    }

    const { id } = await params;
    await removeContact(id);

    return successResponse({}, "Contact submission deleted successfully");
  } catch (error) {
    if (error instanceof ApiError) {
      return errorResponse(error.message, error.statusCode);
    }
    return errorResponse("Internal Server Error", 500);
  }
}

