import { ZodError } from "zod";
import { requireAuth } from "@/middlewares/auth.middleware";
import { successResponse, errorResponse, parseRequestBody } from "@/lib/response";
import { formatFirstZodError, validateBody } from "@/lib/validations";
import { ApiError } from "@/lib/errors";
import { editFaq, getFaqById, removeFaq } from "@/services/faq.service";
import { updateFaqSchema } from "@/validators/faq";

type FaqRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: FaqRouteContext) {
  try {
    const { id } = await params;
    const faq = await getFaqById(id);

    return successResponse({ faq }, "FAQ fetched successfully");
  } catch (error) {
    if (error instanceof ApiError) {
      return errorResponse(error.message, error.statusCode);
    }

    return errorResponse("Internal Server Error", 500);
  }
}

export async function PATCH(request: Request, { params }: FaqRouteContext) {
  try {
    const authResult = requireAuth(request);

    if (authResult) {
      return authResult;
    }

    const { id } = await params;
    const body = await parseRequestBody(request);
    const payload = validateBody(updateFaqSchema, body);
    const faq = await editFaq(id, payload);

    return successResponse({ faq }, "FAQ updated successfully");
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

export async function DELETE(request: Request, { params }: FaqRouteContext) {
  try {
    const authResult = requireAuth(request);

    if (authResult) {
      return authResult;
    }

    const { id } = await params;
    await removeFaq(id);

    return successResponse({}, "FAQ deleted successfully");
  } catch (error) {
    if (error instanceof ApiError) {
      return errorResponse(error.message, error.statusCode);
    }

    return errorResponse("Internal Server Error", 500);
  }
}

