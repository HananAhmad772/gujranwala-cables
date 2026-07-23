import { ZodError } from "zod";
import { requireAuth } from "@/middlewares/auth.middleware";
import { successResponse, errorResponse, parseRequestBody } from "@/lib/response";
import { formatFirstZodError, validateBody } from "@/lib/validations";
import { ApiError } from "@/lib/errors";
import { addBlog, getBlogs } from "@/services/blog.service";
import { blogListQuerySchema, createBlogSchema } from "@/validators/blog";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = blogListQuerySchema.parse(Object.fromEntries(searchParams.entries()));
    const result = await getBlogs(query);

    return successResponse(result, "Blog posts fetched successfully");
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
    const payload = validateBody(createBlogSchema, body);
    const blog = await addBlog(payload);

    return successResponse({ blog }, "Blog post created successfully", 201);
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

