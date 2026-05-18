import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError';

/**
 * Reads express-validator results and short-circuits with a 400 if any fail.
 * Always place this after your `body()` / `param()` chains in a route.
 */
export const validate = (req: Request, _res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg as string);
    return next(ApiError.badRequest('Validation failed', messages));
  }
  next();
};
