import { ZodError } from "zod";
import { requireAuth } from "@/middlewares/auth.middleware";
import { apiError, serverError, success, validation } from "@/lib/response";
import { formatZodErrors, validateBody } from "@/lib/validations";
import { ApiError } from "@/lib/errors";
import { editProduct, getProductById, removeProduct } from "@/services/product.service";
import { updateProductSchema } from "@/validators/product";

type ProductRouteContext = {
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

export async function GET(_request: Request, { params }: ProductRouteContext) {
  try {
    const { id } = await params;
    const product = await getProductById(id);

    return success("Product fetched successfully", { product });
  } catch (error) {
    if (error instanceof ApiError) {
      return apiError(error);
    }

    return serverError("Internal Server Error");
  }
}

export async function PATCH(request: Request, { params }: ProductRouteContext) {
  try {
    const authResult = requireAuth(request);

    if (authResult) {
      return authResult;
    }

    const { id } = await params;
    const body = await readJson(request);
    const payload = validateBody(updateProductSchema, body);
    const product = await editProduct(id, payload);

    return success("Product updated successfully", { product });
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

export async function DELETE(request: Request, { params }: ProductRouteContext) {
  try {
    const authResult = requireAuth(request);

    if (authResult) {
      return authResult;
    }

    const { id } = await params;
    await removeProduct(id);

    return success("Product deleted successfully", {});
  } catch (error) {
    if (error instanceof ApiError) {
      return apiError(error);
    }

    return serverError("Internal Server Error");
  }
}
