import type { ZodType } from "zod";
import { ZodError } from "zod";

export function validateBody<T>(schema: ZodType<T>, body: unknown): T {
  return schema.parse(body);
}

export function formatFirstZodError(error: ZodError): string {
  const issue = error.issues[0];
  if (!issue) return "Validation failed";

  console.log("DEBUG formatFirstZodError issue:", JSON.stringify(issue, null, 2));

  const msg = issue.message;

  const isRequired =
    msg === "Required" ||
    msg.toLowerCase() === "required" ||
    msg.toLowerCase().includes("received undefined") ||
    (issue.code === "invalid_type" && (issue as any).received === "undefined");

  if (isRequired) {
    const fieldName = issue.path.length > 0 ? String(issue.path[issue.path.length - 1]) : "Field";
    const formattedField = fieldName
      .replace(/([A-Z])/g, " $1")
      .replace(/[_-]/g, " ")
      .trim();
    const capitalizedField = formattedField.charAt(0).toUpperCase() + formattedField.slice(1).toLowerCase();
    return `${capitalizedField} is required`;
  }

  const code = issue.code as string;
  if (code === "invalid_string" && (issue as any).validation === "email") {
    return "Please enter a valid email address";
  }

  if (msg.toLowerCase().includes("invalid email")) {
    return "Please enter a valid email address";
  }

  return msg;
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

