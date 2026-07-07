import type { BlogStatus } from "@/app/generated/prisma/enums";

export type CreateBlogRequest = {
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  featuredImage?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  status?: BlogStatus;
  publishedAt?: Date | null;
};

export type UpdateBlogRequest = Partial<CreateBlogRequest>;

export type BlogListQuery = {
  page: number;
  limit: number;
  search?: string;
  status?: BlogStatus;
};
