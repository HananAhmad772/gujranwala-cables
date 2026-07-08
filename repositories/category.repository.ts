import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { CategoryListQuery, CreateCategoryRequest, UpdateCategoryRequest } from "@/types/category";

const categoryListInclude = {
  _count: {
    select: { products: true },
  },
};

const categoryDetailInclude = {
  products: {
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      stockStatus: true,
      featuredImage: true,
      brand: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" as const },
  },
  _count: {
    select: { products: true },
  },
};

function buildCategoryData(payload: CreateCategoryRequest | UpdateCategoryRequest) {
  const data: Prisma.CategoryUpdateInput = {};

  if (payload.name !== undefined) data.name = payload.name;
  if (payload.slug !== undefined) data.slug = payload.slug;
  if (payload.description !== undefined) data.description = payload.description;
  if (payload.isActive !== undefined) data.isActive = payload.isActive;

  return data;
}

function buildCategoryWhere(query: CategoryListQuery): Prisma.CategoryWhereInput {
  return {
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: "insensitive" as const } },
            { slug: { contains: query.search, mode: "insensitive" as const } },
            { description: { contains: query.search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };
}

export async function findCategories(query: CategoryListQuery) {
  const where = buildCategoryWhere(query);
  const skip = (query.page - 1) * query.limit;

  const [categories, total] = await prisma.$transaction([
    prisma.category.findMany({
      where,
      include: categoryListInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take: query.limit,
    }),
    prisma.category.count({ where }),
  ]);

  return {
    categories,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

export async function findCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
    include: categoryDetailInclude,
  });
}

export async function createCategory(payload: CreateCategoryRequest) {
  return prisma.category.create({
    data: buildCategoryData(payload) as Prisma.CategoryCreateInput,
    include: categoryDetailInclude,
  });
}

export async function updateCategory(id: string, payload: UpdateCategoryRequest) {
  return prisma.category.update({
    where: { id },
    data: buildCategoryData(payload),
    include: categoryDetailInclude,
  });
}

export async function deleteCategory(id: string) {
  return prisma.category.delete({
    where: { id },
    select: { id: true },
  });
}
