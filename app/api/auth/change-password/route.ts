import { validateBody, formatFirstZodError } from "@/lib/validations";
import { changePasswordSchema } from "@/validators/auth";
import { requireAuth } from "@/middlewares/auth.middleware";
import { getAuthTokenFromRequest } from "@/lib/cookies";
import { changeAdminPassword } from "@/services/auth.service";
import { successResponse, errorResponse, parseRequestBody } from "@/lib/response";
import { verifyToken } from "@/lib/jwt";
import { ZodError } from "zod";
import { ApiError } from "@/lib/errors";

export async function PATCH(request: Request) {
  try {
    const authResult = requireAuth(request);

    if (authResult) {
      return authResult;
    }

    const token = getAuthTokenFromRequest(request);
    if (!token) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await parseRequestBody(request);
    const payload = validateBody(changePasswordSchema, body);
    const { adminId } = verifyToken(token);

    await changeAdminPassword(adminId, payload);
    return successResponse({}, "Password changed successfully");
  } catch (error) {
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

