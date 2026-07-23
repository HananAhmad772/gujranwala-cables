import { validateBody, formatZodErrors } from "@/lib/validations";
import { loginSchema } from "@/validators/auth";
import { loginAdmin } from "@/services/auth.service";
import { attachAuthCookie } from "@/lib/cookies";
import { success, validation, serverError, apiError } from "@/lib/response";
import { ZodError } from "zod";
import { ApiError } from "@/lib/errors";

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid JSON payload";
      return validation("Invalid JSON payload", { _error: [message] });
    }

    const payload = validateBody(loginSchema, body);
    const result = await loginAdmin(payload);
    const response = success("Login successful", { admin: result.admin, token: result.token });
    attachAuthCookie(response, result.token);
    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return validation("Validation failed", formatZodErrors(error));
    }

    if (error instanceof ApiError) {
      return apiError(error);
    }

    const message = error instanceof Error ? error.message : "Internal Server Error";
    return serverError(message);
  }
}
