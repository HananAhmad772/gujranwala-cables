import { ZodError } from "zod";
import { requireAuth } from "@/middlewares/auth.middleware";
import { apiError, created, serverError, success, validation } from "@/lib/response";
import { formatZodErrors, validateBody } from "@/lib/validations";
import { ApiError } from "@/lib/errors";
import { addFaq, getFaqs } from "@/services/faq.service";
import { createFaqSchema, faqListQuerySchema } from "@/validators/faq";

async function readJson(request: Request) {
  try {
    return await request.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON payload";
    throw new ApiError("Invalid JSON payload", 400, { _error: [message] });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = faqListQuerySchema.parse(Object.fromEntries(searchParams.entries()));
    const result = await getFaqs(query);

    return success("FAQs fetched successfully", result);
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

export async function POST(request: Request) {
  try {
    const authResult = requireAuth(request);

    if (authResult) {
      return authResult;
    }

    const body = await readJson(request);
    const payload = validateBody(createFaqSchema, body);
    const faq = await addFaq(payload);

    return created("FAQ created successfully", { faq });
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
