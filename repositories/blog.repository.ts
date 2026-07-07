import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { BlogListQuery, CreateBlogRequest, UpdateBlogRequest } from "@/types/blog";

function buildBlogData(payload: CreateBlogRequest | UpdateBlogRequest) {
  const data: Prisma.BlogPostUpdateInput = {};

  if (payload.title !== undefined) data.title = payload.title;
  if (payload.slug !== undefined) data.slug = payload.slug;
  if (payload.excerpt !== undefined) data.excerpt = payload.excerpt;
  if (payload.content !== undefined) data.content = payload.content;
  if (payload.featuredImage !== undefined) data.featuredImage = payload.featuredImage;
  if (payload.metaTitle !== undefined) data.metaTitle = payload.metaTitle;
  if (payload.metaDescription !== undefined) data.metaDescription = payload.metaDescription;
  if (payload.status !== undefined) data.status = payload.status;
  if (payload.publishedAt !== undefined) data.publishedAt = payload.publishedAt;

  return data;
}

function buildBlogWhere(query: BlogListQuery): Prisma.BlogPostWhereInput {
  return {
    ...(query.search
      ? {
          OR: [
            { title: { contains: query.search, mode: "insensitive" as const } },
            { slug: { contains: query.search, mode: "insensitive" as const } },
            { excerpt: { contains: query.search, mode: "insensitive" as const } },
            { content: { contains: query.search, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(query.status ? { status: query.status } : {}),
  };
}

export async function findBlogs(query: BlogListQuery) {
  const where = buildBlogWhere(query);
  const skip = (query.page - 1) * query.limit;

  const [blogs, total] = await prisma.$transaction([
    prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: query.limit,
    }),
    prisma.blogPost.count({ where }),
  ]);

  return {
    blogs,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

export async function findBlogById(id: string) {
  return prisma.blogPost.findUnique({
    where: { id },
  });
}

export async function createBlog(payload: CreateBlogRequest) {
  return prisma.blogPost.create({
    data: buildBlogData(payload) as Prisma.BlogPostCreateInput,
  });
}

export async function updateBlog(id: string, payload: UpdateBlogRequest) {
  return prisma.blogPost.update({
    where: { id },
    data: buildBlogData(payload),
  });
}

export async function deleteBlog(id: string) {
  return prisma.blogPost.delete({
    where: { id },
    select: { id: true },
  });
}
