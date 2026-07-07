import { z } from "zod";
import { ContactStatus } from "@/app/generated/prisma/enums";

const optionalText = z.string().trim().optional().nullable();

export const submitContactSchema = z.object({
  name: z.string().trim().nonempty("Name is required"),
  email: z.string().trim().nonempty("Email is required").email("Invalid email address"),
  phone: optionalText,
  subject: optionalText,
  message: z.string().trim().nonempty("Message is required"),
});

export const contactListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  status: z.enum(ContactStatus).optional(),
});
