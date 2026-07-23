import { ZodError } from "zod";
import { requireAuth } from "@/middlewares/auth.middleware";
import { successResponse, errorResponse, parseRequestBody } from "@/lib/response";
import { formatFirstZodError, validateBody } from "@/lib/validations";
import { ApiError } from "@/lib/errors";
import { editProduct, getProductById, removeProduct } from "@/services/product.service";
import { updateProductSchema } from "@/validators/product";

type ProductRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: ProductRouteContext) {
  try {
    const { id } = await params;
    const product = await getProductById(id);

    return successResponse({ product }, "Product fetched successfully");
  } catch (error) {
    if (error instanceof ApiError) {
      return errorResponse(error.message, error.statusCode);
    }

    return errorResponse("Internal Server Error", 500);
  }
}

export async function PATCH(request: Request, { params }: ProductRouteContext) {
  try {
    const authResult = requireAuth(request);

    if (authResult) {
      return authResult;
    }

    const { id } = await params;
    const body = await parseRequestBody(request);
    const payload = validateBody(updateProductSchema, body);
    const product = await editProduct(id, payload);

    return successResponse({ product }, "Product updated successfully");
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

export async function DELETE(request: Request, { params }: ProductRouteContext) {
  try {
    const authResult = requireAuth(request);

    if (authResult) {
      return authResult;
    }

    const { id } = await params;
    await removeProduct(id);

    return successResponse({}, "Product deleted successfully");
  } catch (error) {
    if (error instanceof ApiError) {
      return errorResponse(error.message, error.statusCode);
    }

    return errorResponse("Internal Server Error", 500);
  }
}

