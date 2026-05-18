import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { UserRole } from '../types/user.types';

/**
 * Factory middleware that restricts access to one or more roles.
 * Must be used AFTER the `authenticate` middleware.
 *
 * @example router.delete('/:id', authenticate, requireRole('admin'), deleteLeadHandler)
 */
export const requireRole =
  (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }

    if (!roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`,
        ),
      );
    }

    next();
  };
