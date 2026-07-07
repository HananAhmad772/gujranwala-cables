export type ApiResult<T> = {
  success: boolean;
  message: string;
  data: T;
};

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
};

export async function adminApi<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(path, {
    method: options.method ?? "GET",
    headers: options.body ? { "Content-Type": "application/json" } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: "include",
  });

  const result = (await response.json()) as ApiResult<T>;

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Request failed");
  }

  return result.data;
}
