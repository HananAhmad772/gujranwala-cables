import { Prisma } from "@/app/generated/prisma/client";
import { NotFoundError, ValidationError } from "@/lib/errors";
import {
  createCategory,
  deleteCategory,
  findCategories,
  findCategoryById,
  updateCategory,
} from "@/repositories/category.repository";
import type { CategoryListQuery, CreateCategoryRequest, UpdateCategoryRequest } from "@/types/category";

type CategoryDetail = Awaited<ReturnType<typeof findCategoryById>>;
type CategoryListItem = Awaited<ReturnType<typeof findCategories>>["categories"][number];

function formatProduct(product: NonNullable<CategoryDetail>["products"][number]) {
  return {
    ...product,
    price: product.price.toString(),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

function formatCategoryListItem(category: CategoryListItem) {
  return {
    ...category,
    productCount: category._count.products,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
    _count: undefined,
  };
}

function formatCategoryDetail(category: NonNullable<CategoryDetail>) {
  return {
    ...category,
    productCount: category._count.products,
    products: category.products.map(formatProduct),
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
    _count: undefined,
  };
}

function handlePrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const target = Array.isArray(error.meta?.target) ? error.meta.target.join(", ") : "name or slug";
      throw new ValidationError("Validation failed", { [target]: [`Category ${target} already exists`] });
    }

    if (error.code === "P2025") {
      throw new NotFoundError("Category not found");
    }
  }

  throw error;
}

export async function getCategories(query: CategoryListQuery) {
  const result = await findCategories(query);

  return {
    categories: result.categories.map(formatCategoryListItem),
    pagination: result.pagination,
  };
}

export async function getCategoryById(id: string) {
  const category = await findCategoryById(id);

  if (!category) {
    throw new NotFoundError("Category not found");
  }

  return formatCategoryDetail(category);
}

export async function addCategory(payload: CreateCategoryRequest) {
  try {
    const category = await createCategory(payload);
    return formatCategoryDetail(category);
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function editCategory(id: string, payload: UpdateCategoryRequest) {
  await getCategoryById(id);

  try {
    const category = await updateCategory(id, payload);
    return formatCategoryDetail(category);
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function removeCategory(id: string) {
  try {
    await deleteCategory(id);
    return true;
  } catch (error) {
    handlePrismaError(error);
  }
}
