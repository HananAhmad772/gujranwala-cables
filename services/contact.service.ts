import { ContactStatus } from "@/app/generated/prisma/client";
import { Prisma } from "@/app/generated/prisma/client";
import { NotFoundError } from "@/lib/errors";
import {
  createContact,
  deleteContact,
  findContactById,
  findContacts,
  updateContactStatus,
} from "@/repositories/contact.repository";
import type { ContactListQuery, SubmitContactRequest } from "@/types/contact";

type Contact = NonNullable<Awaited<ReturnType<typeof findContactById>>>;

function formatContact(contact: Contact) {
  return {
    ...contact,
    createdAt: contact.createdAt.toISOString(),
  };
}

function handlePrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    throw new NotFoundError("Contact submission not found");
  }

  throw error;
}

export async function getContacts(query: ContactListQuery) {
  const result = await findContacts(query);

  return {
    contacts: result.contacts.map(formatContact),
    pagination: result.pagination,
  };
}

export async function submitContact(payload: SubmitContactRequest) {
  const contact = await createContact(payload);
  return formatContact(contact);
}

export async function closeContact(id: string) {
  try {
    const contact = await updateContactStatus(id, ContactStatus.CLOSED);
    return formatContact(contact);
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function editContact(id: string, status: ContactStatus) {
  try {
    const contact = await updateContactStatus(id, status);
    return formatContact(contact);
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function removeContact(id: string) {
  try {
    await deleteContact(id);
    return true;
  } catch (error) {
    handlePrismaError(error);
  }
}
