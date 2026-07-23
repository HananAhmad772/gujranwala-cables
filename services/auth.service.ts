import { comparePassword, hashPassword } from "@/lib/bcrypt";
import { generateToken, verifyToken } from "@/lib/jwt";
import { logInfo } from "@/lib/logger";
import {
  findAdminByEmail,
  findAdminById,
  findAdminByIdWithPasswordHash,
  updatePassword,
} from "@/repositories/auth.repository";
import { UnauthorizedError } from "@/lib/errors";
import type { AdminJwtPayload, LoginRequest, ChangePasswordRequest } from "@/types/auth";

export async function loginAdmin({ email, password }: LoginRequest) {
  console.time("[login] db query (findAdminByEmail)");
  const admin = await findAdminByEmail(email);
  console.timeEnd("[login] db query (findAdminByEmail)");

  if (!admin) {
    logInfo("Login Failed", { email, reason: "Admin not found" });
    throw new UnauthorizedError("Invalid credentials");
  }

  console.time("[login] bcrypt compare");
  const isPasswordValid = await comparePassword(password, admin.passwordHash);
  console.timeEnd("[login] bcrypt compare");

  if (!isPasswordValid) {
    logInfo("Login Failed", { email, reason: "Invalid password" });
    throw new UnauthorizedError("Invalid credentials");
  }

  const payload: AdminJwtPayload = {
    adminId: admin.id,
    email: admin.email,
    role: admin.role,
  };

  const token = generateToken(payload);

  logInfo("Admin Logged In", { adminId: admin.id, email: admin.email });

  return {
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      createdAt: admin.createdAt.toISOString(),
      updatedAt: admin.updatedAt.toISOString(),
    },
  };
}

export async function logoutAdmin() {
  logInfo("Admin Logged Out");
  return true;
}

export async function getCurrentAdmin(token: string) {
  const payload = verifyToken(token);
  const admin = await findAdminById(payload.adminId);

  if (!admin) {
    logInfo("Get Current Admin Failed", { adminId: payload.adminId });
    throw new Error("Unauthorized");
  }

  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    createdAt: admin.createdAt.toISOString(),
    updatedAt: admin.updatedAt.toISOString(),
  };
}

export async function changeAdminPassword(adminId: string, request: ChangePasswordRequest) {
  const admin = await findAdminByIdWithPasswordHash(adminId);

  if (!admin) {
    logInfo("Password Change Failed", { adminId, reason: "Admin not found" });
    throw new Error("Invalid credentials");
  }

  const isCurrentPasswordValid = await comparePassword(request.currentPassword, admin.passwordHash);

  if (!isCurrentPasswordValid) {
    logInfo("Password Change Failed", { adminId, reason: "Invalid current password" });
    throw new Error("Invalid credentials");
  }

  const newHash = await hashPassword(request.newPassword);
  await updatePassword(adminId, newHash);

  logInfo("Password Changed", { adminId });
  return true;
}
