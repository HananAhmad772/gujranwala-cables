import { Prisma } from "@/app/generated/prisma/client";
import { NotFoundError, ValidationError } from "@/lib/errors";
import {
  brandExists,
  categoryExists,
  createProduct,
  deleteProduct,
  findProductById,
  findProductBySlug,
  findProducts,
  updateProduct,
} from "@/repositories/product.repository";
import type { CreateProductRequest, ProductListQuery, UpdateProductRequest } from "@/types/product";

type ProductWithRelations = Awaited<ReturnType<typeof findProductById>>;

function formatProduct(product: NonNullable<ProductWithRelations>) {
  return {
    ...product,
    price: product.price.toString(),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    images: product.images.map((image) => ({
      ...image,
      createdAt: image.createdAt.toISOString(),
    })),
  };
}

async function validateRelations(payload: Pick<CreateProductRequest, "brandId" | "categoryId"> | UpdateProductRequest) {
  const errors: Record<string, string[]> = {};

  if (payload.brandId && !(await brandExists(payload.brandId))) {
    errors.brandId = ["Brand does not exist"];
  }

  if (payload.categoryId && !(await categoryExists(payload.categoryId))) {
    errors.categoryId = ["Category does not exist"];
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError("Validation failed", errors);
  }
}

function handlePrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      throw new ValidationError("Validation failed", { slug: ["Slug already exists"] });
    }

    if (error.code === "P2025") {
      throw new NotFoundError("Product not found");
    }

    if (error.code === "P2003") {
      throw new ValidationError("Validation failed", { relation: ["Brand or category does not exist"] });
    }
  }

  throw error;
}

export async function getProducts(query: ProductListQuery) {
  const result = await findProducts(query);

  return {
    products: result.products.map(formatProduct),
    pagination: result.pagination,
  };
}

export async function getProductById(id: string) {
  const product = await findProductById(id);

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  return formatProduct(product);
}

export async function getProductBySlug(slug: string) {
  const product = await findProductBySlug(slug);

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  return formatProduct(product);
}

export async function addProduct(payload: CreateProductRequest) {
  await validateRelations(payload);

  try {
    const product = await createProduct(payload);
    return formatProduct(product);
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function editProduct(id: string, payload: UpdateProductRequest) {
  await getProductById(id);
  await validateRelations(payload);

  try {
    const product = await updateProduct(id, payload);
    return formatProduct(product);
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function removeProduct(id: string) {
  try {
    await deleteProduct(id);
    return true;
  } catch (error) {
    handlePrismaError(error);
  }
}
