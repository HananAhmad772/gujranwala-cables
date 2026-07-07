import { validateBody, formatZodErrors } from "@/lib/validations";
import { changePasswordSchema } from "@/validators/auth";
import { requireAuth } from "@/middlewares/auth.middleware";
import { getAuthTokenFromRequest } from "@/lib/cookies";
import { changeAdminPassword } from "@/services/auth.service";
import { success, validation, unauthorized, serverError } from "@/lib/response";
import { verifyToken } from "@/lib/jwt";
import { ZodError } from "zod";

export async function PATCH(request: Request) {
  try {
    const authResult = requireAuth(request);

    if (authResult) {
      return authResult;
    }

    const token = getAuthTokenFromRequest(request);
    if (!token) {
      return unauthorized();
    }

    const body = await request.json();
    const payload = validateBody(changePasswordSchema, body);
    const { adminId } = verifyToken(token);

    await changeAdminPassword(adminId, payload);
    return success("Password changed successfully", {});
  } catch (error) {
    if (error instanceof ZodError) {
      return validation("Validation failed", formatZodErrors(error));
    }

    return serverError("Internal Server Error");
  }
}
