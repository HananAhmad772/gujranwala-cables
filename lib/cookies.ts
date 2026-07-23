import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, COOKIE_MAX_AGE } from "@/utils/constants";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: COOKIE_MAX_AGE,
};

export function attachAuthCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set(AUTH_COOKIE_NAME, token, cookieOptions);
  return response;
}

export function clearAuthCookie(response: NextResponse): NextResponse {
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    ...cookieOptions,
    maxAge: 0,
  });
  return response;
}

export function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(";").reduce<Record<string, string>>((cookies, cookie) => {
    const [name, ...rest] = cookie.trim().split("=");
    if (!name) return cookies;
    cookies[name] = decodeURIComponent(rest.join("=") || "");
    return cookies;
  }, {});
}

export function getAuthTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  const cookieHeader = request.headers.get("cookie");
  const cookies = parseCookies(cookieHeader);
  return cookies[AUTH_COOKIE_NAME] ?? null;
}
