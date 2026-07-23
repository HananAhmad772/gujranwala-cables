import { ZodError } from "zod";
import { requireAuth } from "@/middlewares/auth.middleware";
import { successResponse, errorResponse, parseRequestBody } from "@/lib/response";
import { formatFirstZodError, validateBody } from "@/lib/validations";
import { ApiError } from "@/lib/errors";
import { addFaq, getFaqs } from "@/services/faq.service";
import { createFaqSchema, faqListQuerySchema } from "@/validators/faq";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = faqListQuerySchema.parse(Object.fromEntries(searchParams.entries()));
    const result = await getFaqs(query);

    return successResponse(result, "FAQs fetched successfully");
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
    const authResult = requireAuth(request);

    if (authResult) {
      return authResult;
    }

    const body = await parseRequestBody(request);
    const payload = validateBody(createFaqSchema, body);
    const faq = await addFaq(payload);

    return successResponse({ faq }, "FAQ created successfully", 201);
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

