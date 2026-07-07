export class ApiError extends Error {
  public statusCode: number;
  public errors?: Record<string, unknown>;

  constructor(message: string, statusCode = 500, errors?: Record<string, unknown>) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = this.constructor.name;
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class ValidationError extends ApiError {
  constructor(message = "Validation failed", errors: Record<string, unknown>) {
    super(message, 400, errors);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}
