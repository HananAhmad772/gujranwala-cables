import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import type { AdminJwtPayload } from "@/types/auth";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable");
}

const jwtSecret: Secret = JWT_SECRET;

export function generateToken(payload: AdminJwtPayload): string {
  return jwt.sign(payload, jwtSecret, {
    expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });
}

export function verifyToken(token: string): AdminJwtPayload {
  const decoded = jwt.verify(token, jwtSecret);

  if (typeof decoded !== "object" || decoded === null) {
    throw new Error("Invalid token payload");
  }

  const { adminId, email, role } = decoded as { adminId?: string; email?: string; role?: string };

  if (!adminId || !email || !role) {
    throw new Error("Invalid token payload");
  }

  return {
    adminId,
    email,
    role,
  };
}

export function decodeToken(token: string): AdminJwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payloadB64 = parts[1];
    const payloadStr = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"));
    const decoded = JSON.parse(payloadStr);

    if (typeof decoded !== "object" || decoded === null) {
      return null;
    }

    const { adminId, email, role } = decoded as { adminId?: string; email?: string; role?: string };

    if (!adminId || !email || !role) {
      return null;
    }

    return {
      adminId,
      email,
      role,
    };
  } catch {
    return null;
  }
}
