import { Request, Response, NextFunction } from 'express';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Create a Bad Request error (400)
 */
export class BadRequestError extends ApiError {
  constructor(message: string = 'Bad Request') {
    super(400, message);
  }
}

/**
 * Create an Unauthorized error (401)
 */
export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
  }
}

/**
 * Create a Forbidden error (403)
 */
export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden') {
    super(403, message);
  }
}

/**
 * Create a Not Found error (404)
 */
export class NotFoundError extends ApiError {
  constructor(message: string = 'Not Found') {
    super(404, message);
  }
}

/**
 * Create a Conflict error (409)
 */
export class ConflictError extends ApiError {
  constructor(message: string = 'Conflict') {
    super(409, message);
  }
}

/**
 * Create an Internal Server Error (500)
 */
export class InternalServerError extends ApiError {
  constructor(message: string = 'Internal Server Error') {
    super(500, message, false);
  }
}

/**
 * Async error handler wrapper
 * Wraps async route handlers to catch errors automatically
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
