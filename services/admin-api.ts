import { objectToFormData } from "@/lib/request-body";

export type ApiResult<T> = {
  success: boolean;
  message: string;
  data: T;
};

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: Record<string, unknown> | FormData;
};

export async function adminApiRequest<T>(path: string, options: RequestOptions = {}): Promise<{ data: T; message: string }> {
  let body: BodyInit | undefined;

  if (options.body instanceof FormData) {
    body = options.body;
  } else if (options.body) {
    body = objectToFormData(options.body);
  }

  const response = await fetch(path, {
    method: options.method ?? "GET",
    body,
    credentials: "include",
  });

  const result = (await response.json()) as ApiResult<T>;

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Request failed");
  }

  return { data: result.data, message: result.message };
}

export async function adminApi<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { data } = await adminApiRequest<T>(path, options);
  return data;
}
