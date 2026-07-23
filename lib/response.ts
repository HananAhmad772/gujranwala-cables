import { NextResponse } from "next/server";
import { ApiError } from "@/lib/errors";

export { parseRequestBody, objectToFormData } from "@/lib/request-body";

export function successResponse(data: any, message: string = "Success", code = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      message,
      code,
      data: data ?? null,
    },
    { status: code }
  );
}

export function errorResponse(message: string, code = 400): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
      code,
      data: null,
    },
    { status: code }
  );
}

// Keep legacy wrappers but update their shape to conform to new standard shapes
export function success(message: string, data: unknown = {}): NextResponse {
  return successResponse(data, message, 200);
}

export function created(message: string, data: unknown = {}): NextResponse {
  return successResponse(data, message, 201);
}

export function validation(message: string, errors?: unknown): NextResponse {
  // If a legacy validation function is called with custom error structure,
  // we extract the first error string or default message
  let errorMsg = message;
  if (errors && typeof errors === "object") {
    const errorObj = errors as Record<string, any>;
    if (errorObj._error && Array.isArray(errorObj._error) && errorObj._error[0]) {
      errorMsg = errorObj._error[0];
    } else {
      const keys = Object.keys(errorObj);
      if (keys.length > 0 && Array.isArray(errorObj[keys[0]]) && errorObj[keys[0]][0]) {
        errorMsg = errorObj[keys[0]][0];
      }
    }
  }
  return errorResponse(errorMsg, 400);
}

export function unauthorized(message = "Unauthorized"): NextResponse {
  return errorResponse(message, 401);
}

export function forbidden(message = "Forbidden"): NextResponse {
  return errorResponse(message, 403);
}

export function notFound(message = "Not Found"): NextResponse {
  return errorResponse(message, 404);
}

export function serverError(message = "Internal Server Error"): NextResponse {
  return errorResponse(message, 500);
}

export function apiError(error: ApiError): NextResponse {
  // Extract first error message from error.errors if present, to be extremely safe
  let message = error.message;
  if (error.errors && typeof error.errors === "object") {
    const errs = error.errors as Record<string, any>;
    if (errs._error && Array.isArray(errs._error) && errs._error[0]) {
      message = errs._error[0] as string;
    } else {
      const keys = Object.keys(errs);
      if (keys.length > 0 && Array.isArray(errs[keys[0]]) && errs[keys[0]][0]) {
        message = errs[keys[0]][0] as string;
      }
    }
  }
  return errorResponse(message, error.statusCode || 500);
}

