import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { authService } from '../services/auth.service';
import { COOKIE_OPTIONS } from '../utils/jwt';
import { RegisterPayload, LoginPayload } from '../types/user.types';

export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const payload = req.body as RegisterPayload;
  const { user, token } = await authService.register(payload);

  res.cookie('token', token, COOKIE_OPTIONS);
  res.status(201).json(new ApiResponse({ user, token }, 'Account created successfully'));
});

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const payload = req.body as LoginPayload;
  const { user, token } = await authService.login(payload);

  res.cookie('token', token, COOKIE_OPTIONS);
  res.status(200).json(new ApiResponse({ user, token }, 'Logged in successfully'));
});

export const logout = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie('token', { ...COOKIE_OPTIONS, maxAge: 0 });
  res.status(200).json(new ApiResponse(null, 'Logged out successfully'));
});

export const getMe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await authService.getMe(req.user!._id.toString());
  res.status(200).json(new ApiResponse(user, 'User fetched successfully'));
});
