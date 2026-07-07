import { unauthorized } from "@/lib/response";
import { getAuthTokenFromRequest } from "@/lib/cookies";
import { verifyToken } from "@/lib/jwt";

export function requireAuth(request: Request) {
  const token = getAuthTokenFromRequest(request);

  if (!token) {
    return unauthorized();
  }

  try {
    verifyToken(token);
    return null;
  } catch {
    return unauthorized();
  }
}
