import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { BrandListQuery, CreateBrandRequest, UpdateBrandRequest } from "@/types/brand";

const brandListInclude = {
  _count: {
    select: { products: true },
  },
};

const brandDetailInclude = {
  products: {
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      stockStatus: true,
      featuredImage: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
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

function buildBrandData(payload: CreateBrandRequest | UpdateBrandRequest) {
  const data: Prisma.BrandUpdateInput = {};

  if (payload.name !== undefined) data.name = payload.name;
  if (payload.slug !== undefined) data.slug = payload.slug;
  if (payload.logoUrl !== undefined) data.logoUrl = payload.logoUrl;
  if (payload.description !== undefined) data.description = payload.description;
  if (payload.isActive !== undefined) data.isActive = payload.isActive;

  return data;
}

function buildBrandWhere(query: BrandListQuery): Prisma.BrandWhereInput {
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
    ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
  };
}

export async function findBrands(query: BrandListQuery) {
  const where = buildBrandWhere(query);
  const skip = (query.page - 1) * query.limit;

  const [brands, total] = await prisma.$transaction([
    prisma.brand.findMany({
      where,
      include: brandListInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take: query.limit,
    }),
    prisma.brand.count({ where }),
  ]);

  return {
    brands,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

export async function findBrandById(id: string) {
  return prisma.brand.findUnique({
    where: { id },
    include: brandDetailInclude,
  });
}

export async function createBrand(payload: CreateBrandRequest) {
  return prisma.brand.create({
    data: buildBrandData(payload) as Prisma.BrandCreateInput,
    include: brandDetailInclude,
  });
}

export async function updateBrand(id: string, payload: UpdateBrandRequest) {
  return prisma.brand.update({
    where: { id },
    data: buildBrandData(payload),
    include: brandDetailInclude,
  });
}

export async function deleteBrand(id: string) {
  return prisma.brand.delete({
    where: { id },
    select: { id: true },
  });
}
