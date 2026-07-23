import { ZodError } from "zod";
import { requireAuth } from "@/middlewares/auth.middleware";
import { successResponse, errorResponse, parseRequestBody } from "@/lib/response";
import { formatFirstZodError, validateBody } from "@/lib/validations";
import { ApiError } from "@/lib/errors";
import { editBlog, getBlogById, removeBlog } from "@/services/blog.service";
import { updateBlogSchema } from "@/validators/blog";

type BlogRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: BlogRouteContext) {
  try {
    const { id } = await params;
    const blog = await getBlogById(id);

    return successResponse({ blog }, "Blog post fetched successfully");
  } catch (error) {
    if (error instanceof ApiError) {
      return errorResponse(error.message, error.statusCode);
    }

    return errorResponse("Internal Server Error", 500);
  }
}

export async function PATCH(request: Request, { params }: BlogRouteContext) {
  try {
    const authResult = requireAuth(request);

    if (authResult) {
      return authResult;
    }

    const { id } = await params;
    const body = await parseRequestBody(request);
    const payload = validateBody(updateBlogSchema, body);
    const blog = await editBlog(id, payload);

    return successResponse({ blog }, "Blog post updated successfully");
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

export async function DELETE(request: Request, { params }: BlogRouteContext) {
  try {
    const authResult = requireAuth(request);

    if (authResult) {
      return authResult;
    }

    const { id } = await params;
    await removeBlog(id);

    return successResponse({}, "Blog post deleted successfully");
  } catch (error) {
    if (error instanceof ApiError) {
      return errorResponse(error.message, error.statusCode);
    }

    return errorResponse("Internal Server Error", 500);
  }
}

