import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email address"),
  password: z.string().nonempty("Password is required").min(8, "Password must be at least 8 characters"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().nonempty("Current password is required"),
  newPassword: z.string().nonempty("New password is required").min(8, "New password must be at least 8 characters"),
});
