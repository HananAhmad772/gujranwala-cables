import { ZodError } from "zod";
import { requireAuth } from "@/middlewares/auth.middleware";
import { apiError, serverError, success, validation } from "@/lib/response";
import { formatZodErrors, validateBody } from "@/lib/validations";
import { ApiError } from "@/lib/errors";
import { editBlog, getBlogById, removeBlog } from "@/services/blog.service";
import { updateBlogSchema } from "@/validators/blog";

type BlogRouteContext = {
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

export async function GET(_request: Request, { params }: BlogRouteContext) {
  try {
    const { id } = await params;
    const blog = await getBlogById(id);

    return success("Blog post fetched successfully", { blog });
  } catch (error) {
    if (error instanceof ApiError) {
      return apiError(error);
    }

    return serverError("Internal Server Error");
  }
}

export async function PATCH(request: Request, { params }: BlogRouteContext) {
  try {
    const authResult = requireAuth(request);

    if (authResult) {
      return authResult;
    }

    const { id } = await params;
    const body = await readJson(request);
    const payload = validateBody(updateBlogSchema, body);
    const blog = await editBlog(id, payload);

    return success("Blog post updated successfully", { blog });
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

export async function DELETE(request: Request, { params }: BlogRouteContext) {
  try {
    const authResult = requireAuth(request);

    if (authResult) {
      return authResult;
    }

    const { id } = await params;
    await removeBlog(id);

    return success("Blog post deleted successfully", {});
  } catch (error) {
    if (error instanceof ApiError) {
      return apiError(error);
    }

    return serverError("Internal Server Error");
  }
}
