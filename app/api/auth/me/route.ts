import { requireAuth } from "@/middlewares/auth.middleware";
import { getAuthTokenFromRequest } from "@/lib/cookies";
import { getCurrentAdmin } from "@/services/auth.service";
import { success, unauthorized } from "@/lib/response";

export async function GET(request: Request) {
  const authResult = requireAuth(request);

  if (authResult) {
    return authResult;
  }

  const token = getAuthTokenFromRequest(request);

  if (!token) {
    return unauthorized();
  }

  const admin = await getCurrentAdmin(token);
  return success("Admin profile fetched", { admin });
}
