import { ContactStatus } from "@/app/generated/prisma/client";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { ContactListQuery, SubmitContactRequest } from "@/types/contact";

function buildContactWhere(query: ContactListQuery): Prisma.ContactSubmissionWhereInput {
  return {
    ...(query.status ? { status: query.status } : {}),
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: "insensitive" as const } },
            { email: { contains: query.search, mode: "insensitive" as const } },
            { phone: { contains: query.search, mode: "insensitive" as const } },
            { subject: { contains: query.search, mode: "insensitive" as const } },
            { message: { contains: query.search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };
}

export async function findContacts(query: ContactListQuery) {
  const where = buildContactWhere(query);
  const skip = (query.page - 1) * query.limit;

  const [contacts, total] = await prisma.$transaction([
    prisma.contactSubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: query.limit,
    }),
    prisma.contactSubmission.count({ where }),
  ]);

  return {
    contacts,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

export async function findContactById(id: string) {
  return prisma.contactSubmission.findUnique({
    where: { id },
  });
}

export async function createContact(payload: SubmitContactRequest) {
  return prisma.contactSubmission.create({
    data: payload,
  });
}

export async function updateContactStatus(id: string, status: ContactStatus) {
  return prisma.contactSubmission.update({
    where: { id },
    data: { status },
  });
}
