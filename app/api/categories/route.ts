import { ZodError } from "zod";
import { requireAuth } from "@/middlewares/auth.middleware";
import { successResponse, errorResponse, parseRequestBody } from "@/lib/response";
import { formatFirstZodError, validateBody } from "@/lib/validations";
import { ApiError } from "@/lib/errors";
import { addCategory, getCategories } from "@/services/category.service";
import { categoryListQuerySchema, createCategorySchema } from "@/validators/category";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = categoryListQuerySchema.parse(Object.fromEntries(searchParams.entries()));
    const result = await getCategories(query);

    return successResponse(result, "Categories fetched successfully");
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
    const payload = validateBody(createCategorySchema, body);
    const category = await addCategory(payload);

    return successResponse({ category }, "Category created successfully", 201);
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

