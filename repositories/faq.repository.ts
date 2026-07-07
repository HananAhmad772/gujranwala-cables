import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { CreateFaqRequest, FaqListQuery, UpdateFaqRequest } from "@/types/faq";

function buildFaqData(payload: CreateFaqRequest | UpdateFaqRequest) {
  const data: Prisma.FAQUpdateInput = {};

  if (payload.question !== undefined) data.question = payload.question;
  if (payload.answer !== undefined) data.answer = payload.answer;
  if (payload.sortOrder !== undefined) data.sortOrder = payload.sortOrder;

  return data;
}

function buildFaqWhere(query: FaqListQuery): Prisma.FAQWhereInput {
  return {
    ...(query.search
      ? {
          OR: [
            { question: { contains: query.search, mode: "insensitive" as const } },
            { answer: { contains: query.search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };
}

export async function findFaqs(query: FaqListQuery) {
  const where = buildFaqWhere(query);
  const skip = (query.page - 1) * query.limit;

  const [faqs, total] = await prisma.$transaction([
    prisma.fAQ.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      skip,
      take: query.limit,
    }),
    prisma.fAQ.count({ where }),
  ]);

  return {
    faqs,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

export async function findFaqById(id: string) {
  return prisma.fAQ.findUnique({
    where: { id },
  });
}

export async function createFaq(payload: CreateFaqRequest) {
  return prisma.fAQ.create({
    data: buildFaqData(payload) as Prisma.FAQCreateInput,
  });
}

export async function updateFaq(id: string, payload: UpdateFaqRequest) {
  return prisma.fAQ.update({
    where: { id },
    data: buildFaqData(payload),
  });
}

export async function deleteFaq(id: string) {
  return prisma.fAQ.delete({
    where: { id },
    select: { id: true },
  });
}
