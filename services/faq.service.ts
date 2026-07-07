import { Prisma } from "@/app/generated/prisma/client";
import { NotFoundError } from "@/lib/errors";
import { createFaq, deleteFaq, findFaqById, findFaqs, updateFaq } from "@/repositories/faq.repository";
import type { CreateFaqRequest, FaqListQuery, UpdateFaqRequest } from "@/types/faq";

type Faq = NonNullable<Awaited<ReturnType<typeof findFaqById>>>;

function formatFaq(faq: Faq) {
  return {
    ...faq,
    createdAt: faq.createdAt.toISOString(),
    updatedAt: faq.updatedAt.toISOString(),
  };
}

function handlePrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    throw new NotFoundError("FAQ not found");
  }

  throw error;
}

export async function getFaqs(query: FaqListQuery) {
  const result = await findFaqs(query);

  return {
    faqs: result.faqs.map(formatFaq),
    pagination: result.pagination,
  };
}

export async function getFaqById(id: string) {
  const faq = await findFaqById(id);

  if (!faq) {
    throw new NotFoundError("FAQ not found");
  }

  return formatFaq(faq);
}

export async function addFaq(payload: CreateFaqRequest) {
  try {
    const faq = await createFaq(payload);
    return formatFaq(faq);
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function editFaq(id: string, payload: UpdateFaqRequest) {
  await getFaqById(id);

  try {
    const faq = await updateFaq(id, payload);
    return formatFaq(faq);
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function removeFaq(id: string) {
  try {
    await deleteFaq(id);
    return true;
  } catch (error) {
    handlePrismaError(error);
  }
}
