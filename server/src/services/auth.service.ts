import { User } from '../models/User.model';
import { ApiError } from '../utils/ApiError';
import { signToken } from '../utils/jwt';
import { RegisterPayload, LoginPayload, IUserPublic } from '../types/user.types';

export class AuthService {
  async register(payload: RegisterPayload): Promise<{ user: IUserPublic; token: string }> {
    const existingUser = await User.findOne({ email: payload.email.toLowerCase() });
    if (existingUser) {
      throw ApiError.conflict('An account with this email already exists');
    }

    const user = await User.create({
      name: payload.name,
      email: payload.email.toLowerCase(),
      password: payload.password,
      role: payload.role ?? 'sales',
    });

    const token = signToken({ userId: user._id.toString(), role: user.role });

    const userPublic: IUserPublic = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    return { user: userPublic, token };
  }

  async login(payload: LoginPayload): Promise<{ user: IUserPublic; token: string }> {
    const user = await User.findOne({ email: payload.email.toLowerCase() }).select('+password');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(payload.password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const token = signToken({ userId: user._id.toString(), role: user.role });

    const userPublic: IUserPublic = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    return { user: userPublic, token };
  }

  async getMe(userId: string): Promise<IUserPublic> {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}

export const authService = new AuthService();
