import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { CreateProductRequest, ProductListQuery, UpdateProductRequest } from "@/types/product";

const productInclude = {
  brand: {
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true,
    },
  },
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  images: {
    orderBy: [{ isPrimary: "desc" as const }, { sortOrder: "asc" as const }, { createdAt: "asc" as const }],
  },
};

function buildProductData(payload: CreateProductRequest | UpdateProductRequest) {
  const data: Prisma.ProductUncheckedUpdateInput = {};

  if (payload.name !== undefined) data.name = payload.name;
  if (payload.slug !== undefined) data.slug = payload.slug;
  if (payload.description !== undefined) data.description = payload.description;
  if (payload.size !== undefined) data.size = payload.size;
  if (payload.coreType !== undefined) data.coreType = payload.coreType;
  if (payload.application !== undefined) data.application = payload.application;
  if (payload.price !== undefined) data.price = payload.price;
  if (payload.stockStatus !== undefined) data.stockStatus = payload.stockStatus;
  if (payload.isActive !== undefined) data.isActive = payload.isActive;
  if (payload.featuredImage !== undefined) data.featuredImage = payload.featuredImage;
  if (payload.metaTitle !== undefined) data.metaTitle = payload.metaTitle;
  if (payload.metaDescription !== undefined) data.metaDescription = payload.metaDescription;
  if (payload.specs !== undefined) data.specs = payload.specs;
  if (payload.brandId !== undefined) data.brandId = payload.brandId;
  if (payload.categoryId !== undefined) data.categoryId = payload.categoryId;

  return data;
}

function buildProductWhere(query: ProductListQuery): Prisma.ProductWhereInput {
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
    ...(query.brandId ? { brandId: query.brandId } : {}),
    ...(query.categoryId ? { categoryId: query.categoryId } : {}),
    ...(query.stockStatus ? { stockStatus: query.stockStatus } : {}),
    ...(query.featured ? { featuredImage: { not: null } } : {}),
    ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
  };
}

export async function findProducts(query: ProductListQuery) {
  const where = buildProductWhere(query);
  const skip = (query.page - 1) * query.limit;

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take: query.limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

export async function findProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });
}

export async function findProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: productInclude,
  });
}

export async function brandExists(id: string) {
  const brand = await prisma.brand.findUnique({ where: { id }, select: { id: true } });
  return Boolean(brand);
}

export async function categoryExists(id: string) {
  const category = await prisma.category.findUnique({ where: { id }, select: { id: true } });
  return Boolean(category);
}

export async function createProduct(payload: CreateProductRequest) {
  return prisma.product.create({
    data: {
      ...buildProductData(payload),
      images: payload.images?.length
        ? {
            create: payload.images.map((image) => ({
              imageUrl: image.imageUrl,
              altText: image.altText,
              isPrimary: image.isPrimary ?? false,
              sortOrder: image.sortOrder ?? 0,
            })),
          }
        : undefined,
    } as Prisma.ProductUncheckedCreateInput,
    include: productInclude,
  });
}

export async function updateProduct(id: string, payload: UpdateProductRequest) {
  return prisma.$transaction(async (tx) => {
    if (payload.images) {
      await tx.productImage.deleteMany({ where: { productId: id } });
    }

    return tx.product.update({
      where: { id },
      data: {
        ...buildProductData(payload),
        images: payload.images
          ? {
              create: payload.images.map((image) => ({
                imageUrl: image.imageUrl,
                altText: image.altText,
                isPrimary: image.isPrimary ?? false,
                sortOrder: image.sortOrder ?? 0,
              })),
            }
          : undefined,
      } as Prisma.ProductUncheckedUpdateInput,
      include: productInclude,
    });
  });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({
    where: { id },
    select: { id: true },
  });
}
