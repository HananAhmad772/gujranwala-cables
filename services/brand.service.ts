import { Prisma } from "@/app/generated/prisma/client";
import { NotFoundError, ValidationError } from "@/lib/errors";
import {
  createBrand,
  deleteBrand,
  findBrandById,
  findBrands,
  updateBrand,
} from "@/repositories/brand.repository";
import type { BrandListQuery, CreateBrandRequest, UpdateBrandRequest } from "@/types/brand";

type BrandDetail = Awaited<ReturnType<typeof findBrandById>>;
type BrandListItem = Awaited<ReturnType<typeof findBrands>>["brands"][number];

function formatProduct(product: NonNullable<BrandDetail>["products"][number]) {
  return {
    ...product,
    price: product.price.toString(),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

function formatBrandListItem(brand: BrandListItem) {
  return {
    ...brand,
    productCount: brand._count.products,
    createdAt: brand.createdAt.toISOString(),
    updatedAt: brand.updatedAt.toISOString(),
    _count: undefined,
  };
}

function formatBrandDetail(brand: NonNullable<BrandDetail>) {
  return {
    ...brand,
    productCount: brand._count.products,
    products: brand.products.map(formatProduct),
    createdAt: brand.createdAt.toISOString(),
    updatedAt: brand.updatedAt.toISOString(),
    _count: undefined,
  };
}

function handlePrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const target = Array.isArray(error.meta?.target) ? error.meta.target.join(", ") : "name or slug";
      throw new ValidationError("Validation failed", { [target]: [`Brand ${target} already exists`] });
    }

    if (error.code === "P2025") {
      throw new NotFoundError("Brand not found");
    }
  }

  throw error;
}

export async function getBrands(query: BrandListQuery) {
  const result = await findBrands(query);

  return {
    brands: result.brands.map(formatBrandListItem),
    pagination: result.pagination,
  };
}

export async function getBrandById(id: string) {
  const brand = await findBrandById(id);

  if (!brand) {
    throw new NotFoundError("Brand not found");
  }

  return formatBrandDetail(brand);
}

export async function addBrand(payload: CreateBrandRequest) {
  try {
    const brand = await createBrand(payload);
    return formatBrandDetail(brand);
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function editBrand(id: string, payload: UpdateBrandRequest) {
  await getBrandById(id);

  try {
    const brand = await updateBrand(id, payload);
    return formatBrandDetail(brand);
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function removeBrand(id: string) {
  try {
    await deleteBrand(id);
    return true;
  } catch (error) {
    handlePrismaError(error);
  }
}
