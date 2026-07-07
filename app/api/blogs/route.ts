import { ZodError } from "zod";
import { requireAuth } from "@/middlewares/auth.middleware";
import { apiError, created, serverError, success, validation } from "@/lib/response";
import { formatZodErrors, validateBody } from "@/lib/validations";
import { ApiError } from "@/lib/errors";
import { addBlog, getBlogs } from "@/services/blog.service";
import { blogListQuerySchema, createBlogSchema } from "@/validators/blog";

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
    const query = blogListQuerySchema.parse(Object.fromEntries(searchParams.entries()));
    const result = await getBlogs(query);

    return success("Blog posts fetched successfully", result);
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
    const payload = validateBody(createBlogSchema, body);
    const blog = await addBlog(payload);

    return created("Blog post created successfully", { blog });
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
