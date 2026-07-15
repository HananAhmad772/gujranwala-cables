import type { StockStatus } from "@/app/generated/prisma/client";
import type { Prisma } from "@/app/generated/prisma/client";

export type ProductImageRequest = {
  imageUrl: string;
  altText?: string | null;
  isPrimary?: boolean;
  sortOrder?: number;
};

export type CreateProductRequest = {
  name: string;
  slug: string;
  description: string;
  size?: string | null;
  coreType?: string | null;
  application?: string | null;
  price: string;
  stockStatus?: StockStatus;
  isActive?: boolean;
  featuredImage?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  specs?: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;
  brandId: string;
  categoryId: string;
  images?: ProductImageRequest[];
};

export type UpdateProductRequest = Partial<CreateProductRequest>;

export type ProductListQuery = {
  page: number;
  limit: number;
  search?: string;
  brandId?: string;
  categoryId?: string;
  stockStatus?: StockStatus;
  featured?: boolean;
  isActive?: boolean;
};

