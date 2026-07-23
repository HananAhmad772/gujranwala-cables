import { unauthorized } from "@/lib/response";
import { getAuthTokenFromRequest } from "@/lib/cookies";
import { verifyToken, decodeToken } from "@/lib/jwt";

export function requireAuth(request: Request) {
  const token = getAuthTokenFromRequest(request);

  if (!token) {
    return unauthorized();
  }

  try {
    if (process.env.NEXT_RUNTIME === "edge") {
      const decoded = decodeToken(token);
      if (!decoded) {
        return unauthorized();
      }
    } else {
      verifyToken(token);
    }
    return null;
  } catch {
    return unauthorized();
  }
}
