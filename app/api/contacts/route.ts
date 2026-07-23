import { ZodError } from "zod";
import { requireAuth } from "@/middlewares/auth.middleware";
import { successResponse, errorResponse, parseRequestBody } from "@/lib/response";
import { formatFirstZodError, validateBody } from "@/lib/validations";
import { ApiError } from "@/lib/errors";
import { getContacts, submitContact } from "@/services/contact.service";
import { contactListQuerySchema, submitContactSchema } from "@/validators/contact";

export async function GET(request: Request) {
  try {
    const authResult = requireAuth(request);

    if (authResult) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);
    const query = contactListQuerySchema.parse(Object.fromEntries(searchParams.entries()));
    const result = await getContacts(query);

    return successResponse(result, "Contact submissions fetched successfully");
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
    const payload = validateBody(submitContactSchema, body);
    const contact = await submitContact(payload);

    return successResponse({ contact }, "Contact form submitted successfully", 201);
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

