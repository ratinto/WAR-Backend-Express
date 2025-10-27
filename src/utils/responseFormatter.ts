import { Response } from 'express';

interface SuccessResponse<T = any> {
  success: true;
  message?: string;
  data?: T;
}

interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
  statusCode?: number;
}

/**
 * Format success response
 * @param res - Express response object
 * @param data - Data to send
 * @param message - Optional success message
 * @param statusCode - HTTP status code (default: 200)
 */
export function successResponse<T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode: number = 200
): Response<SuccessResponse<T>> {
  return res.status(statusCode).json({
    success: true,
    ...(message && { message }),
    ...(data && { data })
  });
}

/**
 * Format error response
 * @param res - Express response object
 * @param error - Error message
 * @param statusCode - HTTP status code (default: 400)
 * @param details - Additional error details
 */
export function errorResponse(
  res: Response,
  error: string,
  statusCode: number = 400,
  details?: any
): Response<ErrorResponse> {
  return res.status(statusCode).json({
    success: false,
    error,
    ...(details && { details }),
    statusCode
  });
}

/**
 * Format validation error response
 * @param res - Express response object
 * @param errors - Validation errors
 */
export function validationErrorResponse(
  res: Response,
  errors: any[]
): Response {
  return res.status(400).json({
    success: false,
    error: 'Validation failed',
    errors,
    statusCode: 400
  });
}

/**
 * Format not found response
 * @param res - Express response object
 * @param resource - Resource name
 */
export function notFoundResponse(
  res: Response,
  resource: string = 'Resource'
): Response {
  return res.status(404).json({
    success: false,
    error: `${resource} not found`,
    statusCode: 404
  });
}

/**
 * Format unauthorized response
 * @param res - Express response object
 * @param message - Custom message
 */
export function unauthorizedResponse(
  res: Response,
  message: string = 'Unauthorized'
): Response {
  return res.status(401).json({
    success: false,
    error: message,
    statusCode: 401
  });
}
