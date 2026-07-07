import { clearAuthCookie } from "@/lib/cookies";
import { success } from "@/lib/response";
import { logoutAdmin } from "@/services/auth.service";

export async function POST() {
  await logoutAdmin();
  const response = success("Logout successful", {});
  clearAuthCookie(response);
  return response;
}
