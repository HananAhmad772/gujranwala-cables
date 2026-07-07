export interface AdminJwtPayload {
  adminId: string;
  email: string;
  role: string;
}

export interface AdminProfile {
  id: string;
  name?: string | null;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
