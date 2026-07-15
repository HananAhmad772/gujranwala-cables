/**
 * Types and fetch helpers for public-facing API endpoints.
 * These are used by client components to load live data.
 */

export type ApiProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  size?: string | null;
  price: string;
  stockStatus: string;
  isActive: boolean;
  featuredImage?: string | null;
  specs?: { label: string; value: string }[] | null;
  category?: { id: string; name: string; slug: string } | null;
  brand?: { id: string; name: string; slug: string } | null;
  createdAt: string;
};

export type ApiCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
};

export type ApiBrand = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
  isActive: boolean;
  productCount?: number;
  createdAt: string;
};

export type ApiBlog = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  featuredImage?: string | null;
  status: string;
  publishedAt?: string | null;
  createdAt: string;
};

export type ApiReview = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
};

export type ApiFaq = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  createdAt: string;
};

async function apiFetch<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success) return null;
    return json.data as T;
  } catch {
    return null;
  }
}

export async function fetchPublicProducts(): Promise<ApiProduct[]> {
  const data = await apiFetch<{ products: ApiProduct[] }>("/api/products?page=1&limit=50&isActive=true");
  return data?.products ?? [];
}

export async function fetchPublicCategories(): Promise<ApiCategory[]> {
  const data = await apiFetch<{ categories: ApiCategory[] }>("/api/categories?page=1&limit=100&isActive=true");
  return data?.categories ?? [];
}

export async function fetchPublicBrands(): Promise<ApiBrand[]> {
  const data = await apiFetch<{ brands: ApiBrand[] }>("/api/brands?page=1&limit=100&isActive=true");
  return data?.brands ?? [];
}

export async function fetchPublicBlogs(): Promise<ApiBlog[]> {
  const data = await apiFetch<{ blogs: ApiBlog[] }>("/api/blogs?page=1&limit=50&status=PUBLISHED");
  return data?.blogs ?? [];
}

export async function fetchPublicReviews(): Promise<ApiReview[]> {
  const data = await apiFetch<{ reviews: ApiReview[] }>("/api/reviews?page=1&limit=20&status=APPROVED");
  return data?.reviews ?? [];
}

export async function fetchPublicFaqs(): Promise<ApiFaq[]> {
  const data = await apiFetch<{ faqs: ApiFaq[] }>("/api/faqs?page=1&limit=50");
  return data?.faqs ?? [];
}
