import { ZodError } from "zod";
import { requireAuth } from "@/middlewares/auth.middleware";
import { apiError, serverError, success, validation } from "@/lib/response";
import { formatZodErrors, validateBody } from "@/lib/validations";
import { ApiError } from "@/lib/errors";
import { editBrand, getBrandById, removeBrand } from "@/services/brand.service";
import { updateBrandSchema } from "@/validators/brand";

type BrandRouteContext = {
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

export async function GET(_request: Request, { params }: BrandRouteContext) {
  try {
    const { id } = await params;
    const brand = await getBrandById(id);

    return success("Brand fetched successfully", { brand });
  } catch (error) {
    if (error instanceof ApiError) {
      return apiError(error);
    }

    return serverError("Internal Server Error");
  }
}

export async function PATCH(request: Request, { params }: BrandRouteContext) {
  try {
    const authResult = requireAuth(request);

    if (authResult) {
      return authResult;
    }

    const { id } = await params;
    const body = await readJson(request);
    const payload = validateBody(updateBrandSchema, body);
    const brand = await editBrand(id, payload);

    return success("Brand updated successfully", { brand });
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

export async function DELETE(request: Request, { params }: BrandRouteContext) {
  try {
    const authResult = requireAuth(request);

    if (authResult) {
      return authResult;
    }

    const { id } = await params;
    await removeBrand(id);

    return success("Brand deleted successfully", {});
  } catch (error) {
    if (error instanceof ApiError) {
      return apiError(error);
    }

    return serverError("Internal Server Error");
  }
}
