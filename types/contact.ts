import type { ContactStatus } from "@/app/generated/prisma/enums";

export type SubmitContactRequest = {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
};

export type ContactListQuery = {
  page: number;
  limit: number;
  search?: string;
  status?: ContactStatus;
};
