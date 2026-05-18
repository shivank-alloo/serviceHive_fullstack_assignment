import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { verifyToken } from '../utils/jwt';
import { User } from '../models/User.model';

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Support both httpOnly cookie and Bearer token (for API clients)
    const token: string | undefined =
      (req.cookies as Record<string, string | undefined>)['token'] ??
      req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return next(ApiError.unauthorized('Authentication token is missing'));
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return next(ApiError.unauthorized('User no longer exists'));
    }

    req.user = user;
    next();
  } catch {
    next(ApiError.unauthorized('Invalid or expired token'));
  }
};
