import { ZodError } from "zod";
import { requireAuth } from "@/middlewares/auth.middleware";
import { successResponse, errorResponse, parseRequestBody } from "@/lib/response";
import { formatFirstZodError, validateBody } from "@/lib/validations";
import { ApiError } from "@/lib/errors";
import { editBrand, getBrandById, removeBrand } from "@/services/brand.service";
import { updateBrandSchema } from "@/validators/brand";

type BrandRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: BrandRouteContext) {
  try {
    const { id } = await params;
    const brand = await getBrandById(id);

    return successResponse({ brand }, "Brand fetched successfully");
  } catch (error) {
    if (error instanceof ApiError) {
      return errorResponse(error.message, error.statusCode);
    }

    return errorResponse("Internal Server Error", 500);
  }
}

export async function PATCH(request: Request, { params }: BrandRouteContext) {
  try {
    const authResult = requireAuth(request);

    if (authResult) {
      return authResult;
    }

    const { id } = await params;
    const body = await parseRequestBody(request);
    const payload = validateBody(updateBrandSchema, body);
    const brand = await editBrand(id, payload);

    return successResponse({ brand }, "Brand updated successfully");
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

export async function DELETE(request: Request, { params }: BrandRouteContext) {
  try {
    const authResult = requireAuth(request);

    if (authResult) {
      return authResult;
    }

    const { id } = await params;
    await removeBrand(id);

    return successResponse({}, "Brand deleted successfully");
  } catch (error) {
    if (error instanceof ApiError) {
      return errorResponse(error.message, error.statusCode);
    }

    return errorResponse("Internal Server Error", 500);
  }
}

