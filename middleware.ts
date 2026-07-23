import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/utils/constants";

// Simple HS256 JWT signature verification using Web Crypto API
async function verifyJWT(token: string, secretStr: string): Promise<any> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, signatureB64] = parts;

    // Decode payload
    const payloadStr = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(payloadStr);

    // Check expiry
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }

    // Verify signature
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secretStr);
    const data = encoder.encode(`${headerB64}.${payloadB64}`);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    // Decode signature
    const sigBuf = Uint8Array.from(
      atob(signatureB64.replace(/-/g, "+").replace(/_/g, "/")),
      (c) => c.charCodeAt(0)
    );

    const isValid = await crypto.subtle.verify(
      "HMAC",
      cryptoKey,
      sigBuf,
      data
    );

    if (!isValid) return null;
    return payload;
  } catch (err) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  let token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }
  const { pathname } = request.nextUrl;
  const method = request.method;

  const secret = process.env.JWT_SECRET || "default_jwt_secret";

  // 1. Verify token if present
  let payload = null;
  if (token) {
    payload = await verifyJWT(token, secret);
  }

  // 2. Protect admin paths, except for login and forgot-password
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login" || pathname === "/admin/forgot-password") {
      // If user is already logged in, redirect them away from login page
      if (payload) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    if (!payload) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // 3. Protect write requests to api paths (POST, PUT, PATCH, DELETE to /api/*)
  if (pathname.startsWith("/api")) {
    const isWriteRequest = ["POST", "PUT", "PATCH", "DELETE"].includes(method);
    
    if (isWriteRequest) {
      const isExempt = 
        pathname === "/api/auth/login" || 
        pathname === "/api/auth/forgot-password" || 
        pathname === "/api/contacts" || 
        pathname === "/api/reviews";
        
      if (!isExempt && !payload) {
        return new NextResponse(
          JSON.stringify({ success: false, message: "Unauthorized", code: 401, data: null }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
