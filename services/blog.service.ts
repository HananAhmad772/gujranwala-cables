import { Prisma } from "@/app/generated/prisma/client";
import { NotFoundError, ValidationError } from "@/lib/errors";
import {
  createBlog,
  deleteBlog,
  findBlogById,
  findBlogs,
  updateBlog,
} from "@/repositories/blog.repository";
import type { BlogListQuery, CreateBlogRequest, UpdateBlogRequest } from "@/types/blog";

type Blog = NonNullable<Awaited<ReturnType<typeof findBlogById>>>;

function formatBlog(blog: Blog) {
  return {
    ...blog,
    publishedAt: blog.publishedAt?.toISOString() ?? null,
    createdAt: blog.createdAt.toISOString(),
    updatedAt: blog.updatedAt.toISOString(),
  };
}

function handlePrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      throw new ValidationError("Validation failed", { slug: ["Slug already exists"] });
    }

    if (error.code === "P2025") {
      throw new NotFoundError("Blog post not found");
    }
  }

  throw error;
}

export async function getBlogs(query: BlogListQuery) {
  const result = await findBlogs(query);

  return {
    blogs: result.blogs.map(formatBlog),
    pagination: result.pagination,
  };
}

export async function getBlogById(id: string) {
  const blog = await findBlogById(id);

  if (!blog) {
    throw new NotFoundError("Blog post not found");
  }

  return formatBlog(blog);
}

export async function addBlog(payload: CreateBlogRequest) {
  try {
    const blog = await createBlog(payload);
    return formatBlog(blog);
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function editBlog(id: string, payload: UpdateBlogRequest) {
  await getBlogById(id);

  try {
    const blog = await updateBlog(id, payload);
    return formatBlog(blog);
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function removeBlog(id: string) {
  try {
    await deleteBlog(id);
    return true;
  } catch (error) {
    handlePrismaError(error);
  }
}
