import { ZodError } from "zod";
import { requireAuth } from "@/middlewares/auth.middleware";
import { apiError, serverError, success, validation } from "@/lib/response";
import { formatZodErrors, validateBody } from "@/lib/validations";
import { ApiError } from "@/lib/errors";
import { editContact, removeContact } from "@/services/contact.service";
import { updateContactStatusSchema } from "@/validators/contact";

type ContactRouteContext = {
  params: Promise<{ id: string }>;
};

async function readJson(request: Request) {
  try {
    return await request.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON payload";
    throw new ApiError("Invalid JSON payload", 400, { _error: [message] });
  }
}

export async function PATCH(request: Request, { params }: ContactRouteContext) {
  try {
    const authResult = requireAuth(request);
    if (authResult) {
      return authResult;
    }

    const { id } = await params;
    const body = await readJson(request);
    const payload = validateBody(updateContactStatusSchema, body);
    const contact = await editContact(id, payload.status);

    return success("Contact submission updated successfully", { contact });
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

export async function DELETE(request: Request, { params }: ContactRouteContext) {
  try {
    const authResult = requireAuth(request);
    if (authResult) {
      return authResult;
    }

    const { id } = await params;
    await removeContact(id);

    return success("Contact submission deleted successfully", {});
  } catch (error) {
    if (error instanceof ApiError) {
      return apiError(error);
    }
    return serverError("Internal Server Error");
  }
}
