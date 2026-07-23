import { clearAuthCookie } from "@/lib/cookies";
import { successResponse } from "@/lib/response";
import { logoutAdmin } from "@/services/auth.service";

export async function POST() {
  await logoutAdmin();
  const response = successResponse({}, "Logout successful");
  clearAuthCookie(response);
  return response;
}

