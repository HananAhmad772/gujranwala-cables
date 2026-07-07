import { NextResponse } from "next/server";
import type { ApiError } from "@/lib/errors";

const buildResponse = (body: Record<string, unknown>, status: number) => {
  return NextResponse.json(body, { status });
};

export function success(message: string, data: unknown = {}): NextResponse {
  return buildResponse({ success: true, message, data }, 200);
}

export function created(message: string, data: unknown = {}): NextResponse {
  return buildResponse({ success: true, message, data }, 201);
}

export function validation(message: string, errors: unknown): NextResponse {
  return buildResponse({ success: false, message, errors }, 400);
}

export function unauthorized(message = "Unauthorized"): NextResponse {
  return buildResponse({ success: false, message }, 401);
}

export function forbidden(message = "Forbidden"): NextResponse {
  return buildResponse({ success: false, message }, 403);
}

export function notFound(message = "Not Found"): NextResponse {
  return buildResponse({ success: false, message }, 404);
}

export function serverError(message = "Internal Server Error"): NextResponse {
  return buildResponse({ success: false, message }, 500);
}

export function apiError(error: ApiError): NextResponse {
  return buildResponse(
    {
      success: false,
      message: error.message,
      ...(error.errors ? { errors: error.errors } : {}),
    },
    error.statusCode,
  );
}
