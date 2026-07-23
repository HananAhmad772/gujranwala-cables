import { ApiError } from "@/lib/errors";

function coerceFormValue(value: string): unknown {
  const trimmed = value.trim();

  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null") return null;
  if (trimmed === "") return "";

  if (
    (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
    (trimmed.startsWith("{") && trimmed.endsWith("}"))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return value;
    }
  }

  return value;
}

function appendFormValue(data: Record<string, unknown>, key: string, value: unknown) {
  if (value instanceof File) {
    data[key] = value;
    return;
  }

  const coerced = typeof value === "string" ? coerceFormValue(value) : value;

  if (Object.prototype.hasOwnProperty.call(data, key)) {
    if (Array.isArray(data[key])) {
      (data[key] as unknown[]).push(coerced);
    } else {
      data[key] = [data[key], coerced];
    }
    return;
  }

  data[key] = coerced;
}

export function formDataToObject(formData: FormData): Record<string, unknown> {
  const data: Record<string, unknown> = {};

  formData.forEach((value, key) => {
    appendFormValue(data, key, value);
  });

  return data;
}

function urlEncodedToObject(text: string): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  const params = new URLSearchParams(text);

  params.forEach((value, key) => {
    appendFormValue(data, key, value);
  });

  return data;
}

export async function parseRequestBody(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";

  if (contentType.includes("multipart/form-data")) {
    try {
      return formDataToObject(await request.formData());
    } catch {
      throw new ApiError("Invalid form data payload", 400);
    }
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    try {
      return urlEncodedToObject(await request.text());
    } catch {
      throw new ApiError("Invalid form data payload", 400);
    }
  }

  if (contentType.includes("application/json")) {
    try {
      const parsed = await request.json();
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
      return { value: parsed };
    } catch {
      throw new ApiError("Invalid JSON payload", 400);
    }
  }

  const cloned = request.clone();

  try {
    const text = await request.text();
    if (!text.trim()) {
      return {};
    }

    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
      return { value: parsed };
    } catch {
      if (text.includes("=")) {
        return urlEncodedToObject(text);
      }

      try {
        const formData = await cloned.formData();
        if (Array.from(formData.keys()).length > 0) {
          return formDataToObject(formData);
        }
      } catch {
        // Ignore and throw below.
      }

      throw new ApiError("Invalid request payload", 400);
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError("Unable to read request body", 400);
  }
}

export function objectToFormData(body: Record<string, unknown>): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(body)) {
    if (value === undefined) continue;

    if (value === null) {
      formData.append(key, "null");
      continue;
    }

    if (value instanceof Blob) {
      formData.append(key, value);
      continue;
    }

    if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
      continue;
    }

    formData.append(key, String(value));
  }

  return formData;
}
