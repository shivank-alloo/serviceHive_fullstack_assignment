import { Document, Types } from 'mongoose';

export type UserRole = 'admin' | 'sales';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserPublic {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: string;
  role: UserRole;
}
