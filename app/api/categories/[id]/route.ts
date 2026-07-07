import { ZodError } from "zod";
import { requireAuth } from "@/middlewares/auth.middleware";
import { apiError, serverError, success, validation } from "@/lib/response";
import { formatZodErrors, validateBody } from "@/lib/validations";
import { ApiError } from "@/lib/errors";
import { editCategory, getCategoryById, removeCategory } from "@/services/category.service";
import { updateCategorySchema } from "@/validators/category";

type CategoryRouteContext = {
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

export async function GET(_request: Request, { params }: CategoryRouteContext) {
  try {
    const { id } = await params;
    const category = await getCategoryById(id);

    return success("Category fetched successfully", { category });
  } catch (error) {
    if (error instanceof ApiError) {
      return apiError(error);
    }

    return serverError("Internal Server Error");
  }
}

export async function PATCH(request: Request, { params }: CategoryRouteContext) {
  try {
    const authResult = requireAuth(request);

    if (authResult) {
      return authResult;
    }

    const { id } = await params;
    const body = await readJson(request);
    const payload = validateBody(updateCategorySchema, body);
    const category = await editCategory(id, payload);

    return success("Category updated successfully", { category });
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

export async function DELETE(request: Request, { params }: CategoryRouteContext) {
  try {
    const authResult = requireAuth(request);

    if (authResult) {
      return authResult;
    }

    const { id } = await params;
    await removeCategory(id);

    return success("Category deleted successfully", {});
  } catch (error) {
    if (error instanceof ApiError) {
      return apiError(error);
    }

    return serverError("Internal Server Error");
  }
}
