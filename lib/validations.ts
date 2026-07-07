import type { ZodType } from "zod";
import { ZodError } from "zod";

export function validateBody<T>(schema: ZodType<T>, body: unknown): T {
  return schema.parse(body);
}

export function formatZodErrors(error: unknown): Record<string, string[]> {
  if (!(error instanceof ZodError)) {
    return { _error: ["Invalid request data"] };
  }

  return error.issues.reduce((acc: Record<string, string[]>, issue) => {
    const path = issue.path.join(".") || "_error";
    acc[path] = acc[path] ?? [];
    acc[path].push(issue.message);
    return acc;
  }, {});
}
