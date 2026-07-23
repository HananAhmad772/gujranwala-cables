import { validateBody, formatFirstZodError } from "@/lib/validations";
import { loginSchema } from "@/validators/auth";
import { loginAdmin } from "@/services/auth.service";
import { attachAuthCookie } from "@/lib/cookies";
import { successResponse, errorResponse, parseRequestBody } from "@/lib/response";
import { ZodError } from "zod";
import { ApiError } from "@/lib/errors";

export async function POST(request: Request) {
  console.time("[login] total route execution");
  try {
    const body = await parseRequestBody(request);
    const payload = validateBody(loginSchema, body);
    const result = await loginAdmin(payload);
    const response = successResponse({ admin: result.admin, token: result.token }, "Login successful");
    attachAuthCookie(response, result.token);
    console.timeEnd("[login] total route execution");
    return response;
  } catch (error) {
    console.timeEnd("[login] total route execution");
    if (error instanceof ZodError) {
      return errorResponse(formatFirstZodError(error), 400);
    }

    if (error instanceof ApiError) {
      return errorResponse(error.message, error.statusCode);
    }

    const message = error instanceof Error ? error.message : "Internal Server Error";
    return errorResponse(message, 500);
  }
}

