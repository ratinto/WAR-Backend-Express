import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { validationErrorResponse } from '../utils/responseFormatter';

/**
 * Middleware to handle validation errors from express-validator
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    validationErrorResponse(res, errors.array());
    return;
  }
  
  next();
};

/**
 * Helper to run validation chains
 * @param validations - Array of validation chains
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Run all validations
    for (const validation of validations) {
      await validation.run(req);
    }

    // Check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      validationErrorResponse(res, errors.array());
      return;
    }

    next();
  };
};
