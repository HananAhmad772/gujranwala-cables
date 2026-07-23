import { requireAuth } from "@/middlewares/auth.middleware";
import { getAuthTokenFromRequest } from "@/lib/cookies";
import { getCurrentAdmin } from "@/services/auth.service";
import { successResponse, errorResponse } from "@/lib/response";

export async function GET(request: Request) {
  const authResult = requireAuth(request);

  if (authResult) {
    return authResult;
  }

  const token = getAuthTokenFromRequest(request);

  if (!token) {
    return errorResponse("Unauthorized", 401);
  }

  const admin = await getCurrentAdmin(token);
  return successResponse({ admin }, "Admin profile fetched");
}

