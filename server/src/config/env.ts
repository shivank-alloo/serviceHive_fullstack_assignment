import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  NODE_ENV: (process.env['NODE_ENV'] ?? 'development') as 'development' | 'production' | 'test',
  PORT: parseInt(process.env['PORT'] ?? '5000', 10),
  MONGO_URI: requireEnv('MONGO_URI'),
  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env['JWT_EXPIRES_IN'] ?? '7d',
  CLIENT_URL: process.env['CLIENT_URL'] ?? 'http://localhost:5173',
  BCRYPT_SALT_ROUNDS: parseInt(process.env['BCRYPT_SALT_ROUNDS'] ?? '12', 10),
} as const;
